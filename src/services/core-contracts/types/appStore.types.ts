import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AppStore interface
 * Auto-generated from Schema: AppStore
 */
export interface IAppStore {
  _id: string;
  name?: string;
  isPublished?: boolean;
  appID?: string;
  price?: number;
  description?: string;
  version?: IVersionItem[];
  author?: string;
  tags?: any[];
  rate?: number;
  downloadNumb?: number;
  shortDescription?: string;
  thumbnail?: string;
  extractedFolder?: string;
  fileId?: string;
  appId?: string;
  resources?: IResourcesItem[];
  mode?: AppStoreModeEnum;
  fileSize?: number;
  sourceType?: AppStoreSourceTypeEnum;
  lastInstallState?: ILastinstallstateItem[];
  isGitPush?: boolean;
  gitPushStatus?: any[];
  gitCommitHash?: string;
  gitTagName?: string;
  gitPushTime?: IGitpushtimeItem[];
  gitPushMessage?: string;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface IResourcesItem {
  sourceId?: string;
  description?: string;
  name?: string;
  label?: string;
  version?: IVersionItem[];
  type?: ResourcesTypeEnum;
  backupType?: ResourcesBackupTypeEnum;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface ILastinstallstateItem {
  date?: string | Date;
  success?: boolean;
  message?: string;
}

export interface IGitpushtimeItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: GitpushtimeDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: GitpushtimeKindEnum;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Second?: number;
  Ticks?: any;
  TimeOfDay?: ITimeofdayItem[];
  Year?: number;
}

export interface ITimeofdayItem {
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

export interface ICreateAppStoreInput {
  name?: string;
  isPublished?: boolean;
  appID?: string;
  price?: number;
  description?: string;
  version?: IVersionItem[];
  author?: string;
  tags?: any[];
  rate?: number;
  downloadNumb?: number;
  shortDescription?: string;
  thumbnail?: string;
  extractedFolder?: string;
  fileId?: string;
  appId?: string;
  resources?: IResourcesItem[];
  mode?: AppStoreModeEnum2;
  fileSize?: number;
  sourceType?: AppStoreSourceTypeEnum2;
  lastInstallState?: ILastinstallstateItem[];
  isGitPush?: boolean;
  gitPushStatus?: any[];
  gitCommitHash?: string;
  gitTagName?: string;
  gitPushTime?: IGitpushtimeItem[];
  gitPushMessage?: string;
}

export type IAppStoreListResponse = ApiListResponse<IAppStore>

// Union types generated from value_options
export type AppStoreModeEnum = 'FULL' | 'MODULE';
export type AppStoreSourceTypeEnum = 'Internal' | 'External' | 'InternalAuto';
export type ResourcesTypeEnum = 'SYSTEMSETTING' | 'SCHEMA' | 'SCHEMAACTION' | 'SYSTEMSCHEMADATA' | 'API' | 'JSFUNCTION' | 'CODELIB' | 'WORKFLOW' | 'WORKFLOWGROUP' | 'MENU' | 'FORM' | 'VIEW' | 'REPORT' | 'LAYOUT' | 'COMPONENT' | 'FILTER' | 'REPORT_DASHBOARD' | 'DATASOURCE' | 'PERMISSION' | 'CUSTOM_VIEW_LIBRARY' | 'IMPORTTEMPLATE' | 'INDEXEDCONTENT' | 'MICROAPP' | 'MICROAPP_VERSION' | 'MICROAPP_PANEL' | 'SMARTLAYOUT' | 'DIRECTORY_TREE' | 'TIMELINE_FLOW';
export type ResourcesBackupTypeEnum = 'FULL' | 'MODULE';
export type GitpushtimeDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type GitpushtimeKindEnum = 'Unspecified' | 'Utc' | 'Local';
export type AppStoreModeEnum2 = 'FULL' | 'MODULE';
export type AppStoreSourceTypeEnum2 = 'Internal' | 'External' | 'InternalAuto';
