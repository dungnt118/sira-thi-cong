import gql from 'graphql-tag';
/// hỗ trợ trong các truy vấn chi tiết ContentVersion
export const CONTENT_VERSION_FRAGMENT_STRUCTURE_STRING = `
{
	_id
	version_number
	createdAt
	createdBy
	version_comment
	payload
	updatedBy
	updatedAt
	schema
	original
	aplticketId
	reason
	diff
	expiresAt
	state
	action
	approval_ticket
}
`
export const CONTENT_VERSION_FRAGMENT = gql`
fragment contentVersion on ContentVersion${CONTENT_VERSION_FRAGMENT_STRUCTURE_STRING}
`

export const PROPERTY_FRAGMENT = gql`
fragment properties on PropDefinition{
	defaultValue
	defaultJsScript
	useDefaultScript
	faIcon
	value_options
	align
	allowedValues
	is_advance_table_filter	
	id
	form_group
	tbl_group
	langs
	formula
	view_style
	editor
	editorStyle
	hints
	placeholder
	has_suggestion_value
	is_ref_tree
	ref_show_schema
	ref_show_tenant
	ref_editable
	ref_editable_formId
	ref_editable_form_input
	inline_actions
	isHidden
    isHiddenForm
	isDisabled
	hideFormLabel
	formResponsive
	label
	accordion
	htmlIfEmpty
	name
	propType
	required
	refSchemas
	ref_revert	
	isRepresent
	isTextSearch
	formWidth
	formHeight
	colTabFixed
	colTabWidth
	has_suggestion_script 
	suggestion_dependencies
	view_lbl_by_suggest
	lookup_field_label
	lookup_field_value
	displayHtml
	format
	step
	action_style
	action_steps
	client_rules
	allowShowPassword
	nestedEditOption
	textEditOption
	componentOption
	referenceOption
	runtimeOption
	lookupsOption
	minValue
	maxValue
	isDynamicRefSchemas
	dynamicRefSchemas
	aggregation_script	
}
`

export const FIND_SCHEMA_BY_NAME = gql`
query($name:String!){
	response:find_schema_by_name(name:$name){
	  code
	  message
	  data
	}
  } 
`
export const FIND_SCHEMA = gql`
query($_id:String!){
	response:find_schema(_id:$_id){
	  code
	  message
	  data
	}
  } 
`

export const GET_FULL_SCHEMAS = gql`
query{
	response: query_schemas_full{
		code
    	message
    	data
  	}
}
`



export const GET_INDEXED_CONTENT = gql`
query($schema:String,$values:[Dictionary],$by_id:Boolean){
	response: get_indexed_content(schema:$schema,values:$values,by_id:$by_id){
		code
		message
		data
	}
}
`
export const SEARCH_INDEXED_CONTENT = gql`
query($schemas:[String],$key:String,$revert_schema:Boolean,$limit:Int){
	response:search_indexed_content(schemas:$schemas,key:$key,revert_schema:$revert_schema,skip:0,limit:$limit){
	  code
	  message
	  data
	}
  }
`

export const LOAD_SUGGESTION_VALUES = gql`
query load_suggestion_values($schema:String,$form:Dictionary,$fieldId:String,$text:String){
  response:get_suggest_field_value(schema:$schema,form:$form,fieldId:$fieldId,text:$text)
}
`

export const LOAD_SUGGEST_FOR_SYSTEM_FIELD = gql`
query load_suggest_for_system_field($system_code:String!,$form:Dictionary,$text:String,$limit:Int,$skip:Int){
	response: load_suggest_for_system_field(system_code:$system_code,form:$form,text:$text,limit:$limit,skip:$skip)
}
`

export const GET_SYSTEM_FIELD_VALUES = gql`
query get_system_field_values($system_code:String!,$values:[String]!){
	response: get_system_field_values(system_code:$system_code,values:$values)
}
`
export const GET_FIELD_VALUE_RUNTIME = gql`
query get_field_value_runtime($form:Dictionary,$schema:String,$fieldId:String){
	response: get_field_value_runtime(form:$form,schema:$schema,fieldId:$fieldId)
  }
`

export const EXECUTE_ASYNC_API = gql`
query execute_api_async($api_key:String,$input:Dictionary){
	response: execute_api_async(api_key:$api_key,input:$input){
	  code
	  message
	  data
	}
  }
`

export const QUERY_CREATE_SESSION = gql`
query($api_name:String){
    response: create_api_session(api_name:$api_name){
      code
      message
      data
    }
  }
`
export const QUERY_GET_SESSION = gql`
query($sessionId:String){
    response:get_api_session(sessionId:$sessionId){
      code
      message
      data
    }
  }
`
export const LOAD_MENU_BADGE_VALUE = gql`
query($menuId:String){
	response: get_menu_badge_number(menuId:$menuId){
		code
		message
		data
	}
}
`

// Returns only active custom properties for a schema, mapped to runtime.
export const QUERY_CUSTOM_PROPERTIES_BY_SCHEMA_NAME = gql`
query QueryCustomPropertiesBySchemaName($name:String!,$isflatten:Boolean!){
  response: query_custom_properties_by_schema_name(name:$name,isflatten:$isflatten){
    code
    message
    data
  }
}
`

