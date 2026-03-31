import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WorkFlowInstance interface
 * Auto-generated from Schema: WorkFlowInstance
 */
export interface IWorkFlowInstance {
  _id: string;
  parentId?: string;
  workflowId?: string;
  idx_workflowId?: IndexedContentItem;
  token?: string;
  status?: WorkFlowInstanceStatusEnum;
  faultMessage?: string;
  displayMessage?: string;
  state?: IStateItem[];
  blockingActivities?: IBlockingactivitiesItem[];
  tenantId?: string;
  lastActivity?: ILastactivityItem[];
  duration?: number;
  name?: string;
}

export interface IStateItem {
  lastResult?: any;
  input?: any;
  duration?: any;
}

export interface IBlockingactivitiesItem {
  activityId?: string;
  name?: string;
  type?: string;
  status?: BlockingactivitiesStatusEnum;
  message?: string;
}

export interface ILastactivityItem {
  activityId?: string;
  name?: string;
  type?: string;
  status?: LastactivityStatusEnum;
  message?: string;
}

export interface ICreateWorkFlowInstanceInput {
  parentId?: string;
  workflowId?: string;
  token?: string;
  status?: WorkFlowInstanceStatusEnum2;
  faultMessage?: string;
  displayMessage?: string;
  state?: IStateItem[];
  blockingActivities?: IBlockingactivitiesItem[];
  tenantId?: string;
  lastActivity?: ILastactivityItem[];
  duration?: number;
  name?: string;
}

export type IWorkFlowInstanceListResponse = ApiListResponse<IWorkFlowInstance>

// Union types generated from value_options
export type WorkFlowInstanceStatusEnum = 'Đang thực thi' | 'Khởi động lại (từ trạng thái chờ hoặc tạm dừng)' | 'Trạng thái chờ là trạng thái xảy ra khi đã chạy đến cuối 1 nhánh nhưng node cuối cùng không phải là endtask' | 'Đã bắt đầu' | 'Tạm dừng' | 'Đã kết thúc là trạng thái khi xử lý tới 1 node được đánh dấu endtask' | 'Lỗi' | 'Bác bỏ';
export type BlockingactivitiesStatusEnum = 'Đang thực thi' | 'Khởi động lại (từ trạng thái chờ hoặc tạm dừng)' | 'Trạng thái chờ là trạng thái xảy ra khi đã chạy đến cuối 1 nhánh nhưng node cuối cùng không phải là endtask' | 'Đã bắt đầu' | 'Tạm dừng' | 'Đã kết thúc là trạng thái khi xử lý tới 1 node được đánh dấu endtask' | 'Lỗi' | 'Bác bỏ';
export type LastactivityStatusEnum = 'Đang thực thi' | 'Khởi động lại (từ trạng thái chờ hoặc tạm dừng)' | 'Trạng thái chờ là trạng thái xảy ra khi đã chạy đến cuối 1 nhánh nhưng node cuối cùng không phải là endtask' | 'Đã bắt đầu' | 'Tạm dừng' | 'Đã kết thúc là trạng thái khi xử lý tới 1 node được đánh dấu endtask' | 'Lỗi' | 'Bác bỏ';
export type WorkFlowInstanceStatusEnum2 = 'Đang thực thi' | 'Khởi động lại (từ trạng thái chờ hoặc tạm dừng)' | 'Trạng thái chờ là trạng thái xảy ra khi đã chạy đến cuối 1 nhánh nhưng node cuối cùng không phải là endtask' | 'Đã bắt đầu' | 'Tạm dừng' | 'Đã kết thúc là trạng thái khi xử lý tới 1 node được đánh dấu endtask' | 'Lỗi' | 'Bác bỏ';
