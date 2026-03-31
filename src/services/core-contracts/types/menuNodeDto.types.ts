import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MenuNodeDto interface
 * Auto-generated from Schema: MenuNodeDto
 */
export interface IMenuNodeDto {
  _id: string;
  title?: string;
  url?: string;
  children?: IChildrenItem[];
  name?: string;
  target_schema?: string;
  moduleIds?: any[];
  panel_type?: MenuNodeDtoPanelTypeEnum;
  url_type?: MenuNodeDtoUrlTypeEnum;
  layoutId?: string;
  viewExtensionId?: string;
  requiredPermissions?: any[];
  isDefault?: any[];
  isHidden?: boolean;
  parentId?: string;
  type?: MenuNodeDtoTypeEnum;
  icon?: string;
  path?: string;
  absolutePath?: string;
  description?: string;
  level?: number;
  priority?: number;
  action_steps?: IActionStepsItem[];
  isRootScope?: boolean;
  showBadge?: boolean;
  badgeScript?: string;
  badgeType?: string;
  badgeColor?: string;
}

export interface IChildrenItem {
  title?: string;
  url?: string;
  children?: IChildrenItem[];
  name?: string;
  target_schema?: string;
  moduleIds?: any[];
  panel_type?: ChildrenPanelTypeEnum;
  url_type?: ChildrenUrlTypeEnum;
  layoutId?: string;
  viewExtensionId?: string;
  requiredPermissions?: any[];
  isDefault?: any[];
  isHidden?: boolean;
  parentId?: string;
  type?: ChildrenTypeEnum;
  icon?: string;
  path?: string;
  absolutePath?: string;
  description?: string;
  level?: number;
  priority?: number;
  action_steps?: IActionStepsItem[];
  isRootScope?: boolean;
  showBadge?: boolean;
  badgeScript?: string;
  badgeType?: string;
  badgeColor?: string;
  id?: string;
}

export interface IChildrenItem {
  title?: string;
  url?: string;
  children?: IChildrenItem[];
  name?: string;
  target_schema?: string;
  moduleIds?: any[];
  panel_type?: ChildrenPanelTypeEnum2;
  url_type?: ChildrenUrlTypeEnum2;
  layoutId?: string;
  viewExtensionId?: string;
  requiredPermissions?: any[];
  isDefault?: any[];
  isHidden?: boolean;
  parentId?: string;
  type?: ChildrenTypeEnum2;
  icon?: string;
  path?: string;
  absolutePath?: string;
  description?: string;
  level?: number;
  priority?: number;
  action_steps?: IActionStepsItem[];
  isRootScope?: boolean;
  showBadge?: boolean;
  badgeScript?: string;
  badgeType?: string;
  badgeColor?: string;
  id?: string;
}

export interface IChildrenItem {
  title?: string;
  url?: string;
  children?: IChildrenItem[];
  name?: string;
  target_schema?: string;
  moduleIds?: any[];
  panel_type?: ChildrenPanelTypeEnum3;
  url_type?: ChildrenUrlTypeEnum3;
  layoutId?: string;
  viewExtensionId?: string;
  requiredPermissions?: any[];
  isDefault?: any[];
  isHidden?: boolean;
  parentId?: string;
  type?: ChildrenTypeEnum3;
  icon?: string;
  path?: string;
  absolutePath?: string;
  description?: string;
  level?: number;
  priority?: number;
  action_steps?: IActionStepsItem[];
  isRootScope?: boolean;
  showBadge?: boolean;
  badgeScript?: string;
  badgeType?: string;
  badgeColor?: string;
  id?: string;
}

export interface IChildrenItem {
  title?: string;
  url?: string;
  children?: any;
  name?: string;
  target_schema?: string;
  moduleIds?: any[];
  panel_type?: ChildrenPanelTypeEnum4;
  url_type?: ChildrenUrlTypeEnum4;
  layoutId?: string;
  viewExtensionId?: string;
  requiredPermissions?: any[];
  isDefault?: any;
  isHidden?: boolean;
  parentId?: string;
  type?: ChildrenTypeEnum4;
  icon?: string;
  path?: string;
  absolutePath?: string;
  description?: string;
  level?: number;
  priority?: number;
  action_steps?: any;
  isRootScope?: boolean;
  showBadge?: boolean;
  badgeScript?: string;
  badgeType?: string;
  badgeColor?: string;
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

export interface ICreateMenuNodeDtoInput {
  title?: string;
  url?: string;
  children?: IChildrenItem[];
  name?: string;
  target_schema?: string;
  moduleIds?: any[];
  panel_type?: MenuNodeDtoPanelTypeEnum2;
  url_type?: MenuNodeDtoUrlTypeEnum2;
  layoutId?: string;
  viewExtensionId?: string;
  requiredPermissions?: any[];
  isDefault?: any[];
  isHidden?: boolean;
  parentId?: string;
  type?: MenuNodeDtoTypeEnum2;
  icon?: string;
  path?: string;
  absolutePath?: string;
  description?: string;
  level?: number;
  priority?: number;
  action_steps?: IActionStepsItem[];
  isRootScope?: boolean;
  showBadge?: boolean;
  badgeScript?: string;
  badgeType?: string;
  badgeColor?: string;
}

export type IMenuNodeDtoListResponse = ApiListResponse<IMenuNodeDto>

// Union types generated from value_options
export type MenuNodeDtoPanelTypeEnum = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type MenuNodeDtoUrlTypeEnum = 'Layout' | 'Schema' | 'SinglePage' | 'Personal' | 'Custom' | 'SchemaViewExt';
export type MenuNodeDtoTypeEnum = 'item' | 'item_group' | 'tab' | 'controller' | 'link' | 'group' | 'collapse' | 'button';
export type ChildrenPanelTypeEnum = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type ChildrenUrlTypeEnum = 'Layout' | 'Schema' | 'SinglePage' | 'Personal' | 'Custom' | 'SchemaViewExt';
export type ChildrenTypeEnum = 'item' | 'item_group' | 'tab' | 'controller' | 'link' | 'group' | 'collapse' | 'button';
export type ChildrenPanelTypeEnum2 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type ChildrenUrlTypeEnum2 = 'Layout' | 'Schema' | 'SinglePage' | 'Personal' | 'Custom' | 'SchemaViewExt';
export type ChildrenTypeEnum2 = 'item' | 'item_group' | 'tab' | 'controller' | 'link' | 'group' | 'collapse' | 'button';
export type ChildrenPanelTypeEnum3 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type ChildrenUrlTypeEnum3 = 'Layout' | 'Schema' | 'SinglePage' | 'Personal' | 'Custom' | 'SchemaViewExt';
export type ChildrenTypeEnum3 = 'item' | 'item_group' | 'tab' | 'controller' | 'link' | 'group' | 'collapse' | 'button';
export type ChildrenPanelTypeEnum4 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type ChildrenUrlTypeEnum4 = 'Layout' | 'Schema' | 'SinglePage' | 'Personal' | 'Custom' | 'SchemaViewExt';
export type ChildrenTypeEnum4 = 'item' | 'item_group' | 'tab' | 'controller' | 'link' | 'group' | 'collapse' | 'button';
export type ActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type ActionStepsTypeEnum2 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type ActionStepsTypeEnum3 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type ActionStepsTypeEnum4 = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
export type MenuNodeDtoPanelTypeEnum2 = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type MenuNodeDtoUrlTypeEnum2 = 'Layout' | 'Schema' | 'SinglePage' | 'Personal' | 'Custom' | 'SchemaViewExt';
export type MenuNodeDtoTypeEnum2 = 'item' | 'item_group' | 'tab' | 'controller' | 'link' | 'group' | 'collapse' | 'button';
