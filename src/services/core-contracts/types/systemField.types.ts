import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SystemField interface
 * Auto-generated from Schema: SystemField
 */
export interface ISystemField {
  _id: string;
  code?: string;
  label?: string;
  required?: any[];
  format?: string;
  view_style?: string;
  groupId?: string;
  refSchemas?: any[];
  propType?: SystemFieldPropTypeEnum;
  value_options?: IValueOptionsItem[];
  nested?: INestedItem[];
  cloneCount?: number;
  isDeleted?: boolean;
  tags?: any[];
  description?: string;
  faIcon?: string;
  hints?: string;
  inSensitive?: any[];
  placeholder?: string;
  action_style?: any[];
  viewHeight?: any[];
  action_steps?: IActionStepsItem[];
  useDefaultScript?: any[];
  defaultJsScript?: string;
  defaultValue?: any;
  minValue?: any;
  maxValue?: any;
  align?: SystemFieldAlignEnum;
  step?: any[];
  editor?: SystemFieldEditorEnum;
  aggregation?: SystemFieldAggregationEnum;
  aggregation_script?: string;
  inline_actions?: IInlineActionsItem[];
  formWidth?: SystemFieldFormWidthEnum;
  formHeight?: any[];
  colTabWidth?: string;
  colTabFixed?: string;
  client_rules?: IClientRulesItem[];
  textEditOption?: ITexteditoptionItem[];
  fileUploadOption?: IFileuploadoptionItem[];
  nestedEditOption?: INestededitoptionItem[];
  runtimeOption?: IRuntimeoptionItem[];
  referenceOption?: IReferenceoptionItem[];
  objectOption?: IObjectoptionItem[];
  lookupsOption?: ILookupsoptionItem[];
  componentOption?: IComponentoptionItem[];
  autoGenerateOption?: IAutogenerateoptionItem[];
  viewSetting?: IViewsettingItem[];
}

export interface IValueOptionsItem {
  value?: string;
  label?: string;
  hints?: string;
  color?: string;
  faIcon?: string;
  cssClass?: string;
  style?: string;
  tooltip?: string;
  group?: string;
  order?: any[];
  disabled?: any[];
  hidden?: any[];
  disabledWhen?: string;
  visibleWhen?: string;
}

export interface INestedItem {
  code?: string;
  label?: string;
  required?: any[];
  format?: string;
  view_style?: string;
  groupId?: string;
  refSchemas?: any[];
  propType?: NestedPropTypeEnum;
  value_options?: IValueOptionsItem[];
  nested?: INestedItem[];
  cloneCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
  tags?: any[];
  description?: string;
  faIcon?: string;
  hints?: string;
  inSensitive?: any[];
  placeholder?: string;
  action_style?: any[];
  viewHeight?: any[];
  action_steps?: IActionStepsItem[];
  useDefaultScript?: any[];
  defaultJsScript?: string;
  defaultValue?: any;
  minValue?: any;
  maxValue?: any;
  align?: NestedAlignEnum;
  step?: any[];
  editor?: NestedEditorEnum;
  aggregation?: NestedAggregationEnum;
  aggregation_script?: string;
  inline_actions?: IInlineActionsItem[];
  formWidth?: NestedFormWidthEnum;
  formHeight?: any[];
  colTabWidth?: string;
  colTabFixed?: string;
  client_rules?: IClientRulesItem[];
  textEditOption?: ITexteditoptionItem[];
  fileUploadOption?: IFileuploadoptionItem[];
  nestedEditOption?: INestededitoptionItem[];
  runtimeOption?: IRuntimeoptionItem[];
  referenceOption?: IReferenceoptionItem[];
  objectOption?: IObjectoptionItem[];
  lookupsOption?: ILookupsoptionItem[];
  componentOption?: IComponentoptionItem[];
  autoGenerateOption?: IAutogenerateoptionItem[];
  id?: string;
}

export interface IValueOptionsItem {
  value?: string;
  label?: string;
  hints?: string;
  color?: string;
  faIcon?: string;
  cssClass?: string;
  style?: string;
  tooltip?: string;
  group?: string;
  order?: any[];
  disabled?: any[];
  hidden?: any[];
  disabledWhen?: string;
  visibleWhen?: string;
}

export interface INestedItem {
  code?: string;
  label?: string;
  required?: any[];
  format?: string;
  view_style?: string;
  groupId?: string;
  refSchemas?: any[];
  propType?: NestedPropTypeEnum2;
  value_options?: IValueOptionsItem[];
  nested?: INestedItem[];
  cloneCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
  tags?: any[];
  description?: string;
  faIcon?: string;
  hints?: string;
  inSensitive?: any[];
  placeholder?: string;
  action_style?: any[];
  viewHeight?: any[];
  action_steps?: IActionStepsItem[];
  useDefaultScript?: any[];
  defaultJsScript?: string;
  defaultValue?: any;
  minValue?: any;
  maxValue?: any;
  align?: NestedAlignEnum2;
  step?: any[];
  editor?: NestedEditorEnum2;
  aggregation?: NestedAggregationEnum2;
  aggregation_script?: string;
  inline_actions?: IInlineActionsItem[];
  formWidth?: NestedFormWidthEnum2;
  formHeight?: any[];
  colTabWidth?: string;
  colTabFixed?: string;
  client_rules?: IClientRulesItem[];
  textEditOption?: ITexteditoptionItem[];
  fileUploadOption?: IFileuploadoptionItem[];
  nestedEditOption?: INestededitoptionItem[];
  runtimeOption?: IRuntimeoptionItem[];
  referenceOption?: IReferenceoptionItem[];
  objectOption?: IObjectoptionItem[];
  lookupsOption?: ILookupsoptionItem[];
  componentOption?: IComponentoptionItem[];
  autoGenerateOption?: IAutogenerateoptionItem[];
  id?: string;
}

export interface IValueOptionsItem {
  value?: string;
  label?: string;
  hints?: string;
  color?: string;
  faIcon?: string;
  cssClass?: string;
  style?: string;
  tooltip?: string;
  group?: string;
  order?: any[];
  disabled?: any[];
  hidden?: any[];
  disabledWhen?: string;
  visibleWhen?: string;
}

export interface INestedItem {
  code?: string;
  label?: string;
  required?: any[];
  format?: string;
  view_style?: string;
  groupId?: string;
  refSchemas?: any[];
  propType?: NestedPropTypeEnum3;
  value_options?: IValueOptionsItem[];
  nested?: INestedItem[];
  cloneCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
  tags?: any[];
  description?: string;
  faIcon?: string;
  hints?: string;
  inSensitive?: any[];
  placeholder?: string;
  action_style?: any[];
  viewHeight?: any[];
  action_steps?: IActionStepsItem[];
  useDefaultScript?: any[];
  defaultJsScript?: string;
  defaultValue?: any;
  minValue?: any;
  maxValue?: any;
  align?: NestedAlignEnum3;
  step?: any[];
  editor?: NestedEditorEnum3;
  aggregation?: NestedAggregationEnum3;
  aggregation_script?: string;
  inline_actions?: IInlineActionsItem[];
  formWidth?: NestedFormWidthEnum3;
  formHeight?: any[];
  colTabWidth?: string;
  colTabFixed?: string;
  client_rules?: IClientRulesItem[];
  textEditOption?: ITexteditoptionItem[];
  fileUploadOption?: IFileuploadoptionItem[];
  nestedEditOption?: INestededitoptionItem[];
  runtimeOption?: IRuntimeoptionItem[];
  referenceOption?: IReferenceoptionItem[];
  objectOption?: IObjectoptionItem[];
  lookupsOption?: ILookupsoptionItem[];
  componentOption?: IComponentoptionItem[];
  autoGenerateOption?: IAutogenerateoptionItem[];
  id?: string;
}

export interface IValueOptionsItem {
  value?: string;
  label?: string;
  hints?: string;
  color?: string;
  faIcon?: string;
  cssClass?: string;
  style?: string;
  tooltip?: string;
  group?: string;
  order?: any;
  disabled?: any;
  hidden?: any;
  disabledWhen?: string;
  visibleWhen?: string;
}

export interface INestedItem {
  code?: string;
  label?: string;
  required?: any;
  format?: string;
  view_style?: string;
  groupId?: string;
  refSchemas?: any[];
  propType?: NestedPropTypeEnum4;
  value_options?: any;
  nested?: any;
  cloneCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
  tags?: any[];
  description?: string;
  faIcon?: string;
  hints?: string;
  inSensitive?: any;
  placeholder?: string;
  action_style?: any;
  viewHeight?: any;
  action_steps?: any;
  useDefaultScript?: any;
  defaultJsScript?: string;
  defaultValue?: any;
  minValue?: any;
  maxValue?: any;
  align?: NestedAlignEnum4;
  step?: any;
  editor?: NestedEditorEnum4;
  aggregation?: NestedAggregationEnum4;
  aggregation_script?: string;
  inline_actions?: any;
  formWidth?: NestedFormWidthEnum4;
  formHeight?: any;
  colTabWidth?: string;
  colTabFixed?: string;
  client_rules?: any;
  textEditOption?: any;
  fileUploadOption?: any;
  nestedEditOption?: any;
  runtimeOption?: any;
  referenceOption?: any;
  objectOption?: any;
  lookupsOption?: any;
  componentOption?: any;
  autoGenerateOption?: any;
  id?: string;
}

export interface IActionStepsItem {
  subject?: string;
  type?: ActionStepsTypeEnum;
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

export interface IInlineActionsItem {
  name?: string;
  steps?: any;
  placement?: InlineActionsPlacementEnum;
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
  data_grid?: any;
}

export interface IClientRulesItem {
  event?: ClientRulesEventEnum;
  action?: string;
}

export interface ITexteditoptionItem {
  maxCharacters?: any;
  maxLength?: any;
  maxWords?: any;
  minCharacters?: any;
  minLength?: any;
  minWords?: any;
  patternMessage?: string;
  pattern?: any[];
  isProgress?: any;
  suggest_method?: TexteditoptionSuggestMethodEnum;
  suggest_value?: string;
  maxCol?: any;
  maxRow?: any;
  isModifyCode?: any;
  modifyCodeTemplate?: string;
  height?: any;
  btnUploadLabel?: string;
  uploadTemplate?: TexteditoptionUploadTemplateEnum;
  disableScript?: string;
  itemHtml?: string;
}

export interface IFileuploadoptionItem {
  enable_extension?: any;
  extensions?: any[];
  view_as_media?: any;
  preview_mode?: FileuploadoptionPreviewModeEnum;
  folder?: string;
  max_size?: any;
}

export interface INestededitoptionItem {
  minItem?: any;
  maxItem?: any;
  enable_create_btn?: boolean;
  enable_checkable?: boolean;
  enable_clone_btn?: boolean;
  enable_edit_btn?: boolean;
  enable_delete_btn?: boolean;
  enable_quick_edit?: boolean;
  enable_import?: boolean;
  is_api_extractor?: boolean;
  api_extractor?: string;
  enable_export?: boolean;
  enable_delete_all?: boolean;
  default_expand?: boolean;
  pageSize?: number;
  isPagination?: boolean;
  enable_search?: boolean;
  enable_index?: boolean;
  filterableIds?: any[];
  searchableIds?: any[];
  sectionFieldId?: string;
  itemFieldId?: string;
  sortedBys?: any[];
  gridColumns?: number;
  allowReorder?: any;
  debounceMs?: any;
}

export interface IRuntimeoptionItem {
  resolverType?: RuntimeoptionResolverTypeEnum;
  dependencies?: any;
  script?: string;
  cacheDuration?: any;
  timeoutSeconds?: any;
}

export interface IReferenceoptionItem {
  minItem?: any;
  maxItem?: any;
  nativeSearch?: boolean;
  searchFilter?: any;
  orgSearch?: boolean;
  orgField?: string;
  orgResolver?: ReferenceoptionOrgResolverEnum;
  includeLinkedAccount?: any;
  cacheDuration?: number;
  showSchemaSelector?: boolean;
}

export interface IObjectoptionItem {
  view_mode?: ObjectoptionViewModeEnum;
  view_visible_fields?: any[];
  view_template?: string;
}

export interface ILookupsoptionItem {
  target_field?: string;
  target_type?: LookupsoptionTargetTypeEnum;
  target_schemas?: any;
  aggregation?: LookupsoptionAggregationEnum;
  conditions?: any;
  logic?: LookupsoptionLogicEnum;
}

export interface IComponentoptionItem {
  panelId?: string;
  panelType?: ComponentoptionPanelTypeEnum;
  inputData?: string;
}

export interface IAutogenerateoptionItem {
  enabled?: any;
  parts?: any;
  separator?: string;
  allowOverride?: any;
  showPreview?: any;
  ensureUnique?: any;
  duplicateStrategy?: any;
  maxRetries?: any;
  regenerateOnEdit?: any;
  generateWhen?: string;
  sequenceScope?: string;
}

export interface IActionStepsItem {
  subject?: string;
  type?: ActionStepsTypeEnum2;
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

export interface IInlineActionsItem {
  name?: string;
  steps?: IStepsItem[];
  placement?: InlineActionsPlacementEnum2;
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

export interface IClientRulesItem {
  event?: ClientRulesEventEnum2;
  action?: string;
}

export interface ITexteditoptionItem {
  maxCharacters?: any[];
  maxLength?: any[];
  maxWords?: any[];
  minCharacters?: any[];
  minLength?: any[];
  minWords?: any[];
  patternMessage?: string;
  pattern?: any[];
  isProgress?: any[];
  suggest_method?: TexteditoptionSuggestMethodEnum2;
  suggest_value?: string;
  maxCol?: any[];
  maxRow?: any[];
  isModifyCode?: any[];
  modifyCodeTemplate?: string;
  height?: any[];
  btnUploadLabel?: string;
  uploadTemplate?: TexteditoptionUploadTemplateEnum2;
  disableScript?: string;
  itemHtml?: string;
}

export interface IFileuploadoptionItem {
  enable_extension?: any[];
  extensions?: any[];
  view_as_media?: any[];
  preview_mode?: FileuploadoptionPreviewModeEnum2;
  folder?: string;
  max_size?: any[];
}

export interface INestededitoptionItem {
  minItem?: any[];
  maxItem?: any[];
  enable_create_btn?: boolean;
  enable_checkable?: boolean;
  enable_clone_btn?: boolean;
  enable_edit_btn?: boolean;
  enable_delete_btn?: boolean;
  enable_quick_edit?: boolean;
  enable_import?: boolean;
  is_api_extractor?: boolean;
  api_extractor?: string;
  enable_export?: boolean;
  enable_delete_all?: boolean;
  default_expand?: boolean;
  pageSize?: number;
  isPagination?: boolean;
  enable_search?: boolean;
  enable_index?: boolean;
  filterableIds?: any[];
  searchableIds?: any[];
  sectionFieldId?: string;
  itemFieldId?: string;
  sortedBys?: any[];
  gridColumns?: number;
  allowReorder?: any[];
  debounceMs?: any[];
}

export interface IRuntimeoptionItem {
  resolverType?: RuntimeoptionResolverTypeEnum2;
  dependencies?: IDependenciesItem[];
  script?: string;
  cacheDuration?: any[];
  timeoutSeconds?: any[];
}

export interface IDependenciesItem {
  Chars?: any;
  Length?: number;
}

export interface IReferenceoptionItem {
  minItem?: any[];
  maxItem?: any[];
  nativeSearch?: boolean;
  searchFilter?: ISearchfilterItem[];
  orgSearch?: boolean;
  orgField?: string;
  orgResolver?: ReferenceoptionOrgResolverEnum2;
  includeLinkedAccount?: any[];
  cacheDuration?: number;
  showSchemaSelector?: boolean;
}

export interface ISearchfilterItem {
  op?: SearchfilterOpEnum;
  refcollection?: string;
  refalias?: string;
  children?: any;
  id?: string;
  value?: any;
  propType?: string;
  namespace?: string;
  operation?: string;
  customQuery?: string;
  rawFilter?: boolean;
}

export interface IObjectoptionItem {
  view_mode?: ObjectoptionViewModeEnum2;
  view_visible_fields?: any[];
  view_template?: string;
}

export interface ILookupsoptionItem {
  target_field?: string;
  target_type?: LookupsoptionTargetTypeEnum2;
  target_schemas?: ITargetSchemasItem[];
  aggregation?: LookupsoptionAggregationEnum2;
  conditions?: IConditionsItem[];
  logic?: LookupsoptionLogicEnum2;
}

export interface ITargetSchemasItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IConditionsItem {
  source?: string;
  target?: string;
  operator?: string;
  isexact?: boolean;
  values?: any[];
  type?: ConditionsTypeEnum;
}

export interface IComponentoptionItem {
  panelId?: string;
  panelType?: ComponentoptionPanelTypeEnum2;
  inputData?: string;
}

export interface IAutogenerateoptionItem {
  enabled?: any[];
  parts?: IPartsItem[];
  separator?: string;
  allowOverride?: any[];
  showPreview?: any[];
  ensureUnique?: any[];
  duplicateStrategy?: any[];
  maxRetries?: any[];
  regenerateOnEdit?: any[];
  generateWhen?: string;
  sequenceScope?: string;
}

export interface IPartsItem {
  type?: PartsTypeEnum;
  value?: string;
  length?: any;
  resetCycle?: any;
  startFrom?: any;
  step?: any;
  source?: string;
  format?: string;
  timezone?: string;
  fieldName?: string;
  transforms?: any;
  fallback?: string;
  randomType?: any;
  randomLength?: any;
  script?: string;
}

export interface IActionStepsItem {
  subject?: string;
  type?: ActionStepsTypeEnum3;
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

export interface IInlineActionsItem {
  name?: string;
  steps?: IStepsItem[];
  placement?: InlineActionsPlacementEnum3;
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

export interface IClientRulesItem {
  event?: ClientRulesEventEnum3;
  action?: string;
}

export interface ITexteditoptionItem {
  maxCharacters?: any[];
  maxLength?: any[];
  maxWords?: any[];
  minCharacters?: any[];
  minLength?: any[];
  minWords?: any[];
  patternMessage?: string;
  pattern?: any[];
  isProgress?: any[];
  suggest_method?: TexteditoptionSuggestMethodEnum3;
  suggest_value?: string;
  maxCol?: any[];
  maxRow?: any[];
  isModifyCode?: any[];
  modifyCodeTemplate?: string;
  height?: any[];
  btnUploadLabel?: string;
  uploadTemplate?: TexteditoptionUploadTemplateEnum3;
  disableScript?: string;
  itemHtml?: string;
}

export interface IFileuploadoptionItem {
  enable_extension?: any[];
  extensions?: any[];
  view_as_media?: any[];
  preview_mode?: FileuploadoptionPreviewModeEnum3;
  folder?: string;
  max_size?: any[];
}

export interface INestededitoptionItem {
  minItem?: any[];
  maxItem?: any[];
  enable_create_btn?: boolean;
  enable_checkable?: boolean;
  enable_clone_btn?: boolean;
  enable_edit_btn?: boolean;
  enable_delete_btn?: boolean;
  enable_quick_edit?: boolean;
  enable_import?: boolean;
  is_api_extractor?: boolean;
  api_extractor?: string;
  enable_export?: boolean;
  enable_delete_all?: boolean;
  default_expand?: boolean;
  pageSize?: number;
  isPagination?: boolean;
  enable_search?: boolean;
  enable_index?: boolean;
  filterableIds?: any[];
  searchableIds?: any[];
  sectionFieldId?: string;
  itemFieldId?: string;
  sortedBys?: any[];
  gridColumns?: number;
  allowReorder?: any[];
  debounceMs?: any[];
}

export interface IRuntimeoptionItem {
  resolverType?: RuntimeoptionResolverTypeEnum3;
  dependencies?: IDependenciesItem[];
  script?: string;
  cacheDuration?: any[];
  timeoutSeconds?: any[];
}

export interface IDependenciesItem {
  Chars?: any;
  Length?: number;
}

export interface IReferenceoptionItem {
  minItem?: any[];
  maxItem?: any[];
  nativeSearch?: boolean;
  searchFilter?: ISearchfilterItem[];
  orgSearch?: boolean;
  orgField?: string;
  orgResolver?: ReferenceoptionOrgResolverEnum3;
  includeLinkedAccount?: any[];
  cacheDuration?: number;
  showSchemaSelector?: boolean;
}

export interface ISearchfilterItem {
  op?: SearchfilterOpEnum2;
  refcollection?: string;
  refalias?: string;
  children?: IChildrenItem[];
  id?: string;
  value?: any;
  propType?: string;
  namespace?: string;
  operation?: string;
  customQuery?: string;
  rawFilter?: boolean;
}

export interface IChildrenItem {
  op?: ChildrenOpEnum;
  refcollection?: string;
  refalias?: string;
  children?: any;
  id?: string;
  value?: any;
  propType?: string;
  namespace?: string;
  operation?: string;
  customQuery?: string;
  rawFilter?: boolean;
}

export interface IObjectoptionItem {
  view_mode?: ObjectoptionViewModeEnum3;
  view_visible_fields?: any[];
  view_template?: string;
}

export interface ILookupsoptionItem {
  target_field?: string;
  target_type?: LookupsoptionTargetTypeEnum3;
  target_schemas?: ITargetSchemasItem[];
  aggregation?: LookupsoptionAggregationEnum3;
  conditions?: IConditionsItem[];
  logic?: LookupsoptionLogicEnum3;
}

export interface ITargetSchemasItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IConditionsItem {
  source?: string;
  target?: string;
  operator?: string;
  isexact?: boolean;
  values?: any[];
  type?: ConditionsTypeEnum2;
}

export interface IComponentoptionItem {
  panelId?: string;
  panelType?: ComponentoptionPanelTypeEnum3;
  inputData?: string;
}

export interface IAutogenerateoptionItem {
  enabled?: any[];
  parts?: IPartsItem[];
  separator?: string;
  allowOverride?: any[];
  showPreview?: any[];
  ensureUnique?: any[];
  duplicateStrategy?: any[];
  maxRetries?: any[];
  regenerateOnEdit?: any[];
  generateWhen?: string;
  sequenceScope?: string;
}

export interface IPartsItem {
  type?: PartsTypeEnum2;
  value?: string;
  length?: any[];
  resetCycle?: any[];
  startFrom?: any[];
  step?: any[];
  source?: string;
  format?: string;
  timezone?: string;
  fieldName?: string;
  transforms?: any[];
  fallback?: string;
  randomType?: any[];
  randomLength?: any[];
  script?: string;
}

export interface IActionStepsItem {
  subject?: string;
  type?: ActionStepsTypeEnum4;
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

export interface IInlineActionsItem {
  name?: string;
  steps?: IStepsItem[];
  placement?: InlineActionsPlacementEnum4;
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
  type?: StepsTypeEnum3;
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

export interface IClientRulesItem {
  event?: ClientRulesEventEnum4;
  action?: string;
}

export interface ITexteditoptionItem {
  maxCharacters?: any[];
  maxLength?: any[];
  maxWords?: any[];
  minCharacters?: any[];
  minLength?: any[];
  minWords?: any[];
  patternMessage?: string;
  pattern?: any[];
  isProgress?: any[];
  suggest_method?: TexteditoptionSuggestMethodEnum4;
  suggest_value?: string;
  maxCol?: any[];
  maxRow?: any[];
  isModifyCode?: any[];
  modifyCodeTemplate?: string;
  height?: any[];
  btnUploadLabel?: string;
  uploadTemplate?: TexteditoptionUploadTemplateEnum4;
  disableScript?: string;
  itemHtml?: string;
}

export interface IFileuploadoptionItem {
  enable_extension?: any[];
  extensions?: any[];
  view_as_media?: any[];
  preview_mode?: FileuploadoptionPreviewModeEnum4;
  folder?: string;
  max_size?: any[];
}

export interface INestededitoptionItem {
  minItem?: any[];
  maxItem?: any[];
  enable_create_btn?: boolean;
  enable_checkable?: boolean;
  enable_clone_btn?: boolean;
  enable_edit_btn?: boolean;
  enable_delete_btn?: boolean;
  enable_quick_edit?: boolean;
  enable_import?: boolean;
  is_api_extractor?: boolean;
  api_extractor?: string;
  enable_export?: boolean;
  enable_delete_all?: boolean;
  default_expand?: boolean;
  pageSize?: number;
  isPagination?: boolean;
  enable_search?: boolean;
  enable_index?: boolean;
  filterableIds?: any[];
  searchableIds?: any[];
  sectionFieldId?: string;
  itemFieldId?: string;
  sortedBys?: any[];
  gridColumns?: number;
  allowReorder?: any[];
  debounceMs?: any[];
}

export interface IRuntimeoptionItem {
  resolverType?: RuntimeoptionResolverTypeEnum4;
  dependencies?: IDependenciesItem[];
  script?: string;
  cacheDuration?: any[];
  timeoutSeconds?: any[];
}

export interface IDependenciesItem {
  Chars?: any;
  Length?: number;
}

export interface IReferenceoptionItem {
  minItem?: any[];
  maxItem?: any[];
  nativeSearch?: boolean;
  searchFilter?: ISearchfilterItem[];
  orgSearch?: boolean;
  orgField?: string;
  orgResolver?: ReferenceoptionOrgResolverEnum4;
  includeLinkedAccount?: any[];
  cacheDuration?: number;
  showSchemaSelector?: boolean;
}

export interface ISearchfilterItem {
  op?: SearchfilterOpEnum3;
  refcollection?: string;
  refalias?: string;
  children?: IChildrenItem[];
  id?: string;
  value?: any;
  propType?: string;
  namespace?: string;
  operation?: string;
  customQuery?: string;
  rawFilter?: boolean;
}

export interface IChildrenItem {
  op?: ChildrenOpEnum2;
  refcollection?: string;
  refalias?: string;
  children?: IChildrenItem[];
  id?: string;
  value?: any;
  propType?: string;
  namespace?: string;
  operation?: string;
  customQuery?: string;
  rawFilter?: boolean;
}

export interface IChildrenItem {
  op?: ChildrenOpEnum3;
  refcollection?: string;
  refalias?: string;
  children?: any;
  id?: string;
  value?: any;
  propType?: string;
  namespace?: string;
  operation?: string;
  customQuery?: string;
  rawFilter?: boolean;
}

export interface IObjectoptionItem {
  view_mode?: ObjectoptionViewModeEnum4;
  view_visible_fields?: any[];
  view_template?: string;
}

export interface ILookupsoptionItem {
  target_field?: string;
  target_type?: LookupsoptionTargetTypeEnum4;
  target_schemas?: ITargetSchemasItem[];
  aggregation?: LookupsoptionAggregationEnum4;
  conditions?: IConditionsItem[];
  logic?: LookupsoptionLogicEnum4;
}

export interface ITargetSchemasItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IConditionsItem {
  source?: string;
  target?: string;
  operator?: string;
  isexact?: boolean;
  values?: any[];
  type?: ConditionsTypeEnum3;
}

export interface IComponentoptionItem {
  panelId?: string;
  panelType?: ComponentoptionPanelTypeEnum4;
  inputData?: string;
}

export interface IAutogenerateoptionItem {
  enabled?: any[];
  parts?: IPartsItem[];
  separator?: string;
  allowOverride?: any[];
  showPreview?: any[];
  ensureUnique?: any[];
  duplicateStrategy?: any[];
  maxRetries?: any[];
  regenerateOnEdit?: any[];
  generateWhen?: string;
  sequenceScope?: string;
}

export interface IPartsItem {
  type?: PartsTypeEnum3;
  value?: string;
  length?: any[];
  resetCycle?: any[];
  startFrom?: any[];
  step?: any[];
  source?: string;
  format?: string;
  timezone?: string;
  fieldName?: string;
  transforms?: any[];
  fallback?: string;
  randomType?: any[];
  randomLength?: any[];
  script?: string;
}

export interface IViewsettingItem {
  defaultHidden?: any[];
  colTabWidth?: string;
  aggregation?: any[];
  aggregation_script?: string;
  is_html?: any[];
  displayHtml?: string;
  format?: string;
  formula?: string;
  item_no_label?: any[];
  display_style?: any[];
  enableViewTooltip?: any[];
  tooltipHtml?: string;
  view_style?: string;
  viewHeight?: any[];
  colTabFixed?: string;
  align?: any[];
  view_lbl_by_suggest?: any[];
  is_advance_table_filter?: any[];
}

export interface ICreateSystemFieldInput {
  code?: string;
  label?: string;
  required?: any[];
  format?: string;
  view_style?: string;
  groupId?: string;
  refSchemas?: any[];
  propType?: SystemFieldPropTypeEnum2;
  value_options?: IValueOptionsItem[];
  nested?: INestedItem[];
  cloneCount?: number;
  isDeleted?: boolean;
  tags?: any[];
  description?: string;
  faIcon?: string;
  hints?: string;
  inSensitive?: any[];
  placeholder?: string;
  action_style?: any[];
  viewHeight?: any[];
  action_steps?: IActionStepsItem[];
  useDefaultScript?: any[];
  defaultJsScript?: string;
  defaultValue?: any;
  minValue?: any;
  maxValue?: any;
  align?: SystemFieldAlignEnum2;
  step?: any[];
  editor?: SystemFieldEditorEnum2;
  aggregation?: SystemFieldAggregationEnum2;
  aggregation_script?: string;
  inline_actions?: IInlineActionsItem[];
  formWidth?: SystemFieldFormWidthEnum2;
  formHeight?: any[];
  colTabWidth?: string;
  colTabFixed?: string;
  client_rules?: IClientRulesItem[];
  textEditOption?: ITexteditoptionItem[];
  fileUploadOption?: IFileuploadoptionItem[];
  nestedEditOption?: INestededitoptionItem[];
  runtimeOption?: IRuntimeoptionItem[];
  referenceOption?: IReferenceoptionItem[];
  objectOption?: IObjectoptionItem[];
  lookupsOption?: ILookupsoptionItem[];
  componentOption?: IComponentoptionItem[];
  autoGenerateOption?: IAutogenerateoptionItem[];
  viewSetting?: IViewsettingItem[];
}

export type ISystemFieldListResponse = ApiListResponse<ISystemField>

// Union types generated from value_options
export type SystemFieldPropTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type SystemFieldAlignEnum = 'MIDDLE' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
export type SystemFieldEditorEnum = 'Kiểu input thông thường của html' | 'Dùng để hiển thị và edit các dữ liệu kiểu Nested dạng bảng' | 'Dùng để hiển thị và edit các dữ liệu dang danh sách như: Nested,Tags,Reference' | 'Không hiển thị trên form nhưng vẫn đẩy dữ liệu mặc định lên' | 'Hiển thị nhưng ko cho thay đổi' | 'Dạng HtmlEditor vd: Draftjs,' | 'Lọc bỏ dấu cách , không dấu' | 'TextArea để gõ được nhiều hơn' | 'Kiểu rating, dùng trong number' | 'Kiểu trượt chọn giá trị number' | 'Kiểu chọn nhiều dạng Chip' | 'Checkbox: kiểu boolean' | 'Toggle kiểu boolean' | 'Kiểu chọn thời gian = dialog' | 'Kiểu chọn thời gian = nhập' | 'Sử dụng cho dạng Nested hiện dạng tab-tree' | 'Sử dụng cho kiểu Reference dạng tree view checkable' | 'Chọn ngày = dialog' | 'DateTimePicker' | 'Chọn tháng' | 'QuarterPicker' | 'Chọn năm' | 'Chọn ngày tự nhập' | 'Chọn khoảng ngày' | 'Chọn khoảng ngày' | 'Chọn khoảng tháng' | 'Chọn nhiều tháng calendar' | 'Chọn khoảng năm' | 'Chọn khoảng năm' | 'Markdown' | 'Menu đổ xuống chọn 1' | 'Gõ text để hiện suggestion dropdownlist chọn' | 'Radio' | 'Chọn màu' | 'CodeEditor' | 'EmbedCode' | 'Chọn file ảnh' | 'Upload file (cho phép up nhiều)' | 'Chọn vị trí geo trên bản đồ' | 'Hiển thị kiểu tiền áp dụng cho loại số' | 'Kiêu MenuItem' | 'ActionMenu' | 'Mật khẩu' | 'Định dạng Email' | 'Filter';
export type SystemFieldAggregationEnum = 'NONE' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'CUSTOM';
export type SystemFieldFormWidthEnum = 'width 1/2' | 'full width' | 'width 1/3' | 'width 1/4' | 'width 2/3' | 'width 3/4';
export type NestedPropTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type NestedAlignEnum = 'MIDDLE' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
export type NestedEditorEnum = 'Kiểu input thông thường của html' | 'Dùng để hiển thị và edit các dữ liệu kiểu Nested dạng bảng' | 'Dùng để hiển thị và edit các dữ liệu dang danh sách như: Nested,Tags,Reference' | 'Không hiển thị trên form nhưng vẫn đẩy dữ liệu mặc định lên' | 'Hiển thị nhưng ko cho thay đổi' | 'Dạng HtmlEditor vd: Draftjs,' | 'Lọc bỏ dấu cách , không dấu' | 'TextArea để gõ được nhiều hơn' | 'Kiểu rating, dùng trong number' | 'Kiểu trượt chọn giá trị number' | 'Kiểu chọn nhiều dạng Chip' | 'Checkbox: kiểu boolean' | 'Toggle kiểu boolean' | 'Kiểu chọn thời gian = dialog' | 'Kiểu chọn thời gian = nhập' | 'Sử dụng cho dạng Nested hiện dạng tab-tree' | 'Sử dụng cho kiểu Reference dạng tree view checkable' | 'Chọn ngày = dialog' | 'DateTimePicker' | 'Chọn tháng' | 'QuarterPicker' | 'Chọn năm' | 'Chọn ngày tự nhập' | 'Chọn khoảng ngày' | 'Chọn khoảng ngày' | 'Chọn khoảng tháng' | 'Chọn nhiều tháng calendar' | 'Chọn khoảng năm' | 'Chọn khoảng năm' | 'Markdown' | 'Menu đổ xuống chọn 1' | 'Gõ text để hiện suggestion dropdownlist chọn' | 'Radio' | 'Chọn màu' | 'CodeEditor' | 'EmbedCode' | 'Chọn file ảnh' | 'Upload file (cho phép up nhiều)' | 'Chọn vị trí geo trên bản đồ' | 'Hiển thị kiểu tiền áp dụng cho loại số' | 'Kiêu MenuItem' | 'ActionMenu' | 'Mật khẩu' | 'Định dạng Email' | 'Filter';
export type NestedAggregationEnum = 'NONE' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'CUSTOM';
export type NestedFormWidthEnum = 'width 1/2' | 'full width' | 'width 1/3' | 'width 1/4' | 'width 2/3' | 'width 3/4';
export type NestedPropTypeEnum2 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type NestedAlignEnum2 = 'MIDDLE' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
export type NestedEditorEnum2 = 'Kiểu input thông thường của html' | 'Dùng để hiển thị và edit các dữ liệu kiểu Nested dạng bảng' | 'Dùng để hiển thị và edit các dữ liệu dang danh sách như: Nested,Tags,Reference' | 'Không hiển thị trên form nhưng vẫn đẩy dữ liệu mặc định lên' | 'Hiển thị nhưng ko cho thay đổi' | 'Dạng HtmlEditor vd: Draftjs,' | 'Lọc bỏ dấu cách , không dấu' | 'TextArea để gõ được nhiều hơn' | 'Kiểu rating, dùng trong number' | 'Kiểu trượt chọn giá trị number' | 'Kiểu chọn nhiều dạng Chip' | 'Checkbox: kiểu boolean' | 'Toggle kiểu boolean' | 'Kiểu chọn thời gian = dialog' | 'Kiểu chọn thời gian = nhập' | 'Sử dụng cho dạng Nested hiện dạng tab-tree' | 'Sử dụng cho kiểu Reference dạng tree view checkable' | 'Chọn ngày = dialog' | 'DateTimePicker' | 'Chọn tháng' | 'QuarterPicker' | 'Chọn năm' | 'Chọn ngày tự nhập' | 'Chọn khoảng ngày' | 'Chọn khoảng ngày' | 'Chọn khoảng tháng' | 'Chọn nhiều tháng calendar' | 'Chọn khoảng năm' | 'Chọn khoảng năm' | 'Markdown' | 'Menu đổ xuống chọn 1' | 'Gõ text để hiện suggestion dropdownlist chọn' | 'Radio' | 'Chọn màu' | 'CodeEditor' | 'EmbedCode' | 'Chọn file ảnh' | 'Upload file (cho phép up nhiều)' | 'Chọn vị trí geo trên bản đồ' | 'Hiển thị kiểu tiền áp dụng cho loại số' | 'Kiêu MenuItem' | 'ActionMenu' | 'Mật khẩu' | 'Định dạng Email' | 'Filter';
export type NestedAggregationEnum2 = 'NONE' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'CUSTOM';
export type NestedFormWidthEnum2 = 'width 1/2' | 'full width' | 'width 1/3' | 'width 1/4' | 'width 2/3' | 'width 3/4';
export type NestedPropTypeEnum3 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type NestedAlignEnum3 = 'MIDDLE' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
export type NestedEditorEnum3 = 'Kiểu input thông thường của html' | 'Dùng để hiển thị và edit các dữ liệu kiểu Nested dạng bảng' | 'Dùng để hiển thị và edit các dữ liệu dang danh sách như: Nested,Tags,Reference' | 'Không hiển thị trên form nhưng vẫn đẩy dữ liệu mặc định lên' | 'Hiển thị nhưng ko cho thay đổi' | 'Dạng HtmlEditor vd: Draftjs,' | 'Lọc bỏ dấu cách , không dấu' | 'TextArea để gõ được nhiều hơn' | 'Kiểu rating, dùng trong number' | 'Kiểu trượt chọn giá trị number' | 'Kiểu chọn nhiều dạng Chip' | 'Checkbox: kiểu boolean' | 'Toggle kiểu boolean' | 'Kiểu chọn thời gian = dialog' | 'Kiểu chọn thời gian = nhập' | 'Sử dụng cho dạng Nested hiện dạng tab-tree' | 'Sử dụng cho kiểu Reference dạng tree view checkable' | 'Chọn ngày = dialog' | 'DateTimePicker' | 'Chọn tháng' | 'QuarterPicker' | 'Chọn năm' | 'Chọn ngày tự nhập' | 'Chọn khoảng ngày' | 'Chọn khoảng ngày' | 'Chọn khoảng tháng' | 'Chọn nhiều tháng calendar' | 'Chọn khoảng năm' | 'Chọn khoảng năm' | 'Markdown' | 'Menu đổ xuống chọn 1' | 'Gõ text để hiện suggestion dropdownlist chọn' | 'Radio' | 'Chọn màu' | 'CodeEditor' | 'EmbedCode' | 'Chọn file ảnh' | 'Upload file (cho phép up nhiều)' | 'Chọn vị trí geo trên bản đồ' | 'Hiển thị kiểu tiền áp dụng cho loại số' | 'Kiêu MenuItem' | 'ActionMenu' | 'Mật khẩu' | 'Định dạng Email' | 'Filter';
export type NestedAggregationEnum3 = 'NONE' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'CUSTOM';
export type NestedFormWidthEnum3 = 'width 1/2' | 'full width' | 'width 1/3' | 'width 1/4' | 'width 2/3' | 'width 3/4';
export type NestedPropTypeEnum4 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type NestedAlignEnum4 = 'MIDDLE' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
export type NestedEditorEnum4 = 'Kiểu input thông thường của html' | 'Dùng để hiển thị và edit các dữ liệu kiểu Nested dạng bảng' | 'Dùng để hiển thị và edit các dữ liệu dang danh sách như: Nested,Tags,Reference' | 'Không hiển thị trên form nhưng vẫn đẩy dữ liệu mặc định lên' | 'Hiển thị nhưng ko cho thay đổi' | 'Dạng HtmlEditor vd: Draftjs,' | 'Lọc bỏ dấu cách , không dấu' | 'TextArea để gõ được nhiều hơn' | 'Kiểu rating, dùng trong number' | 'Kiểu trượt chọn giá trị number' | 'Kiểu chọn nhiều dạng Chip' | 'Checkbox: kiểu boolean' | 'Toggle kiểu boolean' | 'Kiểu chọn thời gian = dialog' | 'Kiểu chọn thời gian = nhập' | 'Sử dụng cho dạng Nested hiện dạng tab-tree' | 'Sử dụng cho kiểu Reference dạng tree view checkable' | 'Chọn ngày = dialog' | 'DateTimePicker' | 'Chọn tháng' | 'QuarterPicker' | 'Chọn năm' | 'Chọn ngày tự nhập' | 'Chọn khoảng ngày' | 'Chọn khoảng ngày' | 'Chọn khoảng tháng' | 'Chọn nhiều tháng calendar' | 'Chọn khoảng năm' | 'Chọn khoảng năm' | 'Markdown' | 'Menu đổ xuống chọn 1' | 'Gõ text để hiện suggestion dropdownlist chọn' | 'Radio' | 'Chọn màu' | 'CodeEditor' | 'EmbedCode' | 'Chọn file ảnh' | 'Upload file (cho phép up nhiều)' | 'Chọn vị trí geo trên bản đồ' | 'Hiển thị kiểu tiền áp dụng cho loại số' | 'Kiêu MenuItem' | 'ActionMenu' | 'Mật khẩu' | 'Định dạng Email' | 'Filter';
export type NestedAggregationEnum4 = 'NONE' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'CUSTOM';
export type NestedFormWidthEnum4 = 'width 1/2' | 'full width' | 'width 1/3' | 'width 1/4' | 'width 2/3' | 'width 3/4';
export type ActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InlineActionsPlacementEnum = 'TOP' | 'BOTTOM' | 'EXTRA';
export type ClientRulesEventEnum = 'onChange' | 'onLoad' | 'displayOption' | 'disableOption' | 'requireOption' | 'onBlur' | 'nestedViewDisplayOption' | 'mapDays' | 'disableItemOption';
export type TexteditoptionSuggestMethodEnum = 'NONE' | 'SCRIPT' | 'ARRAY' | 'RESTAPI' | 'GRAPHQL';
export type TexteditoptionUploadTemplateEnum = 'default' | 'template1' | 'template2' | 'template3';
export type FileuploadoptionPreviewModeEnum = 'LIST' | 'CAROUSEL' | 'GALLERY';
export type RuntimeoptionResolverTypeEnum = 'None' | 'OnDemand' | 'Preload';
export type ReferenceoptionOrgResolverEnum = 'account' | 'role' | 'department' | 'employee' | 'all' | 'usergroup' | 'custom' | 'datasourceFilter';
export type ObjectoptionViewModeEnum = 'compact' | 'template' | 'chip' | 'jsonview' | 'avatar' | 'form';
export type LookupsoptionTargetTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type LookupsoptionAggregationEnum = 'value' | 'sum' | 'min' | 'max' | 'uniquevalue' | 'count' | 'avg';
export type LookupsoptionLogicEnum = 'AND' | 'OR' | 'EXISTS';
export type ComponentoptionPanelTypeEnum = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type ActionStepsTypeEnum2 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InlineActionsPlacementEnum2 = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type ClientRulesEventEnum2 = 'onChange' | 'onLoad' | 'displayOption' | 'disableOption' | 'requireOption' | 'onBlur' | 'nestedViewDisplayOption' | 'mapDays' | 'disableItemOption';
export type TexteditoptionSuggestMethodEnum2 = 'NONE' | 'SCRIPT' | 'ARRAY' | 'RESTAPI' | 'GRAPHQL';
export type TexteditoptionUploadTemplateEnum2 = 'default' | 'template1' | 'template2' | 'template3';
export type FileuploadoptionPreviewModeEnum2 = 'LIST' | 'CAROUSEL' | 'GALLERY';
export type RuntimeoptionResolverTypeEnum2 = 'None' | 'OnDemand' | 'Preload';
export type ReferenceoptionOrgResolverEnum2 = 'account' | 'role' | 'department' | 'employee' | 'all' | 'usergroup' | 'custom' | 'datasourceFilter';
export type SearchfilterOpEnum = 'AND' | 'OR' | 'EXISTS';
export type ObjectoptionViewModeEnum2 = 'compact' | 'template' | 'chip' | 'jsonview' | 'avatar' | 'form';
export type LookupsoptionTargetTypeEnum2 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type LookupsoptionAggregationEnum2 = 'value' | 'sum' | 'min' | 'max' | 'uniquevalue' | 'count' | 'avg';
export type LookupsoptionLogicEnum2 = 'AND' | 'OR' | 'EXISTS';
export type ConditionsTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type ComponentoptionPanelTypeEnum2 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type PartsTypeEnum = 'static' | 'sequence' | 'date' | 'field' | 'random' | 'script';
export type ActionStepsTypeEnum3 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InlineActionsPlacementEnum3 = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum2 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type ClientRulesEventEnum3 = 'onChange' | 'onLoad' | 'displayOption' | 'disableOption' | 'requireOption' | 'onBlur' | 'nestedViewDisplayOption' | 'mapDays' | 'disableItemOption';
export type TexteditoptionSuggestMethodEnum3 = 'NONE' | 'SCRIPT' | 'ARRAY' | 'RESTAPI' | 'GRAPHQL';
export type TexteditoptionUploadTemplateEnum3 = 'default' | 'template1' | 'template2' | 'template3';
export type FileuploadoptionPreviewModeEnum3 = 'LIST' | 'CAROUSEL' | 'GALLERY';
export type RuntimeoptionResolverTypeEnum3 = 'None' | 'OnDemand' | 'Preload';
export type ReferenceoptionOrgResolverEnum3 = 'account' | 'role' | 'department' | 'employee' | 'all' | 'usergroup' | 'custom' | 'datasourceFilter';
export type SearchfilterOpEnum2 = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum = 'AND' | 'OR' | 'EXISTS';
export type ObjectoptionViewModeEnum3 = 'compact' | 'template' | 'chip' | 'jsonview' | 'avatar' | 'form';
export type LookupsoptionTargetTypeEnum3 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type LookupsoptionAggregationEnum3 = 'value' | 'sum' | 'min' | 'max' | 'uniquevalue' | 'count' | 'avg';
export type LookupsoptionLogicEnum3 = 'AND' | 'OR' | 'EXISTS';
export type ConditionsTypeEnum2 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type ComponentoptionPanelTypeEnum3 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type PartsTypeEnum2 = 'static' | 'sequence' | 'date' | 'field' | 'random' | 'script';
export type ActionStepsTypeEnum4 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InlineActionsPlacementEnum4 = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum3 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type ClientRulesEventEnum4 = 'onChange' | 'onLoad' | 'displayOption' | 'disableOption' | 'requireOption' | 'onBlur' | 'nestedViewDisplayOption' | 'mapDays' | 'disableItemOption';
export type TexteditoptionSuggestMethodEnum4 = 'NONE' | 'SCRIPT' | 'ARRAY' | 'RESTAPI' | 'GRAPHQL';
export type TexteditoptionUploadTemplateEnum4 = 'default' | 'template1' | 'template2' | 'template3';
export type FileuploadoptionPreviewModeEnum4 = 'LIST' | 'CAROUSEL' | 'GALLERY';
export type RuntimeoptionResolverTypeEnum4 = 'None' | 'OnDemand' | 'Preload';
export type ReferenceoptionOrgResolverEnum4 = 'account' | 'role' | 'department' | 'employee' | 'all' | 'usergroup' | 'custom' | 'datasourceFilter';
export type SearchfilterOpEnum3 = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum2 = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum3 = 'AND' | 'OR' | 'EXISTS';
export type ObjectoptionViewModeEnum4 = 'compact' | 'template' | 'chip' | 'jsonview' | 'avatar' | 'form';
export type LookupsoptionTargetTypeEnum4 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type LookupsoptionAggregationEnum4 = 'value' | 'sum' | 'min' | 'max' | 'uniquevalue' | 'count' | 'avg';
export type LookupsoptionLogicEnum4 = 'AND' | 'OR' | 'EXISTS';
export type ConditionsTypeEnum3 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type ComponentoptionPanelTypeEnum4 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type PartsTypeEnum3 = 'static' | 'sequence' | 'date' | 'field' | 'random' | 'script';
export type SystemFieldPropTypeEnum2 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type SystemFieldAlignEnum2 = 'MIDDLE' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
export type SystemFieldEditorEnum2 = 'Kiểu input thông thường của html' | 'Dùng để hiển thị và edit các dữ liệu kiểu Nested dạng bảng' | 'Dùng để hiển thị và edit các dữ liệu dang danh sách như: Nested,Tags,Reference' | 'Không hiển thị trên form nhưng vẫn đẩy dữ liệu mặc định lên' | 'Hiển thị nhưng ko cho thay đổi' | 'Dạng HtmlEditor vd: Draftjs,' | 'Lọc bỏ dấu cách , không dấu' | 'TextArea để gõ được nhiều hơn' | 'Kiểu rating, dùng trong number' | 'Kiểu trượt chọn giá trị number' | 'Kiểu chọn nhiều dạng Chip' | 'Checkbox: kiểu boolean' | 'Toggle kiểu boolean' | 'Kiểu chọn thời gian = dialog' | 'Kiểu chọn thời gian = nhập' | 'Sử dụng cho dạng Nested hiện dạng tab-tree' | 'Sử dụng cho kiểu Reference dạng tree view checkable' | 'Chọn ngày = dialog' | 'DateTimePicker' | 'Chọn tháng' | 'QuarterPicker' | 'Chọn năm' | 'Chọn ngày tự nhập' | 'Chọn khoảng ngày' | 'Chọn khoảng ngày' | 'Chọn khoảng tháng' | 'Chọn nhiều tháng calendar' | 'Chọn khoảng năm' | 'Chọn khoảng năm' | 'Markdown' | 'Menu đổ xuống chọn 1' | 'Gõ text để hiện suggestion dropdownlist chọn' | 'Radio' | 'Chọn màu' | 'CodeEditor' | 'EmbedCode' | 'Chọn file ảnh' | 'Upload file (cho phép up nhiều)' | 'Chọn vị trí geo trên bản đồ' | 'Hiển thị kiểu tiền áp dụng cho loại số' | 'Kiêu MenuItem' | 'ActionMenu' | 'Mật khẩu' | 'Định dạng Email' | 'Filter';
export type SystemFieldAggregationEnum2 = 'NONE' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'CUSTOM';
export type SystemFieldFormWidthEnum2 = 'width 1/2' | 'full width' | 'width 1/3' | 'width 1/4' | 'width 2/3' | 'width 3/4';
