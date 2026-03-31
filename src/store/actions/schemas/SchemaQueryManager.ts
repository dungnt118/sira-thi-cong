import store from 'app/store';
import { PropTypeEnum } from 'types/schemas/enums';
import type { PropDefinition } from '../../../../types/schemas/PropDefinition';
import type { SchemaDefinition } from '../../../../types/schemas/SchemaDefinition';

const RESERVED_GRAPHQL_NAMES = new Set(["null", "true", "false"]);

/**
 * SchemaQueryManager - Quản lý việc tạo GraphQL queries với lazy loading và smart caching
 * 
 * Mục tiêu:
 * - Giảm memory usage từ ~16MB xuống ~2-3MB
 * - Lazy generation thay vì pre-generation
 * - Smart caching với LRU eviction
 * - Performance optimization cho 500+ schemas
 */
type QueryParams = {
    maxLevel?: number;
    selectedFields?: string[] | null;
    just_use_selectedFields?: boolean;
    additional_query?: string;
};

class SchemaQueryManager {
    private cache: Map<string, string>;
    private schemaCache: Map<string, SchemaDefinition>;
    private accessCount: Map<string, number>;
    private maxCacheSize: number;
    private maxSchemaCacheSize: number;
    private stats: {
        cacheHits: number;
        cacheMisses: number;
        totalQueries: number;
        averageGenerationTime: number;
    };
    private static instance: SchemaQueryManager;

    constructor() {
        // Cache cho generated queries
        this.cache = new Map();

        // Cache cho schemas (lazy loading)
        this.schemaCache = new Map();

        // Track access frequency cho LRU eviction
        this.accessCount = new Map();

        // Cache size limits
        this.maxCacheSize = 1000;
        this.maxSchemaCacheSize = 100;

        // Performance monitoring
        this.stats = {
            cacheHits: 0,
            cacheMisses: 0,
            totalQueries: 0,
            averageGenerationTime: 0
        };

        // Không cần templates nữa - sử dụng dedicated methods
    }

    /**
     * Singleton pattern để đảm bảo chỉ có 1 instance
     */
    static getInstance(): SchemaQueryManager {
        if (!SchemaQueryManager.instance) {
            SchemaQueryManager.instance = new SchemaQueryManager();
        }
        return SchemaQueryManager.instance;
    }

    /**
     * Lấy query string với caching
     */
    getQueryString(schemaName: string, queryType: string, params: QueryParams = {}): string | null {
        const startTime = performance.now();
        this.stats.totalQueries++;

        // Tạo cache key
        const cacheKey = this.generateCacheKey(schemaName, queryType, params);
        // console.log({ cacheKey })
        // Check cache first
        if (this.cache.has(cacheKey)) {
            this.stats.cacheHits++;
            this.accessCount.set(cacheKey, (this.accessCount.get(cacheKey) || 0) + 1);

            const endTime = performance.now();
            this.updateAverageGenerationTime(endTime - startTime);

            return this.cache.get(cacheKey) || null;
        }

        // Cache miss - generate at runtime
        this.stats.cacheMisses++;
        const queryString = this.generateAtRuntime(schemaName, queryType, params);
        console.log({ queryString })
        if (queryString) {
            // Cache với LRU eviction
            this.cacheQuery(cacheKey, queryString);
        }

        const endTime = performance.now();
        this.updateAverageGenerationTime(endTime - startTime);

        return queryString;
    }

    /**
     * Generate query string tại runtime
     */
    private generateAtRuntime(schemaName: string, queryType: string, params: QueryParams): string | null {
        try {
            // Lazy load schema
            const schema = this.getSchema(schemaName);
            if (!schema) {
                console.warn(`[SchemaQueryManager] Schema ${schemaName} not found`);
                return null;
            }

            // Lấy all_schemas cho reference queries
            const allSchemas = this.getAllSchemas();

            // Generate query dựa theo type
            switch (queryType) {
                case 'QUERY':
                    return this.generateQueryString(schema, allSchemas, params);
                case 'FIND':
                    return this.generateFindString(schema, allSchemas, params);
                case 'FIND_REFERENCE':
                    return this.generateFindReferenceString(schema);
                case 'SEARCH_REFERENCE':
                    return this.generateSearchReferenceString(schema);
                case 'ADVANCE_SEARCH_REFERENCE':
                    return this.generateAdvanceSearchReferenceString(schema);
                case 'SAVE':
                    return this.generateSaveString(schema, allSchemas, params);
                case 'QUERY_BY_FIELDS':
                    return this.generateQueryByFieldsString(schema);
                default:
                    console.warn(`[SchemaQueryManager] Unknown query type: ${queryType}`);
                    return null;
            }

        } catch (error) {
            console.error(`[SchemaQueryManager] Error generating query for ${schemaName}:${queryType}`, error);
            return null;
        }
    }

    /**
     * Generate SAVE mutation string - tương đương get_custom_save_string
     */
    private generateSaveString(schema: SchemaDefinition, allSchemas: SchemaDefinition[], params: QueryParams): string {
        const {
            maxLevel = 7,
            selectedFields = null,
            just_use_selectedFields = false,
            additional_query = ""
        } = params;

        const innerQuery = this.buildInnerQuery(schema, allSchemas, maxLevel, selectedFields, just_use_selectedFields, additional_query, false);
        return `mutation($data:${schema.name}InputDto){response:save_${schema.name}_dto(data:$data){code message data{${innerQuery}}}}`;
    }

    /**
     * Generate QUERY string - tương đương get_custom_query_string
     */
    private generateQueryString(schema: SchemaDefinition, allSchemas: SchemaDefinition[], params: QueryParams): string {
        const {
            maxLevel = 7,
            selectedFields = null,
            just_use_selectedFields = false,
            additional_query = ""
        } = params;

        const innerQuery = this.buildInnerQuery(schema, allSchemas, maxLevel, selectedFields, just_use_selectedFields, additional_query, true);
        return `query($filter:GeneralCollectionFilterInput){response:query_${schema.name}s_dto(filter:$filter){code message page pages records data{${innerQuery}}}}`;
    }

    /**
     * Generate FIND string - tương đương get_custom_find_string  
     */
    private generateFindString(schema: SchemaDefinition, allSchemas: SchemaDefinition[], params: QueryParams): string {
        const {
            maxLevel = 7,
            selectedFields = null,
            just_use_selectedFields = false,
            additional_query = ""
        } = params;

        const innerQuery = this.buildInnerQuery(schema, allSchemas, maxLevel, selectedFields, just_use_selectedFields, additional_query, true);
        return `query($_id:String){response:find_${schema.name}_dto(_id:$_id){code message data{${innerQuery}}}}`;
    }

    /**
     * Build inner query string - tương đương logic trong schemaQueryHelper
     */
    private buildInnerQuery(
        schema: SchemaDefinition,
        allSchemas: SchemaDefinition[],
        maxLevel: number,
        selectedFields: string[] | null,
        just_use_selectedFields: boolean,
        additional_query: string,
        includeVersionFields: boolean
    ): string {
        // Base fields - luôn có
        let innerQuery = `_id createdAt ${this.getInnerQuery(schema.properties, maxLevel, 0, selectedFields, just_use_selectedFields)} 
            ${this.getReferenceIndexContentQuery(schema.properties?.filter((p) => (p.propType == PropTypeEnum.OBJECT_ID || p.propType == PropTypeEnum.OBJECT_IDS || p.propType == PropTypeEnum.LOOKUP || p.propType == PropTypeEnum.REFERENCE) && p.refSchemas && p.refSchemas.length > 0), allSchemas)}
            ${selectedFields ? this.getReference1NQuery(schema, selectedFields || [], allSchemas, selectedFields, just_use_selectedFields) : ""} 
            ${additional_query || ""}`;

        // Thêm version fields cho query/find (không phải save)
        if (includeVersionFields) {
            if (!just_use_selectedFields && schema.enable_log) {
                innerQuery += " message_numb follower_numb ";
            }
            if (!just_use_selectedFields && (schema.is_version || schema.approval?.enabled)) {
                innerQuery += " versionId version_numb lastVersion${CONTENT_VERSION_FRAGMENT_STRUCTURE_STRING}";
            }

            if (schema.approval?.enabled || schema.is_draft) {
                innerQuery += " isDraft";
            }
            if (schema.is_tenant) {
                innerQuery += " tenantId";
            }
        }

        return innerQuery.trim();
    }

    /**
     * Generate inner query từ properties - tương đương getInnerQuery trong schemaQueryHelper
     */
    private getInnerQuery(props: PropDefinition[], maxLevel: number, level: number, selectedFields: string[] | null, just_use_selectedFields: boolean): string {
        const _level = level ? level : 0;
        let query = "";
        const fields: string[] = [];

        if (!props) return query;

        if (level < maxLevel) {
            props.filter(p => p).forEach((prop) => {
                const availableField = selectedFields?.includes(prop.id) === true;
                const propName = this.getValidPropName(prop.name);

                if ((prop.propType == "Object" || prop.propType == "Object" || prop.propType == "Nested" || prop.propType == "Nested") && prop.nested && prop.nested.length > 0) {
                    const subQuery = this.getInnerQuery(prop.nested, maxLevel, _level + 1, selectedFields, false);
                    if (propName && subQuery && subQuery.length > 0) {
                        fields.push(`${propName}{${subQuery}}`);
                    }
                } else if (just_use_selectedFields && !availableField) {
                    // không push data here
                } else if (propName) {
                    fields.push(propName);
                }
            });
            query = fields.join(" ");
        }
        return query;
    }

    /**
     * Generate index for reference ObjectID/LOOKUP/REFERENCE fields to optimize query performance.
     */
    private getReferenceIndexContentQuery(props: PropDefinition[] | undefined, allSchemas: SchemaDefinition[]): string {
        const fields = new Set<string>();

        props?.forEach((prop) => {
            if (prop?.name && Array.isArray(prop.refSchemas) && prop.refSchemas.length > 0) {
                fields.add(`idx_${prop.name}`);
                return;
            }

            prop.refSchemas?.forEach((refName: string) => {
                const refSchema = allSchemas.find(s => s.name == refName);
                if (refSchema && prop?.name) {
                    const subQuery = this.getInnerQuery(refSchema.properties, 1, 0, null, false);
                    if (subQuery && subQuery.length > 0) {
                        fields.add(`idx_${prop.name}`);
                    }
                }
            });
        });

        return Array.from(fields).join(" ");
    }

    /**
     * Generate reference 1-N query - tương đương getReference1NQuery
     */
    private getReference1NQuery(
        schema: SchemaDefinition,
        list_key: string[],
        allSchemas: SchemaDefinition[],
        selectedFields: string[] | null,
        just_use_selectedFields: boolean
    ): string {
        const refSchemas = allSchemas.filter(s => s.properties.some((f: PropDefinition) => f.refSchemas && f.refSchemas.includes(schema.name)));
        const fields: string[] = [];

        // refSchemas.forEach((refS) => {
        //     const refProps = refS.properties.filter((p: PropDefinition) => p.refSchemas && p.refSchemas.includes(schema.name));
        //     refProps.forEach((prop: PropDefinition) => {
        //         const key = `ref_${refS.name}_${prop.name}Dto`;
        //         if (list_key.includes(key)) {
        //             const subQuery = this.getInnerQuery(refS.properties, 1, 0, selectedFields, just_use_selectedFields);
        //             if (subQuery && subQuery.length > 0) {
        //                 fields.push(`${key}{${subQuery}}`);
        //             }
        //         }
        //     });
        // });

        // return fields.join(" ");
        return "";
    }

    /**
     * Validate prop name - tương đương getValidPropName
     */
    private getValidPropName(name?: string): string {
        if (!name) {
            return "";
        }

        const normalized = name.substr(0, 1).toLowerCase() + name.substr(1);

        if (RESERVED_GRAPHQL_NAMES.has(normalized)) {
            const original = name.substr(0, 1) + name.substr(1);
            if (!RESERVED_GRAPHQL_NAMES.has(original)) {
                return original;
            }

            return `_${normalized}`;
        }

        return normalized;
    }

    /**
     * Các generator methods khác - implement sau khi SAVE hoạt động
     */
    private generateFindReferenceString(schema: SchemaDefinition): string {
        return `query($_id:String!){response:find_reference_${schema.name}_dto(_id:$_id){code message data}}`;
    }

    private generateSearchReferenceString(schema: SchemaDefinition): string {
        return `query($key:String,$limit:Int,$withRecords:Boolean){response:search_reference_${schema.name}_dto(key:$key,limit:$limit,withRecords:$withRecords){code message records data}}`;
    }

    private generateAdvanceSearchReferenceString(schema: SchemaDefinition): string {
        return `query($filter:GeneralCollectionFilterInput){response:advance_search_reference_${schema.name}_dto(filter:$filter){code message records data}}`;
    }

    private generateQueryByFieldsString(schema: SchemaDefinition): string {
        return `query($filter:GeneralCollectionFilterInput,$fields:[ProjectedFieldStateInput]){response:query_${schema.name}_by_fields_dto(filter:$filter,fields:$fields){code message data}}`;
    }

    /**
     * Lazy load schema từ store
     */
    private getSchema(schemaName: string): SchemaDefinition | null {
        // Check schema cache first
        if (this.schemaCache.has(schemaName)) {
            return this.schemaCache.get(schemaName) || null;
        }

        // Get from Redux store
        const state = store.getState();
        const allSchemas: SchemaDefinition[] = state.schemas?.all_schemas || [];
        console.warn("current all schemas in store:", allSchemas.length);
        const schema = allSchemas.find((s) => s.name === schemaName);
        if (schema) {
            // Cache schema
            this.cacheSchema(schemaName, schema);
            return schema;
        }

        return null;
    }

    /**
     * Lấy tất cả schemas từ store
     */
    private getAllSchemas(): SchemaDefinition[] {
        const state = store.getState();
        return (state.schemas?.all_schemas || []) as SchemaDefinition[];
    }

    /**
     * Cache query với LRU eviction
     */
    private cacheQuery(key: string, value: string): void {
        // Evict nếu cache đầy
        if (this.cache.size >= this.maxCacheSize) {
            this.evictLeastUsed();
        }

        this.cache.set(key, value);
        this.accessCount.set(key, 1);
    }

    /**
     * Cache schema
     */
    private cacheSchema(schemaName: string, schema: SchemaDefinition): void {
        // Evict nếu schema cache đầy
        if (this.schemaCache.size >= this.maxSchemaCacheSize) {
            this.evictLeastUsedSchema();
        }

        this.schemaCache.set(schemaName, schema);
    }

    /**
     * LRU eviction cho query cache
     */
    private evictLeastUsed(): void {
        let leastUsedKey: string | null = null;
        let leastUsedCount = Infinity;

        this.accessCount.forEach((count, key) => {
            if (count < leastUsedCount) {
                leastUsedCount = count;
                leastUsedKey = key;
            }
        });

        if (leastUsedKey) {
            this.cache.delete(leastUsedKey);
            this.accessCount.delete(leastUsedKey);
        }
    }

    /**
     * LRU eviction cho schema cache
     */
    private evictLeastUsedSchema(): void {
        // Simple eviction - remove first entry
        const firstKey = this.schemaCache.keys().next().value;
        if (firstKey) {
            this.schemaCache.delete(firstKey);
        }
    }

    /**
     * Generate cache key
     */
    private generateCacheKey(schemaName: string, queryType: string, params: any): string {
        // Tạo key từ các tham số quan trọng
        const keyParams = {
            schemaName,
            queryType,
            maxLevel: params.maxLevel || 3,
            selectedFields: params.selectedFields ? params.selectedFields.sort().join(',') : null,
            just_use_selectedFields: params.just_use_selectedFields || false,
            additional_query: params.additional_query || ""
        };

        return JSON.stringify(keyParams);
    }

    /**
     * Update average generation time
     */
    private updateAverageGenerationTime(time: number): void {
        const total = this.stats.totalQueries;
        this.stats.averageGenerationTime =
            (this.stats.averageGenerationTime * (total - 1) + time) / total;
    }

    /**
     * Get cache statistics
     */
    getStats(): any {
        const hitRatio = this.stats.totalQueries > 0
            ? (this.stats.cacheHits / this.stats.totalQueries * 100).toFixed(2)
            : 0;

        return {
            ...this.stats,
            cacheSize: this.cache.size,
            schemaCacheSize: this.schemaCache.size,
            hitRatio: `${hitRatio}%`,
            averageGenerationTime: `${this.stats.averageGenerationTime.toFixed(2)}ms`
        };
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
        this.accessCount.clear();
        this.stats = {
            cacheHits: 0,
            cacheMisses: 0,
            totalQueries: 0,
            averageGenerationTime: 0
        };
    }

    /**
     * Clear schema cache
     */
    clearSchemaCache(): void {
        this.schemaCache.clear();
    }

    /**
     * Log memory usage (for debugging)
     */
    logMemoryUsage(): void {
        if ((performance as any).memory) {
            console.log('Memory Usage:', {
                used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024) + 'MB',
                limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            });
        }

        console.log('SchemaQueryManager Stats:', this.getStats());
    }
}

// Export singleton instance
export default SchemaQueryManager.getInstance();
