import { SchemaDefinitionExtend } from 'types/schemas/SchemaDefinition';
import SchemaQueryManager from './SchemaQueryManager';

/**
 * GraphQLQueryGenerator - Helper functions để thay thế generateSchemaQuery
 * 
 * Mục tiêu:
 * - Cung cấp API tương thích với code hiện tại
 * - Lazy generation thay vì pre-generation
 * - Smart caching và performance optimization
 * - Backward compatibility
 */

/**
 * Lấy query string cho list operations
 */
export function getQueryString(schemaName: string, params: any = {}): string | null | undefined {
    return SchemaQueryManager.getQueryString(schemaName, 'QUERY', params);
}

/**
 * Lấy query string cho find by ID operations
 */
export function getFindString(schemaName: string, params: any = {}): string | null {
    return SchemaQueryManager.getQueryString(schemaName, 'FIND', params);
}

/**
 * Lấy query string cho find reference operations
 */
export function getFindReferenceString(schemaName: string, params: any = {}): string | null {
    return SchemaQueryManager.getQueryString(schemaName, 'FIND_REFERENCE', params);
}

/**
 * Lấy query string cho search reference operations
 */
export function getSearchReferenceString(schemaName: string, params: any = {}): string | null {
    return SchemaQueryManager.getQueryString(schemaName, 'SEARCH_REFERENCE', params);
}

/**
 * Lấy query string cho advance search reference operations
 */
export function getAdvanceSearchReferenceString(schemaName: string, params: any = {}): string | null {
    return SchemaQueryManager.getQueryString(schemaName, 'ADVANCE_SEARCH_REFERENCE', params);
}

/**
 * Lấy query string cho save operations
 */
export function getSaveString(schemaName: string, params: any = {}): string | null {
    return SchemaQueryManager.getQueryString(schemaName, 'SAVE', params);
}

/**
 * Lấy query string cho save many operations
 */

/**
 * Lấy query string cho remove operations
 */

/**
 * Lấy query string cho remove many operations
 */

/**
 * Lấy query string cho update field operations
 */

/**
 * Lấy query string cho query by fields operations
 */
export function getQueryByFieldsString(schemaName: string, params: any = {}): string | null {
    return SchemaQueryManager.getQueryString(schemaName, 'QUERY_BY_FIELDS', params);
}

/**
 * Backward compatibility function - tương thích với generateSchemaQuery
 * @deprecated Sử dụng các helper functions riêng lẻ thay thế
 */
export function generateSchemaQuery(schema: SchemaDefinitionExtend, _all_schemas: SchemaDefinitionExtend[], maxLevel: number, selectedFields: any, just_use_selectedFields: boolean, _additional_query: string): void {
    console.warn('generateSchemaQuery is deprecated. Use individual helper functions instead.');

    if (!schema || !schema.name) {
        console.error('Schema or schema.name is required');
        return;
    }

    const params = {
        maxLevel: maxLevel || 3,
        selectedFields,
        just_use_selectedFields: just_use_selectedFields || false,
        additional_query: _additional_query || ""
    };

    // Generate và assign các query strings
    schema.graph_query_string = getQueryString(schema.name, params) ?? undefined;
    schema.graph_find_string = getFindString(schema.name, params) ?? undefined;
    schema.graph_find_reference_string = getFindReferenceString(schema.name, params) ?? undefined;
    schema.graph_search_reference_string = getSearchReferenceString(schema.name, params) ?? undefined;
    schema.graph_save_string = getSaveString(schema.name, params) ?? undefined;
}

/**
 * Custom query string generator - tương thích với get_custom_query_string
 */
export function getCustomQueryString(
        schema: SchemaDefinitionExtend,
        _all_schemas: SchemaDefinitionExtend[],
        maxLevel: number,
        selectedFields: any,
        just_use_selectedFields: boolean,
        additional_query: string
): string | null | undefined {
    if (!schema || !schema.name) {
        console.error('Schema or schema.name is required');
        return null;
    }

    const params = {
        maxLevel: maxLevel || 3,
        selectedFields,
        just_use_selectedFields: just_use_selectedFields || false,
        additional_query: additional_query || ""
    };

    return getQueryString(schema.name, params);
}

/**
 * Custom find string generator - tương thích với get_custom_find_string
 */
export function getCustomFindString(schema: SchemaDefinitionExtend, _all_schemas: SchemaDefinitionExtend[], maxLevel: number, selectedFields: any, just_use_selectedFields: boolean, additional_query: string): string | null {
    if (!schema || !schema.name) {
        console.error('Schema or schema.name is required');
        return null;
    }

    const params = {
        maxLevel: maxLevel || 3,
        selectedFields,
        just_use_selectedFields: just_use_selectedFields || false,
        additional_query: additional_query || ""
    };

    return getFindString(schema.name, params);
}

/**
 * Custom save string generator - tương thích với get_custom_save_string
 */
export function getCustomSaveString(schema: any, _all_schemas: any[], maxLevel: number, selectedFields: any, just_use_selectedFields: boolean, _additional_query: string): string | null {
    if (!schema || !schema.name) {
        console.error('Schema or schema.name is required');
        return null;
    }

    const params = {
        maxLevel: maxLevel || 3,
        selectedFields,
        just_use_selectedFields: just_use_selectedFields || false,
        additional_query: _additional_query || ""
    };

    return getSaveString(schema.name, params);
}

/**
 * Get cache statistics
 */
export function getCacheStats(): any {
    return SchemaQueryManager.getStats();
}

/**
 * Clear cache
 */
export function clearCache(): void {
    SchemaQueryManager.clearCache();
}

/**
 * Clear schema cache
 */
export function clearSchemaCache(): void {
    SchemaQueryManager.clearSchemaCache();
}

/**
 * Log memory usage và cache stats
 */
export function logPerformanceStats(): void {
    SchemaQueryManager.logMemoryUsage();
}

// Export default object với tất cả functions
export default {
    getQueryString,
    getFindString,
    getFindReferenceString,
    getSearchReferenceString,
    getAdvanceSearchReferenceString,
    getSaveString,
    getQueryByFieldsString,
    getCustomQueryString,
    getCustomFindString,
    
    getCacheStats,
    clearCache,
    clearSchemaCache,
    logPerformanceStats
};
