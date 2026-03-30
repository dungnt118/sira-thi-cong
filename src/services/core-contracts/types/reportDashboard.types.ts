import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ReportDashboard interface
 * Auto-generated from Schema: ReportDashboard
 */
export interface IReportDashboard {
  _id: string;
  panelType?: ReportDashboardPanelTypeEnum;
  tags?: any[];
  filter_setting?: IFilterSettingItem[];
  dsId?: string;
  items?: IItemsItem[];
  header?: IHeaderItem[];
  footer?: IFooterItem[];
  itemAlign?: string;
  cols?: number;
  rowHeight?: number;
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

export interface IItemsItem {
  showPanelTitle?: boolean;
  reportId?: string;
  key?: string;
  name?: string;
  className?: string;
  faIcon?: string;
  style?: string;
  data_grid?: IDataGridItem[];
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

export interface IHeaderItem {
  key?: string;
  name?: string;
  className?: string;
  faIcon?: string;
  style?: string;
  data_grid?: IDataGridItem[];
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

export interface IFooterItem {
  key?: string;
  name?: string;
  className?: string;
  faIcon?: string;
  style?: string;
  data_grid?: IDataGridItem[];
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

export interface ICreateReportDashboardInput {
  panelType?: ReportDashboardPanelTypeEnum2;
  tags?: any[];
  filter_setting?: IFilterSettingItem[];
  dsId?: string;
  items?: IItemsItem[];
  header?: IHeaderItem[];
  footer?: IFooterItem[];
  itemAlign?: string;
  cols?: number;
  rowHeight?: number;
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

export type IReportDashboardListResponse = ApiListResponse<IReportDashboard>

// Union types generated from value_options
export type ReportDashboardPanelTypeEnum = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type FilterSettingModeEnum = 'Inline' | 'Popup' | 'Advance';
export type FilterSettingPositionEnum = 'Toolbar' | 'Right' | 'Left';
export type ItemsEditorEnum = 'Kiểu input thông thường của html' | 'Dùng để hiển thị và edit các dữ liệu kiểu Nested dạng bảng' | 'Dùng để hiển thị và edit các dữ liệu dang danh sách như: Nested,Tags,Reference' | 'Không hiển thị trên form nhưng vẫn đẩy dữ liệu mặc định lên' | 'Hiển thị nhưng ko cho thay đổi' | 'Dạng HtmlEditor vd: Draftjs,' | 'Lọc bỏ dấu cách , không dấu' | 'TextArea để gõ được nhiều hơn' | 'Kiểu rating, dùng trong number' | 'Kiểu trượt chọn giá trị number' | 'Kiểu chọn nhiều dạng Chip' | 'Checkbox: kiểu boolean' | 'Toggle kiểu boolean' | 'Kiểu chọn thời gian = dialog' | 'Kiểu chọn thời gian = nhập' | 'Sử dụng cho dạng Nested hiện dạng tab-tree' | 'Sử dụng cho kiểu Reference dạng tree view checkable' | 'Chọn ngày = dialog' | 'DateTimePicker' | 'Chọn tháng' | 'QuarterPicker' | 'Chọn năm' | 'Chọn ngày tự nhập' | 'Chọn khoảng ngày' | 'Chọn khoảng ngày' | 'Chọn khoảng tháng' | 'Chọn nhiều tháng calendar' | 'Chọn khoảng năm' | 'Chọn khoảng năm' | 'Markdown' | 'Menu đổ xuống chọn 1' | 'Gõ text để hiện suggestion dropdownlist chọn' | 'Radio' | 'Chọn màu' | 'CodeEditor' | 'EmbedCode' | 'Chọn file ảnh' | 'Upload file (cho phép up nhiều)' | 'Chọn vị trí geo trên bản đồ' | 'Hiển thị kiểu tiền áp dụng cho loại số' | 'Kiêu MenuItem' | 'ActionMenu' | 'Mật khẩu' | 'Định dạng Email' | 'Filter';
export type ItemsPropTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type ActionsPlacementEnum = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type BackactionPlacementEnum = 'TOP' | 'BOTTOM' | 'EXTRA';
export type StepsTypeEnum2 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InitialActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type InvActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type DcActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type ReportDashboardPanelTypeEnum2 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
