import _ from 'lodash';
import { query } from 'app/services/graphqlService';
import gql from 'graphql-tag';
import { Dispatch } from 'redux';
import { EvaluateScriptContext } from 'types/base/EvaluateScriptContext';
import { PropDefinition } from 'types/schemas/PropDefinition';
import { SchemaDefinition, SchemaDefinitionExtend, SchemaNormalizationUtils } from 'types/schemas/SchemaDefinition';
import * as QUERY from './query';
import { generateFlattenProps } from './schemaQueryHelper';
import { getCustomQueryString, getCustomFindString, getCustomSaveString } from './GraphQLQueryGenerator';
import SchemaQueryManager from './SchemaQueryManager';
import { generateSchemaQuery } from './schemaQueryHelper';

import { HeadlessContentModel } from 'app/main/apps/anydata/types/HeadlessContentModel';
import type { AppThunk } from 'store';
import { FETCH_ALL_SCHEMAS } from 'store/reducers/schemas/schemas.reducer';
import { ApiListResponse, ApiResponse, IndexedContentItem } from 'types/apis/ApiResponse';
import { GeneralCollectionFilter } from 'types/filters/GeneralCollectionFilter';

// Type definitions for function parameters
interface UpdateDataSetParams {
    target_schema: string;
    ids: string[];
    is_keyfield: boolean;
    set: any;
}

interface ExecuteAsyncApiParams {
    api_key: string;
    input: any;
}

interface LoadSuggestionValueParams {
    schema: string | undefined;
    form?: Record<string, any>;
    property: any;
    text: string;
}

interface LoadSuggestForSystemFieldParams {
    systemCode: string;
    form?: Record<string, any>;
    text?: string;
    limit?: number;
    skip?: number;
}

interface SuggestionValueOption {
    value: string | number;
    label: string;
    [key: string]: any;
}

interface GetFieldValueRuntimeParams {
    schema: string;
    form: any;
    fieldId: string;
}

interface SearchIndexedContentParams {
    schemas: string[];
    key?: string;
    revert_schema?: boolean;
    isDraft?: boolean;
    limit?: number;
}

interface CreateApiSessionParams {
    api_name: string;
}

interface GetApiSessionParams {
    sessionId: string;
}



export function execute_async_api(
    { api_key, input }: ExecuteAsyncApiParams,
    dispatch: Dispatch
) {
    return query(QUERY.EXECUTE_ASYNC_API, { api_key, input }, dispatch);
}

export function fetch_all_schemas() {
    return (dispatch: Dispatch) => {
        return query(QUERY.GET_FULL_SCHEMAS, {}, dispatch).then((res: any) => {
            //generate flatten_props offline here
            if (res.data) {
                dispatch({
                    type: FETCH_ALL_SCHEMAS,
                    payload: res.data
                });
            }
        });
    };
}

export const get_ignorefields_on_submit = (form: any): string[] => {
    const ref_props = form
        ? Object.keys(form).filter((f) => f.search('ref_') !== -1 && f.search('updateVal-') !== -1)
        : [];
    return [
        ...ref_props,
        // Standard system fields
        "approval_results",
        "locker",
        "_state",
        "_action",
        "_content_id",
        "isLocked",
        "__gohashid",
        "isDisabled",
        "createdAt",
        "updatedAt",
        "lastVersion",
        "createdBy",
        "updatedBy",
        "isDraft",
        "version_number",
        "version_comment",
        "versionId",
        "message_numb",
        "follower_numb",
        "task_numb",
        // Runtime fields (sync với common_handle.ts)
        "version_numb",
        "wf_approval"
    ];
};

/**
 * Hàm eval script với proper typing cho parameters
 * Khai báo các tham số có thể truy xuất được từ hàm eval
 */
export function evaluateScript(
    script: string,
    context: EvaluateScriptContext,
    useMergeString?: boolean
): any {
    try {
        // Validation input
        if (!script || typeof script !== 'string') {
            console.warn('evaluateScript: Invalid script input', { script, type: typeof script });
            return null;
        }

        const {
            filterObject,
            data,
            inputData,
            user,
            query,
            text,
            skip,
            limit,
            sorted,
            group,
            setting,
            ...props
        } = context;

        if (useMergeString) {
            const mergeJson = (_ as any).mergeStringWithObject(script, {
                user,
                inputData,
                data,
                query,
                text,
                skip,
                limit,
                sorted,
                group,
                setting,
                filterObject,
                ...props
            });
            try {
                return mergeJson ? JSON.parse(mergeJson) : null;
            } catch (err: any) {
                console.error('evaluateScript merge error:', {
                    script,
                    error: err.message,
                    mergeJson,
                    context: { user, inputData, data, query }
                });
                return mergeJson;
            }
        } else {
            return _.evaluateExpression(script, context);
        }
    } catch (ex) {
        // Enhanced error logging with detailed information
        const errorInfo = {
            error: ex,
            message: ex instanceof Error ? ex.message : String(ex),
            stack: ex instanceof Error ? ex.stack : undefined,
            script: script,
            context: context,
            useMergeString: useMergeString,
            contextKeys: context ? Object.keys(context) : [],
            timestamp: new Date().toISOString()
        };

        console.error('evaluateScript error:', errorInfo);

        // Log specific error types for better debugging
        if (ex instanceof ReferenceError) {
            console.error('evaluateScript ReferenceError details:', {
                name: ex.name,
                message: ex.message,
                missingVariable: ex.message.match(/^(\w+) is not defined/)?.[1],
                availableVariables: context ? Object.keys(context) : [],
                script: script
            });
        }

        // Return null instead of throwing to prevent app crash
        return null;
    }
}

export function load_menu_badge_value(menuId: string, dispatch: any) {
    return query(QUERY.LOAD_MENU_BADGE_VALUE, { menuId }, dispatch);
}

/**
 * Để tối ưu hóa dữ liệu đẩy lên--> Viết lại hàm này hạn chế data đẩy lên bằng biến: suggestion_dependencies
 * chỉ có field nào được khai báo mới lấy ra từ form và đây lên (_id luôn luôn được đẩy lên)
 */
const normalizeSuggestionValues = (items: any): SuggestionValueOption[] => {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .map((item) => {
            if (item === null || item === undefined) {
                return null;
            }

            if (typeof item !== 'object') {
                const primitiveValue = typeof item === 'number' ? item : String(item);
                return {
                    value: primitiveValue,
                    label: String(item)
                } as SuggestionValueOption;
            }

            let valueCandidate: any =
                item.value ??
                item.code ??
                item._id ??
                item.id ??
                item.itemId ??
                item.key ??
                item.uuid;

            if (valueCandidate === null || valueCandidate === undefined) {
                return null;
            }

            if (typeof valueCandidate !== 'string' && typeof valueCandidate !== 'number') {
                valueCandidate = String(valueCandidate);
            }

            const labelCandidate =
                item.label ??
                item.title ??
                item.name ??
                item.display_name ??
                item.displayName ??
                item.text ??
                String(valueCandidate);

            if (labelCandidate === null || labelCandidate === undefined) {
                return null;
            }

            return {
                ...item,
                value: valueCandidate as string | number,
                label: String(labelCandidate)
            } as SuggestionValueOption;
        })
        .filter((option): option is SuggestionValueOption => Boolean(option));
};

export const load_suggestion_value = async (
    { schema, form, property, text }: LoadSuggestionValueParams,
    dispatch: any
): Promise<SuggestionValueOption[]> => {
    const getRoot = (root: any): any => {
        if (!root) {
            return {};
        }
        if (root._root) {
            return getRoot(root._root);
        } else {
            return root;
        }
    };

    // let submitForm = { ...form };

    let submitForm: any = _.omit(form || {}, ['lastVersion', 'wf_approval']);

    if ((property?.has_suggestion_script || property?.isMentions) && property.suggestion_dependencies) {
        property.suggestion_dependencies.forEach(function (path: string) {
            const value = _.get(form, path);
            _.set(submitForm, path, value);
        });
    } else if (form) {
        submitForm = { ...form };
    }

    try {
        const response = await query(QUERY.LOAD_SUGGESTION_VALUES, { schema, form: submitForm, fieldId: property.id, text }, dispatch);
        const raw = Array.isArray(response)
            ? response
            : Array.isArray((response as any)?.data)
                ? (response as any).data
                : [];
        return normalizeSuggestionValues(raw);
    } catch (error) {
        console.error('load_suggestion_value error:', error);
        return [];
    }
};

export const load_suggest_for_system_field = async (
    { systemCode, form, text = '', limit = 20, skip = 0 }: LoadSuggestForSystemFieldParams,
    dispatch: any
): Promise<SuggestionValueOption[]> => {
    try {
        const response = await query(
            QUERY.LOAD_SUGGEST_FOR_SYSTEM_FIELD,
            {
                system_code: systemCode,
                form: form || {},
                text,
                limit,
                skip
            },
            dispatch
        );

        const raw = Array.isArray(response)
            ? response
            : Array.isArray((response as any)?.data)
                ? (response as any).data
                : [];

        return normalizeSuggestionValues(raw);
    } catch (error) {
        console.error('load_suggest_for_system_field error:', error);
        return [];
    }
};

/**
 * Resolve system field values to their display names
 * @param system_code System field code (e.g., 'Building', 'Apartment')
 * @param values Array of IDs to resolve
 * @returns Array of { value, label } objects
 */
export const get_system_field_values = async (
    { system_code, values }: { system_code: string; values: string[] },
    dispatch: any
): Promise<Array<{ value: string; label: string }>> => {
    if (!system_code || !Array.isArray(values) || values.length === 0) {
        return [];
    }

    try {
        const response = await query(QUERY.GET_SYSTEM_FIELD_VALUES, { system_code, values }, dispatch);
        const raw = Array.isArray(response)
            ? response
            : Array.isArray((response as any)?.data)
                ? (response as any).data
                : [];

        // Convert all values to strings to match return type
        const normalized = normalizeSuggestionValues(raw);
        return normalized.map(item => ({
            value: String(item.value),
            label: item.label
        }));
    } catch (error) {
        console.error('get_system_field_values error:', error);
        return [];
    }
};

export const get_field_value_runtime = (
    { schema, form, fieldId }: GetFieldValueRuntimeParams,
    dispatch: any
) => {
    return query(QUERY.GET_FIELD_VALUE_RUNTIME, { schema, form, fieldId }, dispatch);
};
const maxLevel = 7;
export function find_schema(_id: string): AppThunk<Promise<SchemaDefinition | null>> {
    return (dispatch: any, getState: any): Promise<SchemaDefinition | null> => {
        const all_schemas = getState().schemas.all_schemas;
        if (all_schemas && all_schemas.length > 0) {
            const schema = all_schemas.find((s: any) => s._id == _id);
            if (schema) {
                // Chuẩn hóa schema ngay cả khi tìm thấy trong cache
                const normalizedSchema = SchemaNormalizationUtils.normalizeSchema(schema);

                // Đảm bảo đã có các chuỗi query/mutation cần thiết khi lấy từ cache
                try {
                    const hasGeneratedQueries = !!(normalizedSchema as any).graph_query_string;
                    if (!hasGeneratedQueries) {
                        generateFlattenProps(normalizedSchema as any);
                        generateSchemaQuery(normalizedSchema as any, all_schemas, maxLevel);
                    }
                } catch (e) {
                    // Không chặn luồng; chỉ log cảnh báo để tiếp tục xử lý
                    console.warn('find_schema: failed to ensure generated queries for cached schema', { _id, error: (e as any)?.message });
                }

                return Promise.resolve(normalizedSchema as SchemaDefinition);
            }
        }

        //search direct api
        return query(QUERY.FIND_SCHEMA, { _id }, dispatch)
            .then((response: any) => {
                let schema = response.data as SchemaDefinition | null | undefined;
                if (schema) {
                    // Chuẩn hóa schema trước khi xử lý
                    schema = SchemaNormalizationUtils.normalizeSchema(schema) as SchemaDefinition;

                    generateFlattenProps(schema as any);
                    generateSchemaQuery(schema as any, all_schemas, maxLevel);
                }
                return (schema as SchemaDefinition) || null;
            });
    };
}

/**
 * Lấy về schema cần truy vấn kèm các tham số tùy biến
 * name: tên schema
 * additional_fields: các trường muốn truy vấn thêm nếu như query mặc định không có
 * just_use_additional: truy vấn sẽ chỉ thêm vào duy nhất trường additional_fields được khai báo và bỏ qua cá trường mặc định
 */
export function get_schema_by_name(
    name: string,
    additional_fields?: string[],
    just_use_additional?: boolean,
    additional_query?: string
): AppThunk<Promise<SchemaDefinitionExtend | null>> {
    return (dispatch: any, getState: any): Promise<SchemaDefinitionExtend | null> => {
        const all_schemas = getState().schemas.all_schemas;
        const schema = all_schemas && all_schemas.find((s: any) => s.name?.toLowerCase() == name?.toLowerCase());

        if (schema) {
            // Chuẩn hóa schema ngay cả khi tìm thấy trong cache
            const normalizedSchema = SchemaNormalizationUtils.normalizeSchema(schema);
            // console.log('compare normalize schema', { schema, normalizedSchema });
            // Đảm bảo đã tạo các chuỗi query/mutation khi trả về từ cache
            try {
                const hasGeneratedQueries = !!(normalizedSchema as any).graph_query_string;
                if (!hasGeneratedQueries) {
                    generateFlattenProps(normalizedSchema as any);
                    generateSchemaQuery(normalizedSchema as any, all_schemas, maxLevel, additional_fields, just_use_additional, additional_query);
                }
            } catch (e) {
                console.warn('get_schema_by_name: failed to ensure generated queries for cached schema', { name, error: (e as any)?.message });
            }

            return Promise.resolve(normalizedSchema as SchemaDefinition);
        } else {
            //search direct api --> need to generate more property: flatten_props, ...
            return query(QUERY.FIND_SCHEMA_BY_NAME, { name }, dispatch)
                .then((response: any) => {
                    let schema = response.data as SchemaDefinition | null | undefined;

                    if (schema) {
                        schema = SchemaNormalizationUtils.normalizeSchema(schema) as SchemaDefinition;
                        //tính toán operations
                        generateFlattenProps(schema as any);
                        generateSchemaQuery(schema as any, [], maxLevel, additional_fields, just_use_additional, additional_query);
                    }
                    return (schema as SchemaDefinition) || null;
                });
        }
    };
}


export function exec_graph_query_string(
    name: string,
    filter: GeneralCollectionFilter,
    additional_fields?: string[],
    just_use_additional?: boolean,
    additional_query?: string
) {
    return (dispatch: any, getState: any) => {
        const all_schemas = getState().schemas.all_schemas;
        return dispatch(get_schema_by_name(name)).then((schema: SchemaDefinition | null) => {
            if (schema) {
                const querystring = getCustomQueryString(schema, all_schemas, 3, additional_fields, just_use_additional || false, additional_query || '');
                const graphQuery = gql`${querystring}`;
                const response = query(graphQuery, { filter }, dispatch);
                return Promise.resolve(response);
            }
            return null;
        });
    };
}

export function exec_graph_find_string(
    name: string,
    _id: string,
    additional_fields?: string[],
    just_use_additional?: boolean,
    additional_query?: string
) {
    return (dispatch: any, getState: any) => {
        const all_schemas = getState().schemas?.all_schemas || [];
        return dispatch(get_schema_by_name(name, additional_fields, just_use_additional, additional_query)).then((schema: SchemaDefinitionExtend | null) => {
            if (!schema) return Promise.resolve({
                code: 1,
                message: 'Schema not found',
                data: null
            } as ApiResponse<HeadlessContentModel>);
            const graphquery = gql`${getCustomFindString(schema, all_schemas || [], 5, additional_fields, just_use_additional || false, additional_query || '')}`;
            const response = query(graphquery, { _id }, dispatch);
            return Promise.resolve(response);
        });
    };
}



export function create_api_session({ api_name }: CreateApiSessionParams, dispatch: any) {
    return query(QUERY.QUERY_CREATE_SESSION, { api_name }, dispatch);
}

export function get_api_session({ sessionId }: GetApiSessionParams, dispatch: any) {
    return query(QUERY.QUERY_GET_SESSION, { sessionId }, dispatch);
}

/**
 * Tìm kiếm nội dung đã được index từ nhiều schema
 * @param schemas - Danh sách tên schema cần tìm kiếm
 * @param key - Từ khóa tìm kiếm (search keyword)
 * @param revert_schema - Có trả về thông tin schema hay không
 * @param isDraft - Chỉ lấy bản nháp hay không
 * @param limit - Số lượng kết quả tối đa
 * @returns Promise<SearchIndexedContentResponse> - Response chứa danh sách IndexedContentItem
 */
export function search_indexed_content({
    schemas,
    key,
    revert_schema,
    isDraft,
    limit
}: SearchIndexedContentParams): (dispatch: any) => Promise<ApiListResponse<IndexedContentItem>> {
    return (dispatch: any): Promise<ApiListResponse<IndexedContentItem>> => {
        return query(
            QUERY.SEARCH_INDEXED_CONTENT,
            {
                schemas,
                key: key ? `${key}` : "",
                revert_schema,
                isDraft,
                limit: limit || 20
            },
            dispatch
        ) as Promise<ApiListResponse<IndexedContentItem>>;
    };
}

/**
 * Lấy nội dung đã được index theo schema và values cụ thể
 * @param schema - Tên schema
 * @param values - Giá trị cần tìm (có thể là string, array, hoặc object)
 * @param by_id - Tìm theo ID hay theo code (thực ra có thể luôn luôn tìm theo code cũng được)
 * @returns Promise<ApiResponse<IndexedContentItem[]>> - Response chứa danh sách IndexedContentItem
 */
export function get_indexed_content(
    schema: string,
    values: any,
    by_id: boolean
): (dispatch: any) => Promise<ApiResponse<IndexedContentItem[]>> {
    if (values !== null && values !== undefined) {
        return (dispatch: any): Promise<ApiResponse<IndexedContentItem[]>> => {
            return query(
                QUERY.GET_INDEXED_CONTENT,
                { schema, values, by_id },
                dispatch
            ) as Promise<ApiResponse<IndexedContentItem[]>>;
        };
    } else {
        return (dispatch: any): Promise<ApiResponse<IndexedContentItem[]>> => {
            return new Promise((res) => {
                res({
                    code: 0,
                    message: 'No values provided',
                    data: []
                } as ApiResponse<IndexedContentItem[]>);
            });
        };
    }
}

/**
 * Hàm hỗ trợ lấy 1 dữ liệu schema phù hợp
 */
export function findRefSchema(
    property: PropDefinition,
    form: any
): (dispatch: any) => Promise<SchemaDefinition | null> {
    if (property?.isDynamicRefSchemas) {
        let refSchemasValue: any = form && (property as any).dynamicRefSchemas && form[(property as any).dynamicRefSchemas as string];
        if (refSchemasValue) {
            if (Array.isArray(refSchemasValue)) {
                refSchemasValue = refSchemasValue[0];
            }
            // Phân biệt _id vs name (id thường là chuỗi bắt đầu bằng ký số trong hệ thống này)
            if (/^[0-9].*/.test(String(refSchemasValue))) {
                return (dispatch: any) => dispatch(find_schema(refSchemasValue)) as Promise<SchemaDefinition | null>;
            } else {
                return (dispatch: any) => dispatch(get_schema_by_name(refSchemasValue)) as Promise<SchemaDefinition | null>;
            }
        }
    } else if (property?.refSchemas && (property.refSchemas as any[])[0]) {
        const schemaName = (property.refSchemas as any[])[0];
        return (dispatch: any) => dispatch(get_schema_by_name(schemaName)) as Promise<SchemaDefinition | null>;
    }

    return (_dispatch: any) => Promise.resolve(null);
}

/**
 * Returns only active custom properties for a schema, mapped to runtime.
 * Custom props are already flat so `isflatten` is a compatibility flag.
 */
export function query_custom_properties_by_schema_name(
    { name, isflatten }: { name: string; isflatten: boolean },
    dispatch?: any
): Promise<ApiListResponse<PropDefinition>> {
    return query(
        QUERY.QUERY_CUSTOM_PROPERTIES_BY_SCHEMA_NAME,
        { name, isflatten },
        dispatch
    ) as Promise<ApiListResponse<PropDefinition>>;
}
