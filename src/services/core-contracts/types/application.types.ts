import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Application interface
 * Auto-generated from Schema: Application
 */
export interface IApplication {
  _id: string;
  name?: string;
  configFolder?: string;
  code?: string;
  description?: string;
  logoId?: string;
  env_variables?: any;
  isWorkerService?: boolean;
  menus?: IMenusItem[];
}

export interface IMenusItem {
  name?: string;
  target_schema?: string;
  moduleIds?: any[];
  panel_type?: MenusPanelTypeEnum;
  url_type?: MenusUrlTypeEnum;
  layoutId?: string;
  viewExtensionId?: string;
  requiredPermissions?: any[];
  isDefault?: any[];
  isHidden?: boolean;
  parentId?: string;
  type?: MenusTypeEnum;
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

export interface ICreateApplicationInput {
  name?: string;
  configFolder?: string;
  code?: string;
  description?: string;
  logoId?: string;
  env_variables?: any;
  isWorkerService?: boolean;
  menus?: IMenusItem[];
}

export type IApplicationListResponse = ApiListResponse<IApplication>

// Union types generated from value_options
export type MenusPanelTypeEnum = 'UNDEFINED' | 'CUSTOMPAGE' | 'LAYOUT' | 'REPORTDASHBOARD' | 'VIEW' | 'FORM' | 'REPORT' | 'MENU' | 'SCHEMA' | 'MICROAPP' | 'SMARTLAYOUT' | 'TIMELINEFLOW';
export type MenusUrlTypeEnum = 'Layout' | 'Schema' | 'SinglePage' | 'Personal' | 'Custom' | 'SchemaViewExt';
export type MenusTypeEnum = 'item' | 'item_group' | 'tab' | 'controller' | 'link' | 'group' | 'collapse' | 'button';
export type ActionStepsTypeEnum = 'NONE' | 'POPUP' | 'REDIRECT' | 'SETQUERYPARAMETERS' | 'LOAD' | 'INSERT' | 'UPDATE' | 'UPDATE_SET' | 'UPDATE_SET_UNCONTROL' | 'DELETE' | 'CLONE' | 'DELETE_REQUEST' | 'DETAIL' | 'LOCK' | 'SYNC_DIRECTORY_TREE' | 'UNLOCK' | 'CHECKPERMISSION' | 'COMMIT' | 'CONFIRM' | 'REJECT' | 'CLOSE' | 'CLEARFORM' | 'DOWNLOAD' | 'CALL' | 'PLAYSOUND' | 'SETDATA' | 'NEWDATA' | 'MODIFYDATA' | 'SET_PANEL_DATA' | 'UPDATEUNCONTROL' | 'VALIDATEDATA' | 'LAYOUTSUBMIT' | 'EXECUTESCRIPT' | 'DELETEDRAFT' | 'CLOSEALL' | 'ASSIGN' | 'CALLASSISTANT' | 'PRINT' | 'PREVIEWHTML' | 'PREVIEWIFRAME' | 'EXPORTWORD' | 'DELETEALL' | 'SHOWCONFIRM' | 'SHOWCHATBOX' | 'RELOADLAYOUT' | 'RELOADPANEL' | 'SHOWVERSIONS' | 'ELECTRONICSIGNATURE' | 'CHECKDUPLICATE' | 'PERMISSION' | 'SHOWMESSAGE' | 'PUSHNOTIFICATION' | 'CHANGEPASSWORD' | 'IMPORT' | 'EXPORT' | 'CALLAPI' | 'CALLFUNCTION' | 'CALLPLUGIN' | 'SHOWPREVIEWDATA' | 'WAIT' | 'SOFTUPDATE' | 'SENDEMAIL' | 'PAYMENT' | 'FAKEDATA' | 'COPYTOCLIPBOARD' | 'TTS' | 'TRANSLATE';
