import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * BlockingActivity interface
 * Auto-generated from Schema: BlockingActivity
 */
export interface IBlockingActivity {
  _id: string;
  action?: IActionItem[];
  workflowId?: string;
  instanceId?: string;
  activityId?: string;
  isStart?: boolean;
  name?: string;
  parameters?: any;
  tenantId?: string;
}

export interface IActionItem {
  schema?: string;
  suggestProperties?: ISuggestpropertiesItem[];
  actionType?: ActionActionTypeEnum;
  new_data_flow?: boolean;
  is_multi_task?: boolean;
  executable?: boolean;
}

export interface ISuggestpropertiesItem {
  id?: string;
  propType?: string;
  label?: string;
}

export interface ICreateBlockingActivityInput {
  action?: IActionItem[];
  workflowId?: string;
  instanceId?: string;
  activityId?: string;
  isStart?: boolean;
  name?: string;
  parameters?: any;
  tenantId?: string;
}

export type IBlockingActivityListResponse = ApiListResponse<IBlockingActivity>

// Union types generated from value_options
export type ActionActionTypeEnum = 'Event' | 'Task';
