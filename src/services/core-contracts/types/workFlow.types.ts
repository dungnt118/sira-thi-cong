import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WorkFlow interface
 * Auto-generated from Schema: WorkFlow
 */
export interface IWorkFlow {
  _id: string;
  tenantId?: string;
  description?: string;
  groupId?: string;
  idx_groupId?: IndexedContentItem;
  monitors?: any[];
  isEnable?: boolean;
  isSingleton?: boolean;
  lockTimeout?: number;
  lockExpiration?: number;
  deleteFinishedWorkflows?: boolean;
  activities?: IActivitiesItem[];
  moduleIds?: any[];
  transitions?: ITransitionsItem[];
  name?: string;
}

export interface IActivitiesItem {
  activityId?: string;
  name?: string;
  type?: string;
  isStart?: boolean;
  isEnd?: boolean;
  action?: IActionItem[];
  x?: number;
  y?: number;
  full_path?: any[];
  content_path?: any[];
  status?: ActivitiesStatusEnum;
  message?: string;
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

export interface ITransitionsItem {
  sourceId?: string;
  destId?: string;
  outcome?: any;
}

export interface ICreateWorkFlowInput {
  tenantId?: string;
  description?: string;
  groupId?: string;
  monitors?: any[];
  isEnable?: boolean;
  isSingleton?: boolean;
  lockTimeout?: number;
  lockExpiration?: number;
  deleteFinishedWorkflows?: boolean;
  activities?: IActivitiesItem[];
  moduleIds?: any[];
  transitions?: ITransitionsItem[];
  name?: string;
}

export type IWorkFlowListResponse = ApiListResponse<IWorkFlow>

// Union types generated from value_options
export type ActivitiesStatusEnum = 'Đang thực thi' | 'Khởi động lại (từ trạng thái chờ hoặc tạm dừng)' | 'Trạng thái chờ là trạng thái xảy ra khi đã chạy đến cuối 1 nhánh nhưng node cuối cùng không phải là endtask' | 'Đã bắt đầu' | 'Tạm dừng' | 'Đã kết thúc là trạng thái khi xử lý tới 1 node được đánh dấu endtask' | 'Lỗi' | 'Bác bỏ';
export type ActionActionTypeEnum = 'Event' | 'Task';
