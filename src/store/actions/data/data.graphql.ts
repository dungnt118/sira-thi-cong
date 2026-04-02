import gql from 'graphql-tag';

export const SAVE_CONTENT = gql`
mutation SaveContent($data: Dictionary!,$schema:String!,$update_if_duplicate:Boolean){
	response: save_content(data: $data,schema:$schema,update_if_duplicate:$update_if_duplicate){
	  code		
	  message
	  data
	}
}
`
export const SAVE_MANY_CONTENT = gql`
mutation SaveManyContent($data: [Dictionary],$fields:String,$schema:String!,$update_if_duplicate:Boolean,$sessionId:String){
	response: save_many_content(data: $data,fields:$fields,schema:$schema,update_if_duplicate:$update_if_duplicate,sessionId:$sessionId){
	  code		
	  message
	  data
	}
}
`

/** mutation Update partial content (partial update) */
export const UPDATE_PARTIAL_CONTENT = gql`
  mutation UpdatePartialContent($data: Dictionary!, $_id:String!,$schema:String!) {
	response: update_partial_content(data: $data, _id: $_id,schema:$schema) {
	  code
	  data 
	  message
	}
  }
`;

/** mutation Update partial content (partial update) */
export const UPDATE_PARTIAL_CONTENT_BY_IDS = gql`
  mutation UpdatePartialContentByIds($data: Dictionary!, $ids: [String], $schema:String!) {
	response: update_partial_content_by_ids(data: $data, is_multi: false, ids: $ids,schema:$schema) {
	  code
	  data 
	  message
	}
  }
`;

/** mutation delete content */
export const DELETE_CONTENT = gql`
  mutation DeleteContent($_id: String, $schema:String!) {
	response: delete_content(_id: $_id, schema:$schema) {
	  code
	  data 
	  message
	}
  }
`;

/** mutation delete content */
export const DELETE_MULTI_CONTENT = gql`
  mutation DeleteMultiContent($_ids: [String], $schema:String!) {
	response: delete_multi_content(_ids: $_ids, schema:$schema) {
	  code
	  data 
	  message
	}
  }
`;

export const LOCK_CONTENT = gql`
  mutation LockContent($_id: String!, $schema:String!,$locked:Boolean!) {
	response: lock_content(_id: $_id, schema:$schema, locked:$locked) {	
	  code
	  data 
	  message
	}
}
`;


export const MUTATION_CREATE_SESSION = gql`
mutation($tenantId:String,$schema:String,$nestedId:String,$count:Int,$file:HeadlessFileUploadInput){
    response: create_import_session(tenantId:$tenantId,schema:$schema,nestedId:$nestedId,count:$count,file:$file){
      code
      message
      data
    }
  }
`;

export const MUTATION_UPDATE_MANY_DATA = gql`
mutation($sessionId:String,$tenantId:String,$schema:String,$data:[Dictionary],$update_if_duplicate:Boolean){
    response: update_many_data(sessionId:$sessionId,schema:$schema,tenantId:$tenantId,data:$data,update_if_duplicate:$update_if_duplicate){
      code
      message
      data
    }
  }
`;
export const MUTATION_UPDATE_NESTED_DATA = gql`
mutation($tenantId:String,$schema:String,$nestedId:String,$nestedData:[Dictionary],$sessionId:String){
	response: update_many_nested_data(tenantId:$tenantId,schema:$schema,
		nestedId:$nestedId,nestedData:$nestedData,sessionId:$sessionId){
		code
		message
		data
	}
	}
`;

/** QUERY */
export const QUERY_CONTENT = gql`
query QueryContent($schema:String!,$filter:GeneralCollectionFilterInput){
	response: query_content(schema:$schema,filter:$filter){
	  code		
	  message
	  data
	}
}
`
export const COUNT_CONTENT = gql`
query CountContent($schema:String!,$filter:GeneralCollectionFilterInput){
	response: count_content(schema:$schema,filter:$filter){
	  code		
	  message
	  data
	}
}
`
export const GET_CONTENT = gql`
query FindContent($schema:String!,$_id:String!){
	response: find_content(schema:$schema,_id:$_id){
	  code		
	  message
	  data
	}
}
`

export const FIND_SETTING = gql`
query FindSettings($schema:String!){
	response: find_setting(schema:$schema){
	  code		
	  message
	  data
	}
}
`
export const SAVE_SETTING = gql`
mutation SaveSettings($data: Dictionary!, $schema:String!){
	response: save_setting(data: $data, schema:$schema){
	  code		
	  message
	  data
	}
}
`

/** QUERY metric dùng cho dashboard và widget tái sử dụng */
export const CONTENT_SEGMENT_COUNT_BY_SCHEMA = gql`
query ContentSegmentCountBySchema($filter: GeneralCollectionFilterInput!) {
	response: content_segment_count_by_schema(filter: $filter) {
	  code
	  message
	  data
	}
}
`;

export const CONTENT_SEGMENT_COUNT_BY_TENANT = gql`
query ContentSegmentCountByTenant($filter: GeneralCollectionFilterInput!) {
	response: content_segment_count_by_tenant(filter: $filter) {
	  code
	  message
	  data
	}
}
`;

export const CONTENT_SEGMENT_COUNT_BY_STATUS = gql`
query ContentSegmentCountByStatus($filter: GeneralCollectionFilterInput!) {
	response: content_segment_count_by_status(filter: $filter) {
	  code
	  message
	  data
	}
}
`;

export const CONTENT_SEGMENT_TOP_CREATORS = gql`
query ContentSegmentTopCreators($filter: GeneralCollectionFilterInput!, $top: Int = 10) {
	response: content_segment_top_creators(filter: $filter, top: $top) {
	  code
	  message
	  data
	}
}
`;

export const CONTENT_SEGMENT_TIMESERIES = gql`
query ContentSegmentTimeSeries(
	$filter: GeneralCollectionFilterInput!
	$by: String = "day"
	$timeField: String = "createdAt"
) {
	response: content_segment_timeseries(filter: $filter, by: $by, timeField: $timeField) {
	  code
	  message
	  data
	}
}
`;

export const CONTENT_SEGMENT_GROUP_COUNT = gql`
query ContentSegmentGroupCount($filter: GeneralCollectionFilterInput!, $field: String!) {
	response: content_segment_group_count(filter: $filter, field: $field) {
	  code
	  message
	  data
	}
}
`;

export const CONTENT_NUMERIC_AGGREGATE = gql`
query ContentNumericAggregate($filter: GeneralCollectionFilterInput!, $field: String!) {
	response: content_numeric_aggregate(filter: $filter, field: $field) {
	  code
	  message
	  data
	}
}
`;

export const CONTENT_NUMERIC_AGGREGATE_BY_GROUP = gql`
query ContentNumericAggregateByGroup(
	$filter: GeneralCollectionFilterInput!
	$field: String!
	$groupBy: String!
) {
	response: content_numeric_aggregate_by_group(filter: $filter, field: $field, groupBy: $groupBy) {
	  code
	  message
	  data
	}
}
`;

export const CONTENT_SEGMENT_GROUP_MULTI = gql`
query ContentSegmentGroupMulti($filter: GeneralCollectionFilterInput!, $fields: [String]!) {
	response: content_segment_group_multi(filter: $filter, fields: $fields) {
	  code
	  message
	  data
	}
}
`;

/** Lấy duy nhất _customData theo schemaName và documentId */
export const FIND_CUSTOM_DATA_BY_SCHEMA_NAME_AND_DOCUMENT_ID = gql`
query FindCustomDataBySchemaNameAndDocumentId($schemaName: String!, $documentId: String!) {
  response: find_custom_data_by_schema_name_and_document_id(
    schemaName: $schemaName
    documentId: $documentId
  ) {
    code
    message
    data
  }
}
`;
