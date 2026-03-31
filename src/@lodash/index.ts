import { getFileLink } from 'app/services/storeService';
import __ from 'lodash';
import moment from 'moment';

/**
 * You can extend Lodash with mixins
 * And use it as below
 * import _ from '@lodash'
 */

// Optimized Template Cache for mergeStringWithObject
class OptimizedTemplateCache {
    private cache = new Map<string, {
        result: string,
        lastUsed: number,
        size: number
    }>();
    private maxItems = 100;
    private maxMemorySize = 10 * 1024 * 1024; // 10MB limit
    private currentMemorySize = 0;
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Auto cleanup mỗi 5 phút
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }

    get(key: string): string | undefined {
        const item = this.cache.get(key);
        if (!item) return undefined;

        // Update last used
        item.lastUsed = Date.now();
        this.cache.set(key, item);
        return item.result;
    }

    set(key: string, result: string): void {
        const itemSize = this.calculateSize(key, result);

        // Cleanup nếu vượt quá limit
        while (
            (this.cache.size >= this.maxItems ||
                this.currentMemorySize + itemSize > this.maxMemorySize) &&
            this.cache.size > 0
        ) {
            this.evictOldest();
        }

        this.cache.set(key, {
            result,
            lastUsed: Date.now(),
            size: itemSize
        });
        this.currentMemorySize += itemSize;
    }

    private calculateSize(key: string, result: string): number {
        // Ước tính memory size (bytes)
        return (key.length + result.length) * 2; // UTF-16 encoding
    }

    private evictOldest(): void {
        let oldestKey: string | undefined;
        let oldestTime = Date.now();

        Array.from(this.cache.entries()).forEach(([key, item]) => {
            if (item.lastUsed < oldestTime) {
                oldestTime = item.lastUsed;
                oldestKey = key;
            }
        });

        if (oldestKey) {
            const item = this.cache.get(oldestKey)!;
            this.currentMemorySize -= item.size;
            this.cache.delete(oldestKey);
        }
    }

    private cleanup(): void {
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30 phút

        Array.from(this.cache.entries()).forEach(([key, item]) => {
            if (now - item.lastUsed > maxAge) {
                this.currentMemorySize -= item.size;
                this.cache.delete(key);
            }
        });
    }

    getStats(): { size: number, memorySize: number, maxItems: number } {
        return {
            size: this.cache.size,
            memorySize: this.currentMemorySize,
            maxItems: this.maxItems
        };
    }

    clear(): void {
        this.cache.clear();
        this.currentMemorySize = 0;
    }

    destroy(): void {
        clearInterval(this.cleanupInterval);
        this.clear();
    }
}

// Global cache instance
const templateCache = new OptimizedTemplateCache();

// Thêm hàm normalizeHtmlText trước các hàm mixin
function normalizeHtmlText(text: string): string {
    // Early exit nếu không cần xử lý
    if (!text.includes('&') && !text.includes('\u201C') && !text.includes('\u201D') &&
        !text.includes('\u2018') && !text.includes('\u2019')) {
        return text;
    }

    // Xử lý HTML entities
    if (text.includes('&')) {
        text = text.replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
            .replaceAll('&nbsp;', ' ')
            .replaceAll("&amp;", "&")
            .replace(/'/g, "'")
            .replace(/'/g, "'")
            .replace(/"/g, '"')
            .replace(/"/g, '"');
    }

    // Xử lý smart quotes - sử dụng Unicode escape sequences
    if (text.includes('\u201C') || text.includes('\u201D') || text.includes('\u2018') || text.includes('\u2019')) {
        text = text.replace(/\u201C/g, '"')  // Left double quotation mark
            .replace(/\u201D/g, '"')  // Right double quotation mark
            .replace(/\u2018/g, "'")  // Left single quotation mark
            .replace(/\u2019/g, "'"); // Right single quotation mark
    }

    return text;
}
// Helper functions for cache key generation
function createSafeCacheKey(template: string, context: any): string {
    // Giới hạn độ dài template để tránh key quá lớn
    const maxTemplateLength = 1000;
    const truncatedTemplate = template.length > maxTemplateLength
        ? template.substring(0, maxTemplateLength) + '...'
        : template;

    // Tạo hash cho context (chỉ lấy các key cần thiết)
    const usedKeys = extractUsedKeys(template);
    const relevantContext: { [key: string]: any } = {};
    usedKeys.forEach(key => {
        if (context.hasOwnProperty(key)) {
            relevantContext[key] = context[key];
        }
    });

    // Giới hạn độ dài context để tránh key quá lớn
    const contextStr = JSON.stringify(relevantContext);
    const maxContextLength = 2000;
    const truncatedContext = contextStr.length > maxContextLength
        ? contextStr.substring(0, maxContextLength) + '...'
        : contextStr;

    return hashString(truncatedTemplate + truncatedContext);
}

function extractUsedKeys(template: string): string[] {
    const matches = template.match(/\$\{([^}]+)\}/g) || [];
    return Array.from(new Set(matches.map(match => {
        const key = match.replace(/\$\{([^}]+)\}/, '$1');
        return key.split('.')[0]; // Lấy key gốc
    })));
}

function hashString(str: string): string {
    // 1. Content hash đơn giản nhưng hiệu quả
    let hash = 0;
    const prime = 31;
    const mod = 1e9 + 7;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash * prime) % mod + char) % mod;
    }

    // 2. Thêm salt từ string properties để tránh collision
    const salt = str.length + (str.charCodeAt(0) || 0) + (str.charCodeAt(str.length - 1) || 0);
    hash = (hash * prime + salt) % mod;

    // 3. Thêm checksum để phát hiện corruption
    let checksum = 0;
    for (let i = 0; i < str.length; i += 2) {
        checksum = (checksum + str.charCodeAt(i)) % 256;
    }
    hash = (hash * prime + checksum) % mod;

    return hash.toString(36);
}

// Extend lodash interface với custom functions
declare module 'lodash' {
    interface LoDashStatic {
        setIn<T>(state: T, name: string, value: any): T;
        getInterpolateKeys(text: string): string[];
        asyncForEach<T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>): Promise<void>;
        tolowerFirstLetter(value: string): string;
        getObjectFromScript(script: string, params: any): any;
        // parseScript(script: string, data: any): any;
        formatStringToCamelCase(str: string): string;
        to_unsign(str: string): string;
        getTimeRange(startDate: any, endDate: any, type: string, format?: string): any[];
        getStyleObjectFromString(str: string): { [key: string]: string };
        makeCatTree<T>(data: T[], parentKey: string, idKey?: string): T[];
        mergeStringWithObject(text: string, obj: any, keepOriginIfError?: boolean): string;
        processString(template: string, context: any, options?: {
            defaultValue?: string,
            disableHtml?: boolean, // Thay đổi từ allowHtml thành disableHtml
            mode?: 'template' | 'url' | 'style' | 'i18n'
        }): string;
        evaluateExpression(expression: string, context: any, options?: {
            returnType?: 'any' | 'string' | 'number' | 'boolean',
            defaultValue?: any,
            allowFunctions?: boolean,
            mode?: 'condition' | 'calculation' | 'validation' | 'config' | 'property'
        }): any;
        processArray(operation: string, array: any[], context: any): any[];
        evaluateStringTemplate(script: string, context: any): boolean;
        // Cache management methods
        getTemplateCacheStats(): { size: number, memorySize: number, maxItems: number };
        clearTemplateCache(): void;
        destroyTemplateCache(): void;
        analyzeScriptVariables(expression: string, context: any): {
            usedVariables: string[],
            missingVariables: string[],
            availableVariables: string[]
        };
    }
}

// Extend String prototype
declare global {
    interface String {
        stupidInterpolateKeys(): string[];
        interpolateKeys(): string[];
        interpolate(params: { [key: string]: any }): string;
    }
}

const _ = __.runInContext();

function getScriptBetweenTagsRegex(text: string): string[] {
    let result: string[] = [];
    // let match = text.match(/<code[^>]*>([\s\S]*?)<\/code>/g);
    let match = text.match(/<(?:pre\s*)?><code[^>]*>([\s\S]*?)<\/code><\/?(?:pre\s*)?>/g);

    if (match) {
        for (let i = 0; i < match.length; i++) {
            result.push(match[i].replace(/<\/?code[^>]*>/g, ''));
        }
    }

    return result;
}
function getFunctionsFromScript(script: string): { [key: string]: Function } {
    const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
    const functions: { [key: string]: Function } = {};

    let match;
    while (match = functionRegex.exec(script)) {
        const functionName = match[1];
        const functionBody = match[0];
        try {
            // Tạo function object thực sự
            const func = new Function('return ' + functionBody)();
            functions[functionName] = func;
        } catch (ex) {
            console.warn(`Error parsing function ${functionName}:`, ex);
        }
    }

    return functions;
}

function removeCodeTag(text: string): string {
    if (text.indexOf('<code') >= 0)
        return text.replaceAll(/<(?:pre\s*)?><code[^>]*>([\s\S]*?)<\/code><\/?(?:pre\s*)?>/g, '')
    else return text;
}

function getVariablesFromScript(script: string) {
    // Chỉ capture variables, KHÔNG capture functions
    const variableRegex = /(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;

    let variableNames = [];
    let match;
    while (match = variableRegex.exec(script)) {
        variableNames.push(match[2]);
    }
    return variableNames;
}



function supportsLookbehind(): boolean {
    try {
        // Try to use a regex with a lookbehind assertion
        new RegExp("(?<=test)");
        return true; // If no error is thrown, lookbehind assertions are supported
    } catch (e) {
        return false; // If an error is thrown, lookbehind assertions are not supported
    }
}

String.prototype.stupidInterpolateKeys = function (): string[] {
    //hàm này chỉ lọc biến chứ ko lọc tên các hàm nhé.
    // var regex = new RegExp("[\{\( ]([a-zA-Z_][a-zA-Z0-9_]+( ?)(=\")?\\(?)", 'ig');
    var regex = new RegExp("[\{\(][ \t\n\r]*([a-zA-Z_][a-zA-Z0-9_]+( ?)(=\")?\\(?)", 'ig');
    //đảm bảo nếu chuỗi html thì không bị lẫn các thẻ html vào sẽ gây lỗi
    var plainString = this.replace(/<[^>]+>/g, '');
    let matches = plainString.match(regex);
    //không lấy từ khóa là các hàm
    if (matches) {
        var keys = _.union(matches.filter(m => m.indexOf("new ") < 0 && !m.endsWith("(") && !m.endsWith("=\"")).map(m => m.replace(/[\\$|\\{|\\}\\(\\)=]/ig, "").trim()));
        return keys;
    } else
        return [];
}

String.prototype.interpolateKeys = function (): string[] {
    //hàm này chỉ lọc biến chứ ko lọc tên các hàm nhé.
    var scriptReg = /\${((?:.|\n)*)}/g
    // var detailregex = new RegExp("([^a-zA-Z0-9]*)([a-zA-Z_][a-zA-Z0-9_]+)([^a-zA-Z0-9]*)", 'g');
    // var detailregex = /\b(?<![\."'`<:])([a-zA-Z_][a-zA-Z0-9_]+)(?!=>)(?![\("'`\/>])\b/g;
    if (!supportsLookbehind()) {
        return this.stupidInterpolateKeys()
    }
    // var detailregex = /\b(?<![\."'`<:])([a-zA-Z_][a-zA-Z0-9_]+)(?!=>)(?![\("'`])(?!\/>)\b/g;
    var detailregex = new RegExp("\\b(?<![\\.\"'`<:])([a-zA-Z_][a-zA-Z0-9_]+)(?!=>)(?![\\(\"'`])(?!\\/>\\b)", "g");

    //đảm bảo nếu chuỗi html thì không bị lẫn các thẻ html vào sẽ gây lỗi

    var scriptSegments = Array.from(this.matchAll(scriptReg))
    // console.log({scriptSegments,th:this})
    var matches: string[] = [];
    scriptSegments.forEach(function (match) {
        let detailMatches = Array.from(match[0].matchAll(detailregex));
        // console.log({ detailMatches, text: match[0] })
        detailMatches.forEach(function (detailMatch) {

            if (!matches.includes(detailMatch[1])) {
                matches.push(detailMatch[1])
                // console.log({push:detailMatch[1]})
            }
        })
        // console.log({ matches })

    })

    return matches;
}

String.prototype.interpolate = function (params: { [key: string]: any }): string {
    const names = Object.keys(params);
    const vals = Object.values(params)
    //must remove invalid name, forexample: abc-def
    // var reg = /^[a-zA-Z_]{2,30}$/;
    var reg = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

    const validNames: string[] = [];
    const validVals: any[] = [];

    for (var i = 0; i < names.length; i++) {
        const name = names[i];
        if (reg.test(name)) {
            validNames.push(name);
            validVals.push(vals[i]);
        }
    }

    // let scripts = getScriptBetweenTagsRegex(this.toString());
    let scripts = getScriptBetweenTagsRegex(this.toString());

    let functions: { [key: string]: Function } = {};
    if (scripts.length > 0) {
        scripts.forEach(function (script) {
            if (script?.length > 1) {
                try {
                    // Extract functions từ script
                    const scriptFunctions = getFunctionsFromScript(script);
                    Object.assign(functions, scriptFunctions);

                    // Extract variables từ script (chỉ variables, không phải functions)
                    var variableNames = getVariablesFromScript(script);
                    if (variableNames?.length > 0) {
                        // Thêm return statement để lấy kết quả variables
                        script += `;return {${variableNames.join(',')}}`;

                        let scriptResult = new Function(...validNames, script)(...validVals);

                        if (scriptResult) {
                            const snames = Object.keys(scriptResult);
                            const svals = Object.values(scriptResult);
                            snames.forEach(function (name) {
                                validNames.push(name);
                            });
                            svals.forEach(function (val) {
                                validVals.push(val);
                            });
                        }
                    }
                    // Nếu không có variables, chỉ cần thêm functions vào context

                } catch (ex: any) {
                    console.log(`error with script:${script}: ${ex.message}`);
                }
            }
        });
    }

    // Thêm functions vào context để có thể gọi từ template
    Object.keys(functions).forEach(functionName => {
        validNames.push(functionName);
        validVals.push(functions[functionName]);
    });

    // Xử lý template string
    let scriptNoCode = removeCodeTag(this.toString()).replaceAll(/(?:\$\{[ |\r|\n|\t|]*)/g, '${');

    var result = new Function(...validNames, `return \`${scriptNoCode}\`;`)(...validVals);

    return result;
}

_.mixin({
    // Immutable Set for setting state
    setIn: <T extends object>(state: T, name: string, value: any): T => {
        return _.setWith(_.clone(state), name, value, _.clone) as T;
    },
    getInterpolateKeys: (text: string): string[] => {
        return text.interpolateKeys();
    },
    asyncForEach: async <T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>): Promise<void> => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    },
    tolowerFirstLetter: (value: string): string => {
        try {
            return value.charAt(0).toLowerCase() + value.slice(1);
        } catch {
            return '';
        }
    },
    getObjectFromScript: (script: string, params: any): any => {
        const names = Object.keys(params);
        const vals = Object.values(params)
        const variableNames = getVariablesFromScript(script);

        const expression = script + `;return {${variableNames.join(',')}}`
        let result = new Function(...names, expression)(...vals);
        return result;
    },
    evaluateStringTemplate: (script: string, context: any): boolean => {
        try {
            // Sử dụng processString thay vì mergeStringWithObject
            const mergedStr = _.processString(script, context, {
                defaultValue: 'false',
                disableHtml: true // Tăng bảo mật
            })?.trim();
            return Boolean(JSON.parse(mergedStr));
        } catch (err) {
            console.error('Error evaluating condition:', err);
            return false;
        }
    },

    // Sử dụng: có phần tương tự như mergeStringWithObject nhưng cụ thể các trường hợp hơn
    // Template: _.processString("Hello ${user.name}!", {user: {name: "John"}}, {mode: 'template'})
    // URL: processString("https://api.com/users/${userId}", {userId: "123"})
    // Style: _.processString("color: ${color}; background: ${bg};", {color: "red", bg: "blue"}, {mode: 'style'})
    // i18n: _.processString("You have ${count} ${pluralize(count, 'item', 'items')}", {count: 5}, {mode: 'i18n'})
    processString: (template: string, context: any, options?: {
        defaultValue?: string,
        disableHtml?: boolean, // Thay đổi từ allowHtml thành disableHtml
        mode?: 'template' | 'url' | 'style' | 'i18n'
    }): string => {
        try {
            let sanitizedTemplate = template;

            // Mode-specific processing
            switch (options?.mode) {
                case 'url':
                    // URL validation và sanitization
                    sanitizedTemplate = template
                        .replace(/[<>]/g, '')
                        .replace(/javascript:/gi, '')
                        .replace(/data:/gi, '')
                        .replace(/vbscript:/gi, '')
                        .replace(/on\w+\s*=/gi, '');

                    // Validate URL format
                    const urlPattern = /^https?:\/\/.+/;
                    if (!urlPattern.test(template)) {
                        console.warn('URL template should start with http:// or https://');
                    }

                    // Encode URL parameters
                    const encodedContext = Object.fromEntries(
                        Object.entries(context).map(([key, value]) => [
                            key,
                            typeof value === 'string' ? encodeURIComponent(value) : value
                        ])
                    );
                    context = encodedContext;
                    break;

                case 'style':
                    // CSS validation và sanitization
                    sanitizedTemplate = template
                        .replace(/[<>]/g, '')
                        .replace(/javascript:/gi, '')
                        .replace(/expression\(/gi, '')
                        .replace(/url\(javascript:/gi, 'url(')
                        .replace(/on\w+\s*=/gi, '');

                    // Validate CSS properties
                    const cssProperties = [
                        'color', 'background', 'font', 'margin', 'padding', 'border',
                        'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom'
                    ];

                    const usedProperties = template.match(/\$\{([^}]+)\}/g) || [];
                    usedProperties.forEach(prop => {
                        const propName = prop.replace(/\$\{([^}]+)\}/, '$1');
                        if (!cssProperties.some(cssProp => propName.includes(cssProp))) {
                            console.warn(`CSS property validation: ${propName} may not be a valid CSS property`);
                        }
                    });
                    break;

                case 'i18n':
                    // i18n với pluralization
                    sanitizedTemplate = template
                        .replace(/[<>]/g, '')
                        .replace(/javascript:/gi, '')
                        .replace(/on\w+\s*=/gi, '');

                    // Add pluralization helpers
                    const pluralizationHelpers = {
                        pluralize: (count: number, singular: string, plural: string) =>
                            count === 1 ? singular : plural,
                        formatNumber: (num: number, locale: string = 'en') =>
                            new Intl.NumberFormat(locale).format(num),
                        formatDate: (date: Date, locale: string = 'en') =>
                            new Intl.DateTimeFormat(locale).format(date)
                    };

                    context = { ...context, ...pluralizationHelpers };
                    break;

                case 'template':
                default:
                    // Standard template processing
                    sanitizedTemplate = template
                        .replace(/javascript:/gi, '') // Basic XSS prevention
                        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
                    break;
            }

            // Final HTML sanitization - chỉ sanitize khi disableHtml = true
            if (options?.disableHtml) {
                sanitizedTemplate = sanitizedTemplate.replace(/[<>]/g, '');
            }

            const paramNames = Object.keys(context);
            const paramValues = Object.values(context);
            return new Function(...paramNames, `return \`${sanitizedTemplate}\``)(...paramValues);
        } catch (ex) {
            console.debug('processString error:', ex);
            return options?.defaultValue || template;
        }
    },
    ///dùng khi muốn đánh giá 1 biểu thức
    // Sử dụng:
    // Condition: evaluateExpression("user.age >= 18", {user: {age: 20}}, {returnType: 'boolean'})
    // Calculation: evaluateExpression("price * quantity", {price: 100, quantity: 2}, {returnType: 'number'})
    // Validation: evaluateExpression("email.includes('@')", {email: "john@example.com"}, {returnType: 'boolean'})
    // Property: evaluateExpression("user?.profile?.email", {user: {profile: {email: "john@example.com"}}})
    // Config: evaluateExpression("env === 'prod'", {env: "prod"}, {returnType: 'boolean'})
    evaluateExpression: (expression: string, context: any, options?: {
        returnType?: 'any' | 'string' | 'number' | 'boolean',
        defaultValue?: any,
        allowFunctions?: boolean,
        mode?: 'condition' | 'calculation' | 'validation' | 'config' | 'property'
    }): any => {
        // Extract options outside try-catch to avoid scope issues
        const { returnType = 'any', defaultValue = null, allowFunctions = true } = options || {};
        
        try {
            // Security validation
            if (!allowFunctions && (expression.includes('function') || expression.includes('=>'))) {
                console.warn('Function expressions not allowed');
                return defaultValue;
            }

            // Validation input
            if (!expression || typeof expression !== 'string') {
                console.warn('evaluateExpression: Invalid expression input', { expression, type: typeof expression });
                return defaultValue;
            }

            // THÊM MỚI: Tự động thêm window và moment vào context
            const enhancedContext = {
                ...context,
                window: (typeof window !== 'undefined') ? window : undefined,
                moment: (typeof window !== 'undefined') ? (window as any)?.moment : undefined
            };
            ///Regex /[<>]/g quá thô bạo, loại bỏ tất cả < và >
            // const sanitizedExpr = expression.replace(/[<>]/g, '');
            // Bằng logic sanitize thông minh hơn:
            let sanitizedExpr = expression;
            // Chỉ loại bỏ các pattern nguy hiểm thực sự, không ảnh hưởng đến cú pháp JavaScript
            sanitizedExpr = sanitizedExpr
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Loại bỏ script tags
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Loại bỏ iframe tags
                .replace(/javascript:/gi, '') // Loại bỏ javascript: protocol
                .replace(/on\w+\s*=/gi, '') // Loại bỏ event handlers
                .replace(/eval\s*\(/gi, '') // Loại bỏ eval calls
                .replace(/Function\s*\(/gi, ''); // Loại bỏ Function constructor
            // Only use valid JS identifiers as parameter names to avoid SyntaxError in Function constructor
            const allEntries = Object.entries(enhancedContext);
            const isValidIdentifier = (name: string) => /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(name);
            const validEntries = allEntries.filter(([k]) => isValidIdentifier(k));
            const invalidKeys = allEntries.filter(([k]) => !isValidIdentifier(k)).map(([k]) => k);

            // Build parameter lists; also expose the full context via a safe __ctx param for optional bracket-notation access
            const paramNames = validEntries.map(([k]) => k).concat(['__ctx']);
            const paramValues = validEntries.map(([_, v]) => v).concat([enhancedContext]);

            // Optional: lightweight debug to help trace bad keys in development
            if (invalidKeys.length) {
                // eslint-disable-next-line no-console
                console.debug('evaluateExpression: filtered out invalid context keys', invalidKeys);
            }

            let result = new Function(...paramNames, `return (${sanitizedExpr})`)(...paramValues);

            // Type conversion
            switch (returnType) {
                case 'string': return String(result);
                case 'number': return Number(result);
                case 'boolean': return Boolean(result);
                default: return result;
            }
        } catch (ex) {
            // Enhanced error logging with detailed information
            const errorInfo = {
                error: ex,
                message: ex instanceof Error ? ex.message : String(ex),
                stack: ex instanceof Error ? ex.stack : undefined,
                expression: expression,
                context: context,
                options: options,
                contextKeys: context ? Object.keys(context) : [],
                timestamp: new Date().toISOString()
            };

            console.error('evaluateExpression error:', errorInfo);

            // Log specific error types for better debugging
            if (ex instanceof ReferenceError) {
                console.error('ReferenceError details:', {
                    name: ex.name,
                    message: ex.message,
                    missingVariable: ex.message.match(/^(\w+) is not defined/)?.[1],
                    availableVariables: context ? Object.keys(context) : [],
                    expression: expression
                });
            }

            // Return defaultValue instead of throwing
            return defaultValue;
        }
    },
    ///dùng khi muốn thực hiện 1 phép toán trên mảng
    // Sử dụng:
    // Filter: processArray("filter(item => item.status === 'active')", [{id: 1, status: 'active'}, {id: 2, status: 'inactive'}], {status: 'active'})
    // Map: processArray("map(item => item.name)", [{id: 1, name: 'John'}, {id: 2, name: 'Jane'}], {})
    // Reduce: processArray("reduce((acc, item) => acc + item.value, 0)", [{id: 1, value: 10}, {id: 2, value: 20}], {})
    processArray: (operation: string, array: any[], context: any): any[] => {
        try {
            const sanitizedOp = operation.replace(/[<>]/g, '');
            const paramNames = Object.keys({ ...context, array });
            const paramValues = Object.values({ ...context, array });
            return new Function(...paramNames, `return array.${sanitizedOp}`)(...paramValues);
        } catch (ex) {
            console.debug('processArray error:', ex);
            return array;
        }
    },
    formatStringToCamelCase: (str: string): string => {
        const splitted = str.split("-");
        if (splitted.length === 1) return splitted[0];
        return (
            splitted[0] +
            splitted
                .slice(1)
                .map(word => word[0]?.toUpperCase() + word?.slice(1))
                .join("")
        );
    },
    to_unsign: (str: string): string => {
        if (!str)
            return "";
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    },
    /**
     * @param {any} startDate The start date
     * @param {any} endDate The end date
     * @param {string} type The range type. eg: 'days', 'hours' etc
     * @param {string} format: eg: DD-MM-YYYY HH:mm:ss
     */
    getTimeRange: (startDate: any, endDate: any, type: string, format?: string): any[] => {
        let fromDate = moment(startDate)
        let toDate = moment(endDate)
        let diff = toDate.diff(fromDate, type as any)
        let range = []
        for (let i = 0; i < diff; i++) {
            if (format) {
                range.push(moment(startDate).add(i, type as any).format(format))
            } else
                range.push(moment(startDate).add(i, type as any))
        }
        return range
    },
    getStyleObjectFromString: (str: string): { [key: string]: string } => {
        const style: { [key: string]: string } = {};

        if (str && typeof (str) == "string") {

            str.split(";").forEach(el => {
                const [property, value] = el.split(":");
                if (!property || !value) return;

                const formattedProperty = _.formatStringToCamelCase(property.trim());
                style[formattedProperty] = value.trim();
            });
        }

        return style;
    },
    makeCatTree: <T>(data: T[], parentKey: string, idKey: string = "_id"): T[] => {
        //lưu ý nếu data chứa các phần tử const (readonly) thì sẽ gây lỗi setchildren 
        //first clone this data
        let cloneData = [...data.map(d => Object.assign({}, d))] as any[]
        var groupedByParents = _.groupBy(cloneData, parentKey);
        var catsById = _.keyBy(cloneData, idKey);
        _.each(_.omit(groupedByParents, ''), function (children, parentId) {
            if (catsById[parentId])
                catsById[parentId].children = children;
            else
                catsById[parentId] = { children }

        });
        _.each(catsById, function (cat) {
            // isParent will be true when there are subcategories (this is not really a good name, btw.)
            cat.isParent = !_.isEmpty(cat.children);
            // _.compact below is just for removing null posts
            cat.children = _.compact(_.union(cat.children, cat.posts));
            // optionally, you can also delete cat.posts here.
            cat.isRoot = !cloneData.find(d => d[idKey] == cat[parentKey])
        });

        return cloneData.filter(d => d.isRoot) as T[]
    },

    mergeStringWithObject: (text: string, context: any, keepOriginIfError?: boolean): string => {
        // console.log("mergeStringWithObject",text,obj,keepOriginIfError)
        if (!context) {
            context = {}
        }
        if (!text) {
            return text;
        }
        if (typeof (text) != "string") {
            console.log("not valid text", typeof (text))
            return text;
        }
        else if (!text.includes('${')) {
            // Nếu không còn ${} sau khi replace, return ngay
            return text;
        }
        if (text.indexOf("${$}") >= 0) {
            text = text.replace("${$}", JSON.stringify(context))
        } else if (text.indexOf("${}") >= 0) {
            text = text.replace("${}", JSON.stringify(context))
        }

        ///validate the text first for html - SỬ DỤNG HÀM RIÊNG
        text = normalizeHtmlText(text);
        // Tạo cache key an toàn
        const cacheKey = createSafeCacheKey(text, context);

        // Kiểm tra cache trước
        // const cachedResult = templateCache.get(cacheKey);
        // if (cachedResult !== undefined) {
        //     console.log("cachedResult", cachedResult, "for", cacheKey, context)
        //     return cachedResult;
        // }

        ///validate the text for parsing
        try {
            let result: string;
            if (Array.isArray(context)) {
                result = text.interpolate({ data: context, JSON, _: _, moment, Math, getFileLink });
            }
            else {
                ///nhét thêm 1 số hàm tiện ích vào
                result = text.interpolate({ ...context, JSON, _: _, moment, Math, getFileLink });
            }

            const finalResult = result.replace('undefined', 'null').replace('"null"', 'null');

            // Cache kết quả
            templateCache.set(cacheKey, finalResult);

            return finalResult;
        } catch (err) {
            if (err instanceof ReferenceError) {
                return "";
            }
            console.debug(`can not bind data for:`, { text, err, obj: context })
            templateCache.set(cacheKey, "");
            if (!keepOriginIfError)
                return "";//trường hợp lỗi thì ko nên cố hiển thị thông tin ra
        }

        return text.replace('undefined', 'null').replace('"null"', 'null')
    },

    // Cache management methods
    getTemplateCacheStats: (): { size: number, memorySize: number, maxItems: number } => {
        return templateCache.getStats();
    },
    clearTemplateCache: (): void => {
        templateCache.clear();
    },
    destroyTemplateCache: (): void => {
        templateCache.destroy();
    },
    ///dùng khi muốn phân tích script và xác định các biến bị thiếu
    // Sử dụng: analyzeScriptVariables("user.name + defaultValue", {user: {name: "John"}})
    analyzeScriptVariables: (expression: string, context: any): {
        usedVariables: string[],
        missingVariables: string[],
        availableVariables: string[]
    } => {
        try {
            // Extract variable names from expression using regex
            const variableRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
            const matches = expression.match(variableRegex) || [];

            // Filter out JavaScript keywords and built-in functions
            const jsKeywords = [
                'function', 'var', 'let', 'const', 'return', 'if', 'else', 'for', 'while', 'do',
                'switch', 'case', 'default', 'break', 'continue', 'try', 'catch', 'finally',
                'throw', 'new', 'delete', 'typeof', 'instanceof', 'in', 'of', 'this', 'super',
                'class', 'extends', 'static', 'async', 'await', 'yield', 'get', 'set',
                'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
                'console', 'log', 'warn', 'error', 'debug', 'info',
                'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'eval', 'encodeURI', 'decodeURI',
                'String', 'Number', 'Boolean', 'Array', 'Object', 'Date', 'Math', "Json",
                'RegExp', 'Error', 'TypeError', 'ReferenceError', 'SyntaxError', 'RangeError'
            ];

            const usedVariables = Array.from(new Set(matches)).filter(match =>
                !jsKeywords.includes(match) &&
                !match.match(/^\d+$/) && // Exclude numbers
                !match.match(/^['"`]/) // Exclude string literals
            );

            const availableVariables = Object.keys(context || {});
            const missingVariables = usedVariables.filter(variable =>
                !availableVariables.includes(variable)
            );

            return {
                usedVariables,
                missingVariables,
                availableVariables
            };
        } catch (ex) {
            console.error('analyzeScriptVariables error:', ex);
            return {
                usedVariables: [],
                missingVariables: [],
                availableVariables: Object.keys(context || {})
            };
        }
    }

});

export default _; 