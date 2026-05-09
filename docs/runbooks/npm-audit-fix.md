# Runbook: `npm audit fix` — security vulnerabilities

**Last reviewed**: 2026-05-09 (Wave 8 W8-05)
**Owner**: Project maintainer

---

## Why this runbook exists

`npm audit fix` reports + fixes known security vulnerabilities in dependencies. Wave 7 attempt to run this from agent sandbox failed with `EPERM: operation not permitted` because Vite's dev server holds file locks on `node_modules/`. This runbook is the user-side procedure.

As of Wave 8 (npm audit), the project has **9 tracked vulnerabilities** (1 critical, 4 high, 4 moderate). All have non-breaking fixes available.

---

## When to run

- Before each release
- Monthly maintenance window
- When npm audit alerts arrive on PR/CI
- After adding new dependencies

---

## Procedure

### 1. Stop all background processes locking `node_modules`

```bash
# In every terminal running `npm run dev`:
# Press Ctrl+C to stop Vite
```

If VS Code has the project open, close it (Vite extension can hold locks).

If Windows tasks are stuck:
```powershell
# PowerShell — kill any orphan node processes from this project
Get-Process node | Stop-Process -Force
```

### 2. Verify locks released

```bash
# This should succeed without EPERM:
npm install --dry-run
```

If you see `EPERM`, repeat step 1.

### 3. Apply non-breaking fixes

```bash
npm audit fix
```

Expected output: ~7-8 packages updated (dompurify, jspdf, flatted, lodash, ajv, brace-expansion, follow-redirects, monaco-editor cascade).

### 4. Verify build still passes

```bash
npx tsc -b --noEmit
npm run build
```

Both must succeed before committing.

### 5. Smoke test in browser

```bash
npm run dev
```

Login + navigate:
- KT Reports landing page
- Sales Invoice list
- Cash Book
- Step10Payment with milestones (if test data exists)

Check browser console for new errors.

### 6. Commit

```bash
git add package.json package-lock.json
git commit -m "Wave 8 W8-05: npm audit fix (non-breaking — 8 packages)"
```

---

## Optional: breaking change axios upgrade

`axios <= 1.15.1` has 18 advisories (high severity). Fix requires `axios@1.16.0` which is **breaking** (NO_PROXY hostname normalization changes, header injection rules, prototype pollution gates).

```bash
# Read axios CHANGELOG first:
# https://github.com/axios/axios/blob/v1.x/CHANGELOG.md

npm audit fix --force
```

After force upgrade:
1. Re-run full smoke test
2. Test all API integrations:
   - Login flow (uses axios)
   - File upload (Wave 7 W7-01 EvidenceUpload)
   - GraphQL endpoint (uses Apollo, not axios — should be unaffected)
3. Test backfill tool (Wave 7 W7-03)
4. Defer this until you have time to investigate any regressions

---

## Tracked vulnerabilities (Wave 7 audit snapshot)

| Package | Severity | Fix type |
|---|---|---|
| `axios <= 1.15.1` | High (18 advisories) | Breaking → `npm audit fix --force` |
| `dompurify <= 3.3.3` | Moderate (8 advisories) | Non-breaking |
| `jspdf <= 4.2.0` | **Critical** (2 advisories) | Non-breaking |
| `flatted <= 3.4.1` | High (2 advisories) | Non-breaking |
| `lodash <= 4.17.23` | High | Non-breaking |
| `ajv < 6.14.0` | Moderate | Non-breaking |
| `brace-expansion` | Moderate (2 advisories) | Non-breaking |
| `follow-redirects <= 1.15.11` | Moderate | Non-breaking |
| `monaco-editor` (dompurify cascade) | Moderate | Non-breaking |

Run `npm audit` after each fix to refresh the list — versions and advisories change weekly.

---

## Troubleshooting

### `EPERM: operation not permitted, unlink ...` persists

Other processes holding file locks. Solutions:
- Close all editors/IDEs
- Reboot if locks persist after killing all node processes
- On Windows: check Task Manager for orphan node.exe processes

### `npm audit fix` makes build fail

Some sub-dependency had a breaking change. Roll back:
```bash
git checkout package.json package-lock.json
npm install
```

Then upgrade individual packages one at a time:
```bash
npm install <pkg>@<version> --save
npm run build
# If OK, continue. If fails, try a different version.
```

### CI failure after upgrade

Snapshot tests may need regeneration:
```bash
npm test -- --updateSnapshot
```
(if Jest in use; this project doesn't have tests at time of writing)

---

## Audit cadence recommendation

- **Weekly**: `npm audit` (read-only check, no fix)
- **Monthly**: `npm audit fix` (non-breaking)
- **Quarterly**: `npm audit fix --force` (breaking, in dev branch first)
- **Pre-release**: `npm audit` must show 0 critical/high before merging release branch
