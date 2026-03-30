import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * NotificationTriggerRule interface
 * Auto-generated from Schema: NotificationTriggerRule
 */
export interface INotificationTriggerRule {
  _id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  categoryId?: string;
  triggerSchema?: string;
  events?: any[];
  triggerCondition?: ITriggerconditionItem[];
  watchedFields?: any[];
  actions?: IActionsItem[];
  priority?: any[];
}

export interface ITriggerconditionItem {
  op?: string;
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  id?: string;
  operation?: string;
  value?: any;
  propType?: string;
  op?: string;
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  id?: string;
  operation?: string;
  value?: any;
  propType?: string;
  op?: string;
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  id?: string;
  operation?: string;
  value?: any;
  propType?: string;
  op?: string;
  children?: any;
}

export interface IActionsItem {
  recipients?: IRecipientsItem[];
  channels?: any[];
  titleTemplate?: string;
  shortMessageTemplate?: string;
  fullContentTemplate?: string;
  metadataOverride?: any;
}

export interface IRecipientsItem {
  type?: RecipientsTypeEnum;
  value?: string;
  fieldPath?: string;
}

export interface ICreateNotificationTriggerRuleInput {
  name?: string;
  description?: string;
  isActive?: boolean;
  categoryId?: string;
  triggerSchema?: string;
  events?: any[];
  triggerCondition?: ITriggerconditionItem[];
  watchedFields?: any[];
  actions?: IActionsItem[];
  priority?: any[];
}

export type INotificationTriggerRuleListResponse = ApiListResponse<INotificationTriggerRule>

// Union types generated from value_options
export type RecipientsTypeEnum = 'Creator' | 'Owner' | 'Updater' | 'SchemaField' | 'UserGroup' | 'DepartmentManager' | 'ExactUsername' | 'ExactEmail';
