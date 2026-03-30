import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Schema interface
 * Auto-generated from Schema: Schema
 */
export interface ISchema {
  _id: string;
  panelType?: SchemaPanelTypeEnum;
  allowAI?: any[];
  faIcon?: string;
  inherit_sync_schemas?: IInheritSyncSchemasItem[];
  linked_reports?: any[];
  linked_documents?: any[];
  linked_timeline_flows?: any[];
  deleteCascade?: boolean;
  enable_prop_ext?: any[];
  max_prop_ext?: any[];
  use_update_trigger?: boolean;
  use_post_update_trigger?: boolean;
  segment_by_schema_name?: boolean;
  property_groups?: IPropertyGroupsItem[];
  is_system_schema?: boolean;
  use_saved_trigger?: boolean;
  use_delete_trigger?: boolean;
  use_authorization_trigger?: boolean;
  update_trigger_script?: string;
  post_update_trigger_script?: string;
  saved_trigger_script?: string;
  delete_trigger_script?: string;
  authorization_script?: string;
  disable?: boolean;
  is_tenant?: boolean;
  auto_update_if_duplicate?: boolean;
  auto_applychange_to_all_view?: boolean;
  auto_applychange_to_all_form?: boolean;
  prefer_view_panel_type?: SchemaPreferViewPanelTypeEnum;
  formGroupType?: SchemaFormGroupTypeEnum;
  manualFormLayout?: boolean;
  defaultDetailPanelId?: string;
  defaultDetailPanelType?: any[];
  not_validate_import?: boolean;
  not_validate_delete?: boolean;
  is_view?: boolean;
  schema_of_view?: string;
  debug?: boolean;
  displayOutputLog?: boolean;
  is_org_chart?: boolean;
  parentIdKey?: string;
  approval?: IApprovalItem[];
  conditionalGuardrails?: IConditionalguardrailsItem[];
  rls?: IRlsItem[];
  chatboxSetting?: IChatboxsettingItem[];
  apis?: any[];
  groupUniqueProps?: any[];
  groupIndexProps?: IGroupindexpropsItem[];
  controllers?: any[];
  name?: string;
  keyField?: string;
  enable_log?: boolean;
  is_version?: boolean;
  is_draft?: boolean;
  is_private_resource?: boolean;
  collection?: string;
  tags?: any[];
  label?: string;
  isNative?: boolean;
  use_extra_view_pipeline?: boolean;
  extra_view_pipeline?: string;
  error_message?: string;
  depended_schemas?: IDependedSchemasItem[];
  delete_dependances?: any[];
  update_dependances?: any[];
  should_delete_dependances?: boolean;
  type?: SchemaTypeEnum;
  no_header?: boolean;
  enableBc?: boolean;
  actions?: IActionsItem[];
  maxActiveAction?: number;
  is_custom_header?: boolean;
  custom_headerId?: string;
  extraAuthorizationScript?: string;
  version?: IVersionItem[];
  moduleIds?: any[];
  enableBackAction?: boolean;
  backAction?: IBackactionItem[];
  description?: string;
  requiredExtraAuthorization?: boolean;
  allowAnonymous?: any[];
  autoReload?: any[];
  interval?: any[];
  path?: string;
  initial_action_steps?: IInitialActionStepsItem[];
  isInvEvent?: any[];
  inv_evt_second?: any[];
  inv_action_steps?: IInvActionStepsItem[];
  isDcEvent?: any[];
  dc_action_steps?: IDcActionStepsItem[];
  use_ext_db?: any[];
  ext_db_id?: string;
}

export interface IInheritSyncSchemasItem {
  base_schema?: string;
  inherited_props?: any[];
}

export interface IPropertyGroupsItem {
  name?: string;
  view_layout?: PropertyGroupsViewLayoutEnum;
  form_layout?: PropertyGroupsFormLayoutEnum;
  showLabel?: boolean;
  style?: IStyleItem[];
}

export interface IStyleItem {
  gap?: number;
  dense?: boolean;
  maxWidth?: any[];
  alignItems?: string;
  justifyContent?: string;
  labelPosition?: string;
}

export interface IApprovalItem {
  enabled?: boolean;
  enable_approval_event?: boolean;
  on_approval_script?: string;
  enable_auto_mapping?: boolean;
  event_mappings?: IEventMappingsItem[];
  defaultDueAfter?: IDefaultdueafterItem[];
}

export interface IEventMappingsItem {
  eventType?: string;
  mappings?: IMappingsItem[];
}

export interface IMappingsItem {
  propertyName?: string;
  valueExpression?: string;
}

export interface IDefaultdueafterItem {
  Ticks?: any;
  Days?: number;
  Hours?: number;
  Milliseconds?: number;
  Microseconds?: number;
  Nanoseconds?: number;
  Minutes?: number;
  Seconds?: number;
  TotalDays?: number;
  TotalHours?: number;
  TotalMilliseconds?: number;
  TotalMicroseconds?: number;
  TotalNanoseconds?: number;
  TotalMinutes?: number;
  TotalSeconds?: number;
}

export interface IConditionalguardrailsItem {
  name?: string;
  condition_field?: string;
  op?: ConditionalguardrailsOpEnum;
  condition_values?: any[];
  fields?: any[];
  exclude_fields?: any[];
  message?: string;
  override_permission?: string;
  block_request?: boolean;
  apply_on_create?: any[];
  when_changed_only?: any[];
}

export interface IRlsItem {
  rls_enabled?: boolean;
  rowAccessDefaults?: RlsRowAccessDefaultsEnum;
  rowAccessRules?: IRowaccessrulesItem[];
  allow_tenant_override?: boolean;
  tenant_override_whitelist?: ITenantOverrideWhitelistItem[];
  owner_strategy?: RlsOwnerStrategyEnum;
  owner_payload_field?: string;
  owner_fixed_accountId?: string;
  allow_client_set_owner?: boolean;
  department_strategy?: RlsDepartmentStrategyEnum;
  department_payload_field?: string;
  department_from_field?: string;
  department_fixed_id?: string;
  allow_client_set_department?: boolean;
  rebuild_orgPath_on_update?: boolean;
  clone_keep_source_owner?: boolean;
  clone_keep_source_department?: boolean;
  access_owner_field?: string;
  access_department_field?: string;
}

export interface IRowaccessrulesItem {
  name?: string;
  applies_to?: IAppliesToItem[];
  scope?: RowaccessrulesScopeEnum;
  operations?: IOperationsItem[];
  extra_condition?: IExtraConditionItem[];
  message?: string;
}

export interface IAppliesToItem {
  roles?: any[];
  role_types?: any[];
  positions?: any[];
  departments?: any[];
  current_user_department?: boolean;
}

export interface IOperationsItem {
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface IExtraConditionItem {
  field?: string;
  op?: ExtraConditionOpEnum;
  values?: any[];
}

export interface ITenantOverrideWhitelistItem {
  allow_override_owd?: boolean;
  allow_add_rules?: boolean;
  allow_weaken_rules?: boolean;
  allowed_owner_strategies?: any[];
  allowed_department_strategies?: any[];
  allow_client_set_owner?: boolean;
  allow_client_set_department?: boolean;
}

export interface IChatboxsettingItem {
  enable_file_sharing?: boolean;
  enable_mentions?: boolean;
  enable_reactions?: boolean;
  default_visibility?: string;
  enable_comment?: any[];
  enable_edit?: any[];
  related_schema_policies?: IRelatedSchemaPoliciesItem[];
  enable_sub_threads?: boolean;
  max_thread_depth?: number;
  auto_threads?: IAutoThreadsItem[];
  allowed_thread_types?: any[];
  merge_rule_setting?: IMergeRuleSettingItem[];
}

export interface IRelatedSchemaPoliciesItem {
  target_schema?: string;
  label?: string;
  direction?: RelatedSchemaPoliciesDirectionEnum;
  source_prop_id?: string;
  target_prop_id?: string;
  required_permission?: string;
}

export interface IAutoThreadsItem {
  thread_code?: string;
  thread_type?: AutoThreadsThreadTypeEnum;
  title_template?: string;
  visibility?: AutoThreadsVisibilityEnum;
  singleton?: boolean;
  settings?: ISettingsItem[];
}

export interface ISettingsItem {
  allow_anonymous?: boolean;
  share_link_expiration_days?: number;
  auto_generate_share_link?: boolean;
  require_approval?: boolean;
  default_approver_role?: string;
  hide_from_external?: boolean;
  auto_archive_on_close?: boolean;
}

export interface IMergeRuleSettingItem {
  internal_view_strategy?: MergeRuleSettingInternalViewStrategyEnum;
  customer_view_strategy?: MergeRuleSettingCustomerViewStrategyEnum;
  reply_target_strategy?: MergeRuleSettingReplyTargetStrategyEnum;
  share_toggle_effect?: MergeRuleSettingShareToggleEffectEnum;
}

export interface IGroupindexpropsItem {
  Capacity?: number;
  Count?: number;
  Item?: string;
}

export interface IDependedSchemasItem {
  targetSchema?: string;
  targetPropId?: string;
  targetPropType?: DependedSchemasTargetPropTypeEnum;
  sourcePropId?: string;
  viewId?: string;
  name?: string;
}

export interface IActionsItem {
  name?: string;
  steps?: IStepsItem[];
  placement?: ActionsPlacementEnum;
  trackClickBegin?: boolean;
  trackClickEnd?: boolean;
  enableDisplayCondition?: boolean;
  displayCondition?: string;
  isSubmitForm?: boolean;
  use_api_check_executable?: boolean;
  api_check_executable?: string;
  key?: string;
  className?: string;
  faIcon?: string;
  style?: string;
  data_grid?: IDataGridItem[];
}

export interface IStepsItem {
  subject?: string;
  type?: StepsTypeEnum;
  disabled?: boolean;
  setting?: any;
  is_skip_condition?: boolean;
  is_terminate_condition?: boolean;
  skip_condition?: string;
  show_confirm_message?: boolean;
  confirm_message?: string;
  confirm_type?: string;
  confirm_ok_label?: string;
  confirm_cancel_label?: string;
  show_finish_message?: boolean;
  finish_message?: string;
  finish_message_type?: string;
  terminate_condition?: string;
  show_loading?: boolean;
  loading_message?: string;
}

export interface IDataGridItem {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  static?: boolean;
  minW?: number;
  minH?: number;
  isResizable?: boolean;
  isDraggable?: boolean;
  isBounded?: boolean;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface IBackactionItem {
  name?: string;
  steps?: IStepsItem[];
  placement?: BackactionPlacementEnum;
  trackClickBegin?: boolean;
  trackClickEnd?: boolean;
  enableDisplayCondition?: boolean;
  displayCondition?: string;
  isSubmitForm?: boolean;
  use_api_check_executable?: boolean;
  api_check_executable?: string;
  key?: string;
  className?: string;
  faIcon?: string;
  style?: string;
  data_grid?: IDataGridItem[];
}

export interface IStepsItem {
  subject?: string;
  type?: StepsTypeEnum2;
  disabled?: boolean;
  setting?: any;
  is_skip_condition?: boolean;
  is_terminate_condition?: boolean;
  skip_condition?: string;
  show_confirm_message?: boolean;
  confirm_message?: string;
  confirm_type?: string;
  confirm_ok_label?: string;
  confirm_cancel_label?: string;
  show_finish_message?: boolean;
  finish_message?: string;
  finish_message_type?: string;
  terminate_condition?: string;
  show_loading?: boolean;
  loading_message?: string;
}

export interface IDataGridItem {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  static?: boolean;
  minW?: number;
  minH?: number;
  isResizable?: boolean;
  isDraggable?: boolean;
  isBounded?: boolean;
}

export interface IInitialActionStepsItem {
  subject?: string;
  type?: InitialActionStepsTypeEnum;
  disabled?: boolean;
  setting?: any;
  is_skip_condition?: boolean;
  is_terminate_condition?: boolean;
  skip_condition?: string;
  show_confirm_message?: boolean;
  confirm_message?: string;
  confirm_type?: string;
  confirm_ok_label?: string;
  confirm_cancel_label?: string;
  show_finish_message?: boolean;
  finish_message?: string;
  finish_message_type?: string;
  terminate_condition?: string;
  show_loading?: boolean;
  loading_message?: string;
}

export interface IInvActionStepsItem {
  subject?: string;
  type?: InvActionStepsTypeEnum;
  disabled?: boolean;
  setting?: any;
  is_skip_condition?: boolean;
  is_terminate_condition?: boolean;
  skip_condition?: string;
  show_confirm_message?: boolean;
  confirm_message?: string;
  confirm_type?: string;
  confirm_ok_label?: string;
  confirm_cancel_label?: string;
  show_finish_message?: boolean;
  finish_message?: string;
  finish_message_type?: string;
  terminate_condition?: string;
  show_loading?: boolean;
  loading_message?: string;
}

export interface IDcActionStepsItem {
  subject?: string;
  type?: DcActionStepsTypeEnum;
  disabled?: boolean;
  setting?: any;
  is_skip_condition?: boolean;
  is_terminate_condition?: boolean;
  skip_condition?: string;
  show_confirm_message?: boolean;
  confirm_message?: string;
  confirm_type?: string;
  confirm_ok_label?: string;
  confirm_cancel_label?: string;
  show_finish_message?: boolean;
  finish_message?: string;
  finish_message_type?: string;
  terminate_condition?: string;
  show_loading?: boolean;
  loading_message?: string;
}

export interface ICreateSchemaInput {
  panelType?: SchemaPanelTypeEnum2;
  allowAI?: any[];
  faIcon?: string;
  inherit_sync_schemas?: IInheritSyncSchemasItem[];
  linked_reports?: any[];
  linked_documents?: any[];
  linked_timeline_flows?: any[];
  deleteCascade?: boolean;
  enable_prop_ext?: any[];
  max_prop_ext?: any[];
  use_update_trigger?: boolean;
  use_post_update_trigger?: boolean;
  segment_by_schema_name?: boolean;
  property_groups?: IPropertyGroupsItem[];
  is_system_schema?: boolean;
  use_saved_trigger?: boolean;
  use_delete_trigger?: boolean;
  use_authorization_trigger?: boolean;
  update_trigger_script?: string;
  post_update_trigger_script?: string;
  saved_trigger_script?: string;
  delete_trigger_script?: string;
  authorization_script?: string;
  disable?: boolean;
  is_tenant?: boolean;
  auto_update_if_duplicate?: boolean;
  auto_applychange_to_all_view?: boolean;
  auto_applychange_to_all_form?: boolean;
  prefer_view_panel_type?: SchemaPreferViewPanelTypeEnum2;
  formGroupType?: SchemaFormGroupTypeEnum2;
  manualFormLayout?: boolean;
  defaultDetailPanelId?: string;
  defaultDetailPanelType?: any[];
  not_validate_import?: boolean;
  not_validate_delete?: boolean;
  is_view?: boolean;
  schema_of_view?: string;
  debug?: boolean;
  displayOutputLog?: boolean;
  is_org_chart?: boolean;
  parentIdKey?: string;
  approval?: IApprovalItem[];
  conditionalGuardrails?: IConditionalguardrailsItem[];
  rls?: IRlsItem[];
  chatboxSetting?: IChatboxsettingItem[];
  apis?: any[];
  groupUniqueProps?: any[];
  groupIndexProps?: IGroupindexpropsItem[];
  controllers?: any[];
  name?: string;
  keyField?: string;
  enable_log?: boolean;
  is_version?: boolean;
  is_draft?: boolean;
  is_private_resource?: boolean;
  collection?: string;
  tags?: any[];
  label?: string;
  isNative?: boolean;
  use_extra_view_pipeline?: boolean;
  extra_view_pipeline?: string;
  error_message?: string;
  depended_schemas?: IDependedSchemasItem[];
  delete_dependances?: any[];
  update_dependances?: any[];
  should_delete_dependances?: boolean;
  type?: SchemaTypeEnum2;
  no_header?: boolean;
  enableBc?: boolean;
  actions?: IActionsItem[];
  maxActiveAction?: number;
  is_custom_header?: boolean;
  custom_headerId?: string;
  extraAuthorizationScript?: string;
  version?: IVersionItem[];
  moduleIds?: any[];
  enableBackAction?: boolean;
  backAction?: IBackactionItem[];
  description?: string;
  requiredExtraAuthorization?: boolean;
  allowAnonymous?: any[];
  autoReload?: any[];
  interval?: any[];
  path?: string;
  initial_action_steps?: IInitialActionStepsItem[];
  isInvEvent?: any[];
  inv_evt_second?: any[];
  inv_action_steps?: IInvActionStepsItem[];
  isDcEvent?: any[];
  dc_action_steps?: IDcActionStepsItem[];
  use_ext_db?: any[];
  ext_db_id?: string;
}

export type ISchemaListResponse = ApiListResponse<ISchema>

// Union types generated from value_options
export type SchemaPanelTypeEnum = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type SchemaPreferViewPanelTypeEnum = 'TABLE' | 'DYNAMICTABLE' | 'TABS' | 'LIST' | 'CHATUI' | 'GRID' | 'CARD' | 'CALENDAR' | 'SHEETTABLE' | 'SHEET' | 'KANBAN' | 'TREE' | 'TIMELINE' | 'TIMESHEET' | 'TIMESHEET2' | 'TIMETABLE' | 'GANTTCHART' | 'ORGCHART' | 'WORKFLOW' | 'CUSTOM';
export type SchemaFormGroupTypeEnum = 'Default' | 'Tab' | 'Step' | 'Paging' | 'SurveyCreator';
export type SchemaTypeEnum = 'Multiple' | 'Single';
export type PropertyGroupsViewLayoutEnum = 'vertical' | 'horizontal';
export type PropertyGroupsFormLayoutEnum = 'card' | 'tab' | 'accordion';
export type ConditionalguardrailsOpEnum = 'Equals' | 'NotEquals' | 'In' | 'NotIn' | 'IsTrue' | 'IsFalse' | 'IsEmpty' | 'NotEmpty';
export type RlsRowAccessDefaultsEnum = 'Private' | 'PublicRead' | 'PublicReadWrite';
export type RlsOwnerStrategyEnum = 'CreatedBy' | 'PayloadField' | 'DepartmentManager' | 'FixedAccount';
export type RlsDepartmentStrategyEnum = 'FromOwnerPrimaryDepartment' | 'PayloadField' | 'CreatorPrimaryDepartment' | 'FromField' | 'FixedDepartment';
export type RowaccessrulesScopeEnum = 'Self' | 'Department' | 'DepartmentAndChildren' | 'TenantOnly' | 'TenantAndChildren' | 'All';
export type ExtraConditionOpEnum = 'Equals' | 'NotEquals' | 'In' | 'NotIn' | 'IsEmpty' | 'NotEmpty';
export type RelatedSchemaPoliciesDirectionEnum = 'forward' | 'backward';
export type AutoThreadsThreadTypeEnum = 'Main activity log thread' | 'General discussion' | 'Escalation thread with approval' | 'Private internal notes' | 'Customer-facing external thread';
export type AutoThreadsVisibilityEnum = 'Riêng tư - Chỉ owner và người được mời' | 'Nội bộ - Tất cả users trong tổ chức' | 'Công khai - Không cần đăng nhập' | 'Hạn chế - Cần phê duyệt';
export type MergeRuleSettingInternalViewStrategyEnum = 'ExternalOnly' | 'ExternalPlusPublic' | 'ExternalPlusShared' | 'AllThreads';
export type MergeRuleSettingCustomerViewStrategyEnum = 'ExternalOnly' | 'ExternalPlusPublic';
export type MergeRuleSettingReplyTargetStrategyEnum = 'CurrentThreadOnly' | 'ForceExternal' | 'ForceMain' | 'PromptSelect';
export type MergeRuleSettingShareToggleEffectEnum = 'HideFutureOnly' | 'HideAllIncludingPast';
export type DependedSchemasTargetPropTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type ActionsPlacementEnum = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type BackactionPlacementEnum = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum2 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InitialActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InvActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type DcActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type SchemaPanelTypeEnum2 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type SchemaPreferViewPanelTypeEnum2 = 'TABLE' | 'DYNAMICTABLE' | 'TABS' | 'LIST' | 'CHATUI' | 'GRID' | 'CARD' | 'CALENDAR' | 'SHEETTABLE' | 'SHEET' | 'KANBAN' | 'TREE' | 'TIMELINE' | 'TIMESHEET' | 'TIMESHEET2' | 'TIMETABLE' | 'GANTTCHART' | 'ORGCHART' | 'WORKFLOW' | 'CUSTOM';
export type SchemaFormGroupTypeEnum2 = 'Default' | 'Tab' | 'Step' | 'Paging' | 'SurveyCreator';
export type SchemaTypeEnum2 = 'Multiple' | 'Single';
