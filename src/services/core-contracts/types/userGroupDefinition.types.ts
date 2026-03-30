import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * UserGroupDefinition interface
 * Auto-generated from Schema: UserGroupDefinition
 */
export interface IUserGroupDefinition {
  _id: string;
  name?: string;
  description?: string;
  includes?: IIncludesItem[];
  excludes?: IExcludesItem[];
  snapshot?: ISnapshotItem[];
  snapshotRefreshedAt?: ISnapshotrefreshedatItem[];
  isActive?: boolean;
  tags?: any[];
}

export interface IIncludesItem {
  target?: any;
  values?: string[];
  targetSchema?: string;
  idx_targetSchema?: IndexedContentItem;
  conditionExpression?: IConditionexpressionItem[];
  resolveStrategy?: any[];
  resolveField?: string;
  resolveRefSchema?: string;
  idx_resolveRefSchema?: IndexedContentItem;
  enableResolveCondition?: boolean;
  resolveConditionExpression?: IResolveconditionexpressionItem[];
  dsFilterDefId?: string;
  dsCustomFilterId?: string;
  datasourceFilterNodeId?: string;
}

export interface IConditionexpressionItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any;
  op?: any;
  value?: any;
  values?: any;
  children?: any;
}

export interface IResolveconditionexpressionItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any;
  op?: any;
  value?: any;
  values?: any;
  children?: any;
}

export interface IExcludesItem {
  target?: any;
  values?: string[];
  targetSchema?: string;
  idx_targetSchema?: IndexedContentItem;
  conditionExpression?: IConditionexpressionItem[];
  resolveStrategy?: any[];
  resolveField?: string;
  resolveRefSchema?: string;
  idx_resolveRefSchema?: IndexedContentItem;
  enableResolveCondition?: boolean;
  resolveConditionExpression?: IResolveconditionexpressionItem[];
  dsFilterDefId?: string;
  dsCustomFilterId?: string;
  datasourceFilterNodeId?: string;
}

export interface IConditionexpressionItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any;
  op?: any;
  value?: any;
  values?: any;
  children?: any;
}

export interface IResolveconditionexpressionItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any;
  op?: any;
  value?: any;
  values?: any;
  children?: any;
}

export interface ISnapshotItem {
  accountIds?: any[];
  employeeIds?: any[];
  departmentIds?: any[];
  totalUsers?: number;
  fingerprint?: string;
}

export interface ISnapshotrefreshedatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: SnapshotrefreshedatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: SnapshotrefreshedatKindEnum;
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

export interface ICreateUserGroupDefinitionInput {
  name?: string;
  description?: string;
  includes?: IIncludesItem[];
  excludes?: IExcludesItem[];
  snapshot?: ISnapshotItem[];
  snapshotRefreshedAt?: ISnapshotrefreshedatItem[];
  isActive?: boolean;
  tags?: any[];
}

export type IUserGroupDefinitionListResponse = ApiListResponse<IUserGroupDefinition>

// Union types generated from value_options
export type SnapshotrefreshedatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type SnapshotrefreshedatKindEnum = 'Unspecified' | 'Utc' | 'Local';
