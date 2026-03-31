import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ReportPanel interface
 * Auto-generated from Schema: ReportPanel
 */
export interface IReportPanel {
  _id: string;
  panelType?: ReportPanelPanelTypeEnum;
  dsType?: ReportPanelDsTypeEnum;
  dsId?: string;
  isLocked?: boolean;
  target_schema?: string;
  displayTitle?: boolean;
  displayDesc?: boolean;
  title?: string;
  chartHeight?: number;
  graph?: IGraphItem[];
  basePipeline?: string;
  dimensions?: IDimensionsItem[];
  measures?: IMeasuresItem[];
  fix_filter?: IFixFilterItem[];
  skip?: number;
  limit?: number;
  preLimit?: number;
  sorted?: ISortedItem[];
  preSorted?: IPresortedItem[];
  design?: IDesignItem[];
  setting?: ISettingItem[];
  autoGeneratePipeline?: boolean;
  filter_setting?: IFilterSettingItem[];
  chartType?: ReportPanelChartTypeEnum;
  timeDimensionSetting?: ITimedimensionsettingItem[];
  outputTypes?: IOutputtypesItem[];
  drilldown?: IDrilldownItem[];
  kpis?: IKpisItem[];
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
  name?: string;
}

export interface IGraphItem {
  items?: IItemsItem[];
  connectors?: IConnectorsItem[];
  name?: string;
  id?: string;
}

export interface IItemsItem {
  nodeId?: string;
  schemaId?: string;
  label?: string;
  name?: string;
  collection?: string;
  color?: string;
  x?: number;
  y?: number;
  unwind?: boolean;
  enableExtra?: string;
  extraPipeline?: string;
}

export interface IConnectorsItem {
  sourceId?: string;
  sourceField?: string;
  label?: string;
  function?: ConnectorsFunctionEnum;
  withParent?: boolean;
  connectToField?: string;
  targetId?: string;
  targetField?: string;
  key?: string;
  active?: boolean;
}

export interface IDimensionsItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IMeasuresItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IFixFilterItem {
  createdBy?: string;
  updatedBy?: string;
  lang?: string;
  version?: IVersionItem[];
  target_schema?: string;
  segment_schema?: boolean;
  output_schema?: string;
  collection?: string;
  postQuery?: string;
  preQuery?: string;
  withMergeValidation?: boolean;
  mergeValidationScript?: string;
  showMergeError?: boolean;
  mergeErrorMessage?: string;
  postQueryBeforePaging?: boolean;
  group?: IGroupItem[];
  posgroup?: IPosgroupItem[];
  description?: string;
  sorted?: ISortedItem[];
  pos_sorted?: IPosSortedItem[];
  text?: string;
  skipDefaultTextSearch?: boolean;
  search_fields?: ISearchFieldsItem[];
  skip?: number;
  limit?: number;
  page?: number;
  withRecords?: boolean;
  fields?: string;
  inline?: boolean;
  inline_array?: boolean;
  delimiter?: string;
  unionWiths?: IUnionwithsItem[];
  unionLimit?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  name?: string;
  id?: string;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface IGroupItem {
  op?: GroupOpEnum;
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
  children?: any;
  id?: string;
  value?: any;
  propType?: string;
  namespace?: string;
  operation?: string;
  customQuery?: string;
  rawFilter?: boolean;
}

export interface IPosgroupItem {
  op?: PosgroupOpEnum;
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
  op?: ChildrenOpEnum4;
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

export interface ISortedItem {
  id?: string;
  desc?: boolean;
}

export interface IPosSortedItem {
  id?: string;
  desc?: boolean;
}

export interface ISearchFieldsItem {
  Chars?: any;
  Length?: number;
}

export interface IUnionwithsItem {
  createdBy?: string;
  updatedBy?: string;
  lang?: string;
  version?: IVersionItem[];
  target_schema?: string;
  segment_schema?: boolean;
  output_schema?: string;
  collection?: string;
  postQuery?: string;
  preQuery?: string;
  withMergeValidation?: boolean;
  mergeValidationScript?: string;
  showMergeError?: boolean;
  mergeErrorMessage?: string;
  postQueryBeforePaging?: boolean;
  group?: IGroupItem[];
  posgroup?: IPosgroupItem[];
  description?: string;
  sorted?: ISortedItem[];
  pos_sorted?: IPosSortedItem[];
  text?: string;
  skipDefaultTextSearch?: boolean;
  search_fields?: ISearchFieldsItem[];
  skip?: number;
  limit?: number;
  page?: number;
  withRecords?: boolean;
  fields?: string;
  inline?: boolean;
  inline_array?: boolean;
  delimiter?: string;
  unionWiths?: IUnionwithsItem[];
  unionLimit?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  name?: string;
  id?: string;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface IGroupItem {
  op?: GroupOpEnum2;
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
  op?: ChildrenOpEnum5;
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

export interface IPosgroupItem {
  op?: PosgroupOpEnum2;
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
  op?: ChildrenOpEnum6;
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

export interface ISortedItem {
  id?: string;
  desc?: boolean;
}

export interface IPosSortedItem {
  id?: string;
  desc?: boolean;
}

export interface ISearchFieldsItem {
  Chars?: any;
  Length?: number;
}

export interface IUnionwithsItem {
  createdBy?: string;
  updatedBy?: string;
  lang?: string;
  version?: IVersionItem[];
  target_schema?: string;
  segment_schema?: boolean;
  output_schema?: string;
  collection?: string;
  postQuery?: string;
  preQuery?: string;
  withMergeValidation?: boolean;
  mergeValidationScript?: string;
  showMergeError?: boolean;
  mergeErrorMessage?: string;
  postQueryBeforePaging?: boolean;
  group?: IGroupItem[];
  posgroup?: IPosgroupItem[];
  description?: string;
  sorted?: ISortedItem[];
  pos_sorted?: IPosSortedItem[];
  text?: string;
  skipDefaultTextSearch?: boolean;
  search_fields?: ISearchFieldsItem[];
  skip?: number;
  limit?: number;
  page?: number;
  withRecords?: boolean;
  fields?: string;
  inline?: boolean;
  inline_array?: boolean;
  delimiter?: string;
  unionWiths?: IUnionwithsItem[];
  unionLimit?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  name?: string;
  id?: string;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface IGroupItem {
  op?: GroupOpEnum3;
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

export interface IPosgroupItem {
  op?: PosgroupOpEnum3;
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

export interface ISortedItem {
  id?: string;
  desc?: boolean;
}

export interface IPosSortedItem {
  id?: string;
  desc?: boolean;
}

export interface ISearchFieldsItem {
  Chars?: any;
  Length?: number;
}

export interface IUnionwithsItem {
  createdBy?: string;
  updatedBy?: string;
  lang?: string;
  version?: any;
  target_schema?: string;
  segment_schema?: boolean;
  output_schema?: string;
  collection?: string;
  postQuery?: string;
  preQuery?: string;
  withMergeValidation?: boolean;
  mergeValidationScript?: string;
  showMergeError?: boolean;
  mergeErrorMessage?: string;
  postQueryBeforePaging?: boolean;
  group?: any;
  posgroup?: any;
  description?: string;
  sorted?: any;
  pos_sorted?: any;
  text?: string;
  skipDefaultTextSearch?: boolean;
  search_fields?: any;
  skip?: number;
  limit?: number;
  page?: number;
  withRecords?: boolean;
  fields?: string;
  inline?: boolean;
  inline_array?: boolean;
  delimiter?: string;
  unionWiths?: any;
  unionLimit?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  name?: string;
  id?: string;
}

export interface ISortedItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IPresortedItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IDesignItem {
  paletteName?: string;
  defaultStrokeColors?: IDefaultstrokecolorsItem[];
  defaultFillColors?: IDefaultfillcolorsItem[];
  fillOpacity?: any[];
  showLegend?: any[];
  showGrid?: any[];
  stacked?: any[];
  showDataLabels?: any[];
  dataLabelFormat?: string;
  numberFormat?: string;
  dateFormat?: string;
  xAxis?: IXaxisItem[];
  yAxis?: IYaxisItem[];
  seriesStrokeColorByKey?: ISeriesstrokecolorbykeyItem[];
  seriesFillColorByKey?: ISeriesfillcolorbykeyItem[];
  defaultGradient?: IDefaultgradientItem[];
  chartTypeGradients?: ICharttypegradientsItem[];
  gradientByKey?: IGradientbykeyItem[];
}

export interface IDefaultstrokecolorsItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IDefaultfillcolorsItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IXaxisItem {
  showAxis?: any[];
  showGrid?: any[];
  labelFormat?: string;
  title?: string;
}

export interface IYaxisItem {
  showAxis?: any[];
  showGrid?: any[];
  labelFormat?: string;
  title?: string;
}

export interface ISeriesstrokecolorbykeyItem {
  Chars?: any;
  Length?: number;
}

export interface ISeriesfillcolorbykeyItem {
  Chars?: any;
  Length?: number;
}

export interface IDefaultgradientItem {
  from?: string;
  to?: string;
  direction?: string;
  stops?: IStopsItem[];
  opacity?: any[];
}

export interface IStopsItem {
  color?: string;
  percent?: number;
}

export interface ICharttypegradientsItem {
  from?: string;
  to?: string;
  direction?: string;
  stops?: IStopsItem[];
  opacity?: any[];
}

export interface IStopsItem {
  color?: string;
  percent?: number;
}

export interface IGradientbykeyItem {
  from?: string;
  to?: string;
  direction?: string;
  stops?: IStopsItem[];
  opacity?: any[];
}

export interface IStopsItem {
  color?: string;
  percent?: number;
}

export interface ISettingItem {
  wdr?: any;
  fields?: IFieldsItem[];
  fillMissingDates?: boolean;
  joinDateRange?: boolean;
}

export interface IFieldsItem {
  key?: string;
  type?: FieldsTypeEnum;
  propType?: FieldsPropTypeEnum;
  isX?: boolean;
  format?: string;
  suffix?: string;
  prefix?: string;
  title?: string;
  url?: string;
  faIcon?: string;
  splitChart?: boolean;
  chartType?: FieldsChartTypeEnum;
}

export interface IFilterSettingItem {
  items?: IItemsItem[];
  mode?: FilterSettingModeEnum;
  position?: FilterSettingPositionEnum;
}

export interface IItemsItem {
  id?: string;
  label?: string;
  operators?: any[];
  editor?: ItemsEditorEnum;
  propType?: ItemsPropTypeEnum;
  value_options?: IValueOptionsItem[];
  refSchemas?: any[];
  suggestion_script?: string;
  has_suggestion_script?: boolean;
  minValue?: any;
  maxValue?: any;
  step?: number;
  defaultJsScript?: string;
  defaultValue?: any;
  set_default_value?: boolean;
  default_js_value?: string;
  use_as_query_only?: boolean;
  hide?: boolean;
  schema?: string;
  is_custom?: boolean;
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

export interface ITimedimensionsettingItem {
  enable?: boolean;
  field?: string;
  timeBucketUnit?: TimedimensionsettingTimeBucketUnitEnum;
  format?: string;
  isRevert?: boolean;
  timeWindowUnit?: TimedimensionsettingTimeWindowUnitEnum;
  windowOffsetStart?: number;
  windowOffsetEnd?: number;
}

export interface IOutputtypesItem {
  key?: string;
  label?: string;
  type?: OutputtypesTypeEnum;
  schema?: string;
  description?: string;
  nested?: INestedItem[];
}

export interface INestedItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IDrilldownItem {
  enable?: boolean;
  inheritBaseFilters?: boolean;
  inheritTimeDimension?: boolean;
  autoAppendDimensionMatch?: boolean;
  rules?: IRulesItem[];
}

export interface IRulesItem {
  drillId?: string;
  title?: string;
  displayType?: string;
  applyCondition?: string;
  matchField?: string;
  childKeyField?: string;
  groupMode?: string;
  dimensions?: IDimensionsItem[];
  measures?: IMeasuresItem[];
  additionalFilter?: IAdditionalfilterItem[];
  projectionFields?: any[];
  sorted?: ISortedItem[];
  defaultLimit?: number;
  maxLimit?: number;
  supportsCount?: boolean;
  nextDrillId?: string;
  requireValue?: boolean;
  rawMode?: boolean;
  timeWindowOverride?: any[];
}

export interface IDimensionsItem {
  field?: string;
  key?: string;
  choices?: IChoicesItem[];
  isCustom?: boolean;
  expression?: string;
  propType?: DimensionsPropTypeEnum;
  title?: string;
}

export interface IChoicesItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IMeasuresItem {
  type?: MeasuresTypeEnum;
  expression?: string;
  key?: string;
  title?: string;
  groupFilter?: IGroupfilterItem[];
  groupBys?: any[];
}

export interface IGroupfilterItem {
  op?: GroupfilterOpEnum;
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

export interface IAdditionalfilterItem {
  op?: AdditionalfilterOpEnum;
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
  op?: ChildrenOpEnum7;
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

export interface ISortedItem {
  id?: string;
  desc?: boolean;
}

export interface IKpisItem {
  key?: string;
  label?: string;
  description?: string;
  kpiType?: KpisKpiTypeEnum;
  scope?: KpisScopeEnum;
  measure?: string;
  aggregation?: any[];
  formula?: string;
  dependencies?: any[];
  comparison?: IComparisonItem[];
  target?: ITargetItem[];
  window?: IWindowItem[];
  status?: IStatusItem[];
  format?: IFormatItem[];
  pointMode?: IPointmodeItem[];
}

export interface IComparisonItem {
  type?: ComparisonTypeEnum;
  period?: any[];
  offset?: number;
  minPeriods?: number;
  dateField?: string;
  bucket?: any[];
  accumulate?: any[];
}

export interface ITargetItem {
  value?: number;
  comparisonType?: string;
}

export interface IWindowItem {
  method?: WindowMethodEnum;
  size?: number;
  dateField?: string;
  bucket?: any[];
  minPeriods?: any[];
  alpha?: any[];
}

export interface IStatusItem {
  rules?: IRulesItem[];
  defaultState?: string;
}

export interface IRulesItem {
  condition?: string;
  state?: string;
}

export interface IFormatItem {
  style?: FormatStyleEnum;
  precision?: number;
  prefix?: string;
  suffix?: string;
  scale?: FormatScaleEnum;
}

export interface IPointmodeItem {
  dimensionField?: string;
  drill?: boolean;
  returnHistory?: boolean;
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

export interface ICreateReportPanelInput {
  panelType?: ReportPanelPanelTypeEnum2;
  dsType?: ReportPanelDsTypeEnum2;
  dsId?: string;
  isLocked?: boolean;
  target_schema?: string;
  displayTitle?: boolean;
  displayDesc?: boolean;
  title?: string;
  chartHeight?: number;
  graph?: IGraphItem[];
  basePipeline?: string;
  dimensions?: IDimensionsItem[];
  measures?: IMeasuresItem[];
  fix_filter?: IFixFilterItem[];
  skip?: number;
  limit?: number;
  preLimit?: number;
  sorted?: ISortedItem[];
  preSorted?: IPresortedItem[];
  design?: IDesignItem[];
  setting?: ISettingItem[];
  autoGeneratePipeline?: boolean;
  filter_setting?: IFilterSettingItem[];
  chartType?: ReportPanelChartTypeEnum2;
  timeDimensionSetting?: ITimedimensionsettingItem[];
  outputTypes?: IOutputtypesItem[];
  drilldown?: IDrilldownItem[];
  kpis?: IKpisItem[];
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
  name?: string;
}

export type IReportPanelListResponse = ApiListResponse<IReportPanel>

// Union types generated from value_options
export type ReportPanelPanelTypeEnum = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type ReportPanelDsTypeEnum = 'SCHEMA' | 'DATASOURCE' | 'API';
export type ReportPanelChartTypeEnum = 'number' | 'pie' | 'donut' | 'bar' | 'column' | 'line' | 'area' | 'funnel' | 'table' | 'net' | 'pivotTable';
export type ConnectorsFunctionEnum = 'Lookup' | 'GraphLookup';
export type GroupOpEnum = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum2 = 'AND' | 'OR' | 'EXISTS';
export type PosgroupOpEnum = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum3 = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum4 = 'AND' | 'OR' | 'EXISTS';
export type GroupOpEnum2 = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum5 = 'AND' | 'OR' | 'EXISTS';
export type PosgroupOpEnum2 = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum6 = 'AND' | 'OR' | 'EXISTS';
export type GroupOpEnum3 = 'AND' | 'OR' | 'EXISTS';
export type PosgroupOpEnum3 = 'AND' | 'OR' | 'EXISTS';
export type FieldsTypeEnum = 'dimension' | 'measure';
export type FieldsPropTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type FieldsChartTypeEnum = 'number' | 'pie' | 'donut' | 'bar' | 'column' | 'line' | 'area' | 'funnel' | 'table' | 'net' | 'pivotTable';
export type FilterSettingModeEnum = 'Inline' | 'Popup' | 'Advance';
export type FilterSettingPositionEnum = 'Toolbar' | 'Right' | 'Left';
export type ItemsEditorEnum = 'Kiểu input thông thường của html' | 'Dùng để hiển thị và edit các dữ liệu kiểu Nested dạng bảng' | 'Dùng để hiển thị và edit các dữ liệu dang danh sách như: Nested,Tags,Reference' | 'Không hiển thị trên form nhưng vẫn đẩy dữ liệu mặc định lên' | 'Hiển thị nhưng ko cho thay đổi' | 'Dạng HtmlEditor vd: Draftjs,' | 'Lọc bỏ dấu cách , không dấu' | 'TextArea để gõ được nhiều hơn' | 'Kiểu rating, dùng trong number' | 'Kiểu trượt chọn giá trị number' | 'Kiểu chọn nhiều dạng Chip' | 'Checkbox: kiểu boolean' | 'Toggle kiểu boolean' | 'Kiểu chọn thời gian = dialog' | 'Kiểu chọn thời gian = nhập' | 'Sử dụng cho dạng Nested hiện dạng tab-tree' | 'Sử dụng cho kiểu Reference dạng tree view checkable' | 'Chọn ngày = dialog' | 'DateTimePicker' | 'Chọn tháng' | 'QuarterPicker' | 'Chọn năm' | 'Chọn ngày tự nhập' | 'Chọn khoảng ngày' | 'Chọn khoảng ngày' | 'Chọn khoảng tháng' | 'Chọn nhiều tháng calendar' | 'Chọn khoảng năm' | 'Chọn khoảng năm' | 'Markdown' | 'Menu đổ xuống chọn 1' | 'Gõ text để hiện suggestion dropdownlist chọn' | 'Radio' | 'Chọn màu' | 'CodeEditor' | 'EmbedCode' | 'Chọn file ảnh' | 'Upload file (cho phép up nhiều)' | 'Chọn vị trí geo trên bản đồ' | 'Hiển thị kiểu tiền áp dụng cho loại số' | 'Kiêu MenuItem' | 'ActionMenu' | 'Mật khẩu' | 'Định dạng Email' | 'Filter';
export type ItemsPropTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type TimedimensionsettingTimeBucketUnitEnum = 'all' | 'minute' | 'hour' | 'day' | 'week' | 'weekofmonth' | 'dayofweek' | 'month' | 'quarter' | 'year';
export type TimedimensionsettingTimeWindowUnitEnum = 'all' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
export type OutputtypesTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type DimensionsPropTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type MeasuresTypeEnum = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'first' | 'last' | 'top' | 'topn' | 'bottom' | 'bottomn' | 'firstn' | 'accumulator' | 'percentile' | 'custom';
export type GroupfilterOpEnum = 'AND' | 'OR' | 'EXISTS';
export type AdditionalfilterOpEnum = 'AND' | 'OR' | 'EXISTS';
export type ChildrenOpEnum7 = 'AND' | 'OR' | 'EXISTS';
export type KpisKpiTypeEnum = 'aggregation' | 'periodComparison' | 'pointComparison' | 'window' | 'derived' | 'target' | 'status';
export type KpisScopeEnum = 'global' | 'point';
export type ComparisonTypeEnum = 'pct_change' | 'abs_change' | 'yoy' | 'mom' | 'wow' | 'qoq';
export type WindowMethodEnum = 'moving_avg' | 'rolling_sum' | 'rolling_avg' | 'ewma';
export type FormatStyleEnum = 'number' | 'currency' | 'percent' | 'compact';
export type FormatScaleEnum = 'auto' | 'k' | 'M' | 'B';
export type ActionsPlacementEnum = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type BackactionPlacementEnum = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum2 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InitialActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InvActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type DcActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type ReportPanelPanelTypeEnum2 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type ReportPanelDsTypeEnum2 = 'SCHEMA' | 'DATASOURCE' | 'API';
export type ReportPanelChartTypeEnum2 = 'number' | 'pie' | 'donut' | 'bar' | 'column' | 'line' | 'area' | 'funnel' | 'table' | 'net' | 'pivotTable';
