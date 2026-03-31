import _ from 'lodash';
import { mutate, query, queryList } from 'app/services/graphqlService';
import type { ApiResponse } from 'types/apis/ApiResponse';
import type { GeneralCollectionFilter } from 'types/filters/GeneralCollectionFilter';
import * as QUERY from './data.graphql';

export interface UpdatePartialContentParams {
  schema: string;
  data: Record<string, any>;
  _id: string;
}

export interface UpdatePartialContentByIdsParams {
  schema: string;
  data: Record<string, any>;
  ids: string[];
}

export interface DeleteContentParams {
  schema: string;
  _id: string;
}

export interface DeleteMultiContentParams {
  schema: string;
  _ids: string[];
}

export interface LockContentParams {
  schema: string;
  _id: string;
  locked: boolean;
}

export interface CreateSessionParams {
  tenantId?: string;
  schema: string;
  nestedId?: string;
  count?: number;
  file?: any;
}

export interface UpdateManyDataParams {
  sessionId?: string;
  tenantId?: string;
  schema: string;
  data: Record<string, any>[];
  update_if_duplicate?: boolean;
}

export interface UpdateNestedDataParams {
  tenantId?: string;
  schema: string;
  nestedId?: string;
  nestedData: Record<string, any>[];
  sessionId?: string;
}

export interface SaveContentParams {
  schema: string;
  data: Record<string, any>;
  update_if_duplicate?: boolean;
}

export interface SaveManyContentParams {
  schema: string;
  data: Record<string, any>[];
  fields?: string;
  update_if_duplicate?: boolean;
  sessionId?: string;
}
export interface QueryContentParams {
  schema: string;
  filter?: any;
}
export interface CountContentParams {
  schema: string;
  filter?: any;
}
export interface GetContentParams {
  schema: string;
  _id: string;
}

export interface MetricCollectionFilter extends GeneralCollectionFilter {
  target_schema?: string;
  collection?: string;
  segment_schema?: boolean;
  [key: string]: any;
}

export interface SegmentCountResult {
  key: string;
  count: number;
}

export interface TimeSeriesPoint {
  key: string;
  count: number;
}

export interface NumericAggregateResult {
  field: string;
  sum: number | null;
  avg: number | null;
  min: number | null;
  max: number | null;
  count: number;
  groupkey?: string | null;
}

export interface MetricQueryParams {
  filter?: MetricCollectionFilter;
}

export interface MetricTopCreatorsParams extends MetricQueryParams {
  top?: number;
}

export interface MetricTimeseriesParams extends MetricQueryParams {
  by?: 'day' | 'month' | 'year' | string;
  timeField?: 'createdAt' | 'updatedAt' | string;
}

export interface MetricFieldParams extends MetricQueryParams {
  field: string;
}

export interface MetricAggregateByGroupParams extends MetricFieldParams {
  groupBy: string;
}

export interface MetricGroupMultiParams extends MetricQueryParams {
  fields: string[];
}

type ScalarGraphQLPayload<T> = T | string | null | undefined;

const parse_scalar_graphql_payload = <T>(
  payload: ScalarGraphQLPayload<T>
): T | undefined => {
  if (payload === null || payload === undefined) {
    return undefined;
  }
  if (typeof payload !== 'string') {
    return payload as T;
  }

  const normalized = payload.trim();
  if (!normalized) {
    return undefined;
  }

  try {
    return JSON.parse(normalized) as T;
  } catch (_error) {
    return payload as unknown as T;
  }
};

const normalize_scalar_response = <T>(
  response: ApiResponse<ScalarGraphQLPayload<T>>
): ApiResponse<T> => {
  return {
    ...response,
    data: parse_scalar_graphql_payload<T>(response?.data)
  };
};


/** mutation Update partial content (partial update) */
export function update_partial_content(
  { schema, data, _id }: UpdatePartialContentParams,
  dispatch?: any
) {
  return mutate(QUERY.UPDATE_PARTIAL_CONTENT, { data, _id, schema }, dispatch);
}

/** mutation Update partial content by ids (partial update) */
export function update_partial_content_by_ids(
  { schema, data, ids }: UpdatePartialContentByIdsParams,
  dispatch?: any
) {
  return mutate(QUERY.UPDATE_PARTIAL_CONTENT_BY_IDS, { data, ids, schema }, dispatch);
}

/** mutation delete content */
export function delete_content(
  { schema, _id }: DeleteContentParams,
  dispatch?: any
) {
  return mutate(QUERY.DELETE_CONTENT, { _id, schema }, dispatch);
}

/** mutation delete multiple content */
export function delete_multi_content(
  { schema, _ids }: DeleteMultiContentParams,
  dispatch?: any
) {
  return mutate(QUERY.DELETE_MULTI_CONTENT, { _ids, schema }, dispatch);
}

/** mutation lock/unlock content */
export function lock_content(
  { schema, _id, locked }: LockContentParams,
  dispatch?: any
) {
  return mutate(QUERY.LOCK_CONTENT, { _id, schema, locked }, dispatch);
}

/** mutation create import session */
export function create_import_session(
  { tenantId, schema, nestedId, count, file }: CreateSessionParams,
  dispatch?: any
) {
  return mutate(
    QUERY.MUTATION_CREATE_SESSION,
    { tenantId, schema, nestedId, count, file },
    dispatch
  );
}

/** mutation update many data */
export function update_many_data(
  { sessionId, tenantId, schema, data, update_if_duplicate }: UpdateManyDataParams,
  dispatch?: any
) {
  return mutate(
    QUERY.MUTATION_UPDATE_MANY_DATA,
    { sessionId, tenantId, schema, data, update_if_duplicate },
    dispatch
  );
}

/** mutation update nested data */
export function update_nested_data(
  { tenantId, schema, nestedId, nestedData, sessionId }: UpdateNestedDataParams,
  dispatch?: any
) {
  return mutate(
    QUERY.MUTATION_UPDATE_NESTED_DATA,
    { tenantId, schema, nestedId, nestedData, sessionId },
    dispatch
  );
}

/** mutation save content (create or update) */
export function save_content(
  { schema, data, update_if_duplicate }: SaveContentParams,
  dispatch?: any
) {
  
  return mutate(QUERY.SAVE_CONTENT, { data, schema, update_if_duplicate }, dispatch);
}

/** mutation save many content */
export function save_many_content(
  { schema, data, fields, update_if_duplicate, sessionId }: SaveManyContentParams,
  dispatch?: any
) { 
  return mutate(QUERY.SAVE_MANY_CONTENT, { data, fields, schema, update_if_duplicate, sessionId }, dispatch);
}


export function query_content<T>({schema, filter}: QueryContentParams, dispatch?: any) {
  return queryList<T>(QUERY.QUERY_CONTENT, {schema, filter}, dispatch);
}

export function count_content({schema, filter}: CountContentParams, dispatch?: any) {
  return query(QUERY.COUNT_CONTENT, {schema, filter}, dispatch);
}

export function find_content<T>({schema, _id}: GetContentParams, dispatch?: any) {
  return query<T>(QUERY.GET_CONTENT, {schema, _id}, dispatch);
}
export function find_setting<T>(
  {schema}: {schema: string},
  dispatch?: any
): Promise<ApiResponse<T>> {
  return query<T>(QUERY.FIND_SETTING, {schema}, dispatch);
}
export function save_setting<T>({data, schema}: {data: Record<string, any>, schema: string}, dispatch?: any): Promise<ApiResponse<T>> {
  return mutate<T>(QUERY.SAVE_SETTING, {data, schema}, dispatch);
}

/** Các action metric trả dữ liệu đã được chuẩn hóa từ scalar GraphQL */
export function content_segment_count_by_schema(
  { filter = {} }: MetricQueryParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<SegmentCountResult[]>>(
    QUERY.CONTENT_SEGMENT_COUNT_BY_SCHEMA,
    { filter },
    dispatch
  ).then((response) => normalize_scalar_response<SegmentCountResult[]>(response));
}

export function content_segment_count_by_tenant(
  { filter = {} }: MetricQueryParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<SegmentCountResult[]>>(
    QUERY.CONTENT_SEGMENT_COUNT_BY_TENANT,
    { filter },
    dispatch
  ).then((response) => normalize_scalar_response<SegmentCountResult[]>(response));
}

export function content_segment_count_by_status(
  { filter = {} }: MetricQueryParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<SegmentCountResult[]>>(
    QUERY.CONTENT_SEGMENT_COUNT_BY_STATUS,
    { filter },
    dispatch
  ).then((response) => normalize_scalar_response<SegmentCountResult[]>(response));
}

export function content_segment_top_creators(
  { filter = {}, top = 10 }: MetricTopCreatorsParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<SegmentCountResult[]>>(
    QUERY.CONTENT_SEGMENT_TOP_CREATORS,
    { filter, top },
    dispatch
  ).then((response) => normalize_scalar_response<SegmentCountResult[]>(response));
}

export function content_segment_timeseries(
  { filter = {}, by = 'day', timeField = 'createdAt' }: MetricTimeseriesParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<TimeSeriesPoint[]>>(
    QUERY.CONTENT_SEGMENT_TIMESERIES,
    { filter, by, timeField },
    dispatch
  ).then((response) => normalize_scalar_response<TimeSeriesPoint[]>(response));
}

export function content_segment_group_count(
  { filter = {}, field }: MetricFieldParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<SegmentCountResult[]>>(
    QUERY.CONTENT_SEGMENT_GROUP_COUNT,
    { filter, field },
    dispatch
  ).then((response) => normalize_scalar_response<SegmentCountResult[]>(response));
}

export function content_numeric_aggregate(
  { filter = {}, field }: MetricFieldParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<NumericAggregateResult>>(
    QUERY.CONTENT_NUMERIC_AGGREGATE,
    { filter, field },
    dispatch
  ).then((response) => normalize_scalar_response<NumericAggregateResult>(response));
}

export function content_numeric_aggregate_by_group(
  { filter = {}, field, groupBy }: MetricAggregateByGroupParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<NumericAggregateResult[]>>(
    QUERY.CONTENT_NUMERIC_AGGREGATE_BY_GROUP,
    { filter, field, groupBy },
    dispatch
  ).then((response) => normalize_scalar_response<NumericAggregateResult[]>(response));
}

export function content_segment_group_multi(
  { filter = {}, fields }: MetricGroupMultiParams,
  dispatch?: any
) {
  return query<ScalarGraphQLPayload<SegmentCountResult[]>>(
    QUERY.CONTENT_SEGMENT_GROUP_MULTI,
    { filter, fields },
    dispatch
  ).then((response) => normalize_scalar_response<SegmentCountResult[]>(response));
}

export interface FindCustomDataBySchemaAndDocumentParams {
  schemaName: string;
  documentId: string;
}

/**
 * Lấy duy nhất bag `_customData` của một document theo schema và id.
 */
export function find_custom_data_by_schema_name_and_document_id(
  { schemaName, documentId }: FindCustomDataBySchemaAndDocumentParams,
  dispatch?: any
): Promise<ApiResponse<object>> {
  return query<object>(
    QUERY.FIND_CUSTOM_DATA_BY_SCHEMA_NAME_AND_DOCUMENT_ID,
    { schemaName, documentId },
    dispatch
  );
}

