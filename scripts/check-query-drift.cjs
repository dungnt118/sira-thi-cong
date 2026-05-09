#!/usr/bin/env node
/**
 * Wave 8 W8-02 — Schema-Query Drift Detector
 *
 * Walks `src/services/core-contracts/queries/*.queries.ts` and matches with
 * `src/services/core-contracts/types/*.types.ts`. Detects:
 *   - HIGH:   Field declared in interface but missing from FIND_*_DTO / QUERY_*_DTO selects
 *   - MEDIUM: Selected `*_id` field but missing companion `idx_*_id`
 *
 * Usage:
 *   node scripts/check-query-drift.cjs           # Report only
 *   node scripts/check-query-drift.cjs --fix     # Auto-insert missing fields (idempotent)
 *   node scripts/check-query-drift.cjs --json    # Machine-readable output (CI)
 *   node scripts/check-query-drift.cjs --quiet   # Only print drift (suppress OK files)
 *
 * Exit codes:
 *   0 = no drift detected
 *   1 = drift found (CI fail)
 *   2 = script error (file read, parse error)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUERIES_DIR = path.join(ROOT, 'src/services/core-contracts/queries');
const TYPES_DIR = path.join(ROOT, 'src/services/core-contracts/types');

const args = process.argv.slice(2);
const FIX_MODE = args.includes('--fix');
const JSON_MODE = args.includes('--json');
const QUIET = args.includes('--quiet');

/* ─── Helpers ─────────────────────────────────────────────────── */

const log = (...a) => { if (!JSON_MODE) console.log(...a); };

/**
 * Extract field names from main interface (the one matching pascalCase of file name).
 * Skips the `*Input` interface (used for create/update — different shape).
 * Also skips deeply nested item interfaces (IActionsItem, ISignaturesItem...).
 */
function extractTypeFields(typesPath, schemaName) {
    if (!fs.existsSync(typesPath)) return null;
    const content = fs.readFileSync(typesPath, 'utf8');
    // Match: export interface I<SchemaName> { ... }
    const reMain = new RegExp(`export\\s+interface\\s+I${schemaName}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm');
    const match = content.match(reMain);
    if (!match) return null;
    const body = match[1];
    const fields = new Set();
    const fieldRe = /^\s*(?:\/\/.*\n\s*)?(\w+)\??:\s*[^;]+;/gm;
    let m;
    while ((m = fieldRe.exec(body)) !== null) {
        const name = m[1];
        // Skip leaked TS keywords / nested structures
        if (name === 'extends' || name === 'implements') continue;
        fields.add(name);
    }
    return fields;
}

/**
 * Extract selected fields from a single GraphQL query gql template literal body.
 * Walks character-by-character tracking brace depth; captures fields directly
 * inside the FIRST `data {...}` block at depth 0.
 *
 * Note: queryBlock has form:
 *   "  query FooDto($f: ...) {
 *      response: find_X_dto(...) {
 *        code
 *        message
 *        data {
 *          _id
 *          field1
 *          ...
 *          nested { ... }
 *        }
 *      }
 *    }"
 * (no closing backtick — stripped before passing in)
 */
function extractQuerySelects(queryBlock) {
    const fields = new Set();
    // Find first `data {`
    let dataIdx = queryBlock.indexOf('data {');
    if (dataIdx === -1) dataIdx = queryBlock.indexOf('data{');
    if (dataIdx === -1) return fields;
    // Find the `{` that starts the data block
    let startIdx = queryBlock.indexOf('{', dataIdx) + 1;
    // Walk: when at depth 1 (direct children of data), capture identifiers.
    // When `{` opens at depth 1, depth becomes 2 — skip that block until matching `}`.
    let depth = 1;
    let i = startIdx;
    while (i < queryBlock.length && depth > 0) {
        const c = queryBlock[i];
        if (c === '{') {
            depth++;
            i++;
            continue;
        }
        if (c === '}') {
            depth--;
            i++;
            continue;
        }
        // At depth 1, look for identifiers
        if (depth === 1 && /[A-Za-z_]/.test(c)) {
            // Read identifier
            let j = i;
            while (j < queryBlock.length && /\w/.test(queryBlock[j])) j++;
            const name = queryBlock.slice(i, j);
            if (name) fields.add(name);
            i = j;
            continue;
        }
        i++;
    }
    return fields;
}

/**
 * Locate FIND_*_DTO and QUERY_*_DTO blocks in queries file.
 * Returns array of { name, body, startIdx, endIdx } where body is the full gql`` template.
 */
function findQueryBlocks(content) {
    const blocks = [];
    const re = /export\s+const\s+(FIND|QUERY)_(\w+)_DTO\s*=\s*gql`/g;
    let m;
    while ((m = re.exec(content)) !== null) {
        const startIdx = m.index;
        const gqlStart = m.index + m[0].length;
        // Find closing backtick (assume no nested templates)
        let i = gqlStart;
        while (i < content.length && content[i] !== '`') i++;
        if (i >= content.length) continue;
        const body = content.slice(gqlStart, i);
        const queryName = `${m[1]}_${m[2]}_DTO`;
        blocks.push({ name: queryName, body, startIdx, gqlStart, endIdx: i });
    }
    return blocks;
}

/**
 * Map a queries file basename → (schemaName for types, kind=FIND|QUERY)
 * Examples:
 *   workTask.queries.ts → schemaName=WorkTask
 *   paymentRequest.queries.ts → schemaName=PaymentRequest
 */
function deriveSchemaName(queryFileBase) {
    // queryFileBase = "workTask" / "paymentRequest"
    return queryFileBase.charAt(0).toUpperCase() + queryFileBase.slice(1);
}

/* ─── Drift detection per file ───────────────────────────────── */

const drifts = []; // { file, queryName, missing: [], idxMissing: [] }
const fixedFiles = new Set();

const queryFiles = fs.readdirSync(QUERIES_DIR).filter(f => f.endsWith('.queries.ts'));

for (const qf of queryFiles) {
    const qfPath = path.join(QUERIES_DIR, qf);
    const queryFileBase = qf.replace('.queries.ts', '');
    const schemaName = deriveSchemaName(queryFileBase);
    const typesPath = path.join(TYPES_DIR, `${queryFileBase}.types.ts`);

    const typeFields = extractTypeFields(typesPath, schemaName);
    if (!typeFields) {
        // No matching types file or no main interface — skip, don't report
        continue;
    }

    const content = fs.readFileSync(qfPath, 'utf8');
    const blocks = findQueryBlocks(content);

    for (const block of blocks) {
        const selected = extractQuerySelects(block.body);
        const missing = [];
        const idxMissing = [];

        for (const f of typeFields) {
            // Skip TS-only fields that won't be in GraphQL
            if (f === '_id') continue; // always selected
            // Skip fields that match `idx_*` pattern — they go with their pair
            // but report if their pair is selected without them (handled below)
            if (!selected.has(f)) {
                missing.push(f);
            }
        }
        // idx_* companion check: for every selected `*_id` field, check `idx_*_id` selected too
        for (const sel of selected) {
            if (/_id$/.test(sel) && sel !== '_id' && sel !== 'documentId' && sel !== 'worktaskId') {
                const idxName = 'idx_' + sel;
                if (typeFields.has(idxName) && !selected.has(idxName)) {
                    idxMissing.push(idxName);
                }
            }
        }

        if (missing.length > 0 || idxMissing.length > 0) {
            drifts.push({
                file: qf,
                queryName: block.name,
                missing,
                idxMissing,
                blockStart: block.gqlStart,
                blockEnd: block.endIdx,
            });
        }
    }

    // Apply fix mode
    if (FIX_MODE) {
        const fileDrifts = drifts.filter(d => d.file === qf);
        if (fileDrifts.length === 0) continue;
        let newContent = content;
        // Apply fixes in reverse order so indices stay valid
        for (const d of fileDrifts.slice().sort((a, b) => b.blockStart - a.blockStart)) {
            const allMissing = [...d.missing, ...d.idxMissing];
            if (allMissing.length === 0) continue;
            // Insert before the closing `}` of `data { ... }` block — the LAST one before backtick
            const blockBody = newContent.slice(d.blockStart, d.blockEnd);
            // Find last "data { ... }" closing — use regex that captures the full data block
            const dataCloseRe = /(\n\s+)\}\s*(\n\s+\}\s*\n\s+\}\s*$)/;
            const dataMatch = blockBody.match(dataCloseRe);
            if (!dataMatch) continue;
            const indent = dataMatch[1].replace(/\n/, '');
            const insertion = '\n' + allMissing.map(f => indent + f).join('\n');
            const insertAt = d.blockStart + dataMatch.index;
            newContent = newContent.slice(0, insertAt) + insertion + newContent.slice(insertAt);
        }
        if (newContent !== content) {
            fs.writeFileSync(qfPath, newContent, 'utf8');
            fixedFiles.add(qf);
        }
    }
}

/* ─── Output ─────────────────────────────────────────────────── */

if (JSON_MODE) {
    console.log(JSON.stringify({
        totalFilesScanned: queryFiles.length,
        driftCount: drifts.length,
        fixedFiles: [...fixedFiles],
        drifts,
    }, null, 2));
} else {
    log('📋 Schema-Query Drift Report');
    log('─'.repeat(60));
    log(`Files scanned: ${queryFiles.length}`);

    if (drifts.length === 0) {
        log('✅ No drift detected. All query select clauses match interface fields.');
    } else {
        const byFile = {};
        for (const d of drifts) {
            if (!byFile[d.file]) byFile[d.file] = [];
            byFile[d.file].push(d);
        }
        for (const [file, fileDrifts] of Object.entries(byFile)) {
            log(`\n─ ${file} ─`);
            for (const d of fileDrifts) {
                if (d.missing.length > 0) {
                    log(`  ⚠️  ${d.queryName} missing fields: ${d.missing.join(', ')}`);
                }
                if (d.idxMissing.length > 0) {
                    log(`  ⚠️  ${d.queryName} missing idx companions: ${d.idxMissing.join(', ')}`);
                }
            }
        }
        log(`\n─ Total: ${Object.keys(byFile).length} file(s), ${drifts.reduce((s, d) => s + d.missing.length + d.idxMissing.length, 0)} missing field(s)`);
    }

    if (FIX_MODE && fixedFiles.size > 0) {
        log(`\n🔧 Auto-fixed ${fixedFiles.size} file(s):`);
        for (const f of fixedFiles) log(`  + ${f}`);
        log(`\n⚠️  Review changes with git diff before committing.`);
    }
}

// Exit code
if (drifts.length > 0 && !FIX_MODE) {
    process.exit(1);
}
process.exit(0);
