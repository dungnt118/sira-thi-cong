import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * FlowActivityLog interface
 * Auto-generated from Schema: FlowActivityLog
 */
export interface IFlowActivityLog {
  _id: string;
  from_activity?: string;
  endTime?: string | Date;
  total_time?: any;
  pending_time?: any;
  execution_time?: any;
  output?: IOutputItem[];
  input?: any;
  token?: string;
  status?: FlowActivityLogStatusEnum;
  workflowId?: string;
  instanceId?: string;
  activityId?: string;
  isStart?: boolean;
  name?: string;
  parameters?: any;
  tenantId?: string;
}

export interface IOutputItem {
  message?: string;
  status?: OutputStatusEnum;
  result?: any;
  outcomes?: IOutcomesItem[];
}

export interface IOutcomesItem {
  Chars?: any;
  Length?: number;
}

export interface ICreateFlowActivityLogInput {
  from_activity?: string;
  endTime?: string | Date;
  total_time?: any;
  pending_time?: any;
  execution_time?: any;
  output?: IOutputItem[];
  input?: any;
  token?: string;
  status?: FlowActivityLogStatusEnum2;
  workflowId?: string;
  instanceId?: string;
  activityId?: string;
  isStart?: boolean;
  name?: string;
  parameters?: any;
  tenantId?: string;
}

export type IFlowActivityLogListResponse = ApiListResponse<IFlowActivityLog>

// Union types generated from value_options
export type FlowActivityLogStatusEnum = 'Đang thực thi' | 'Khởi động lại (từ trạng thái chờ hoặc tạm dừng)' | 'Trạng thái chờ là trạng thái xảy ra khi đã chạy đến cuối 1 nhánh nhưng node cuối cùng không phải là endtask' | 'Đã bắt đầu' | 'Tạm dừng' | 'Đã kết thúc là trạng thái khi xử lý tới 1 node được đánh dấu endtask' | 'Lỗi' | 'Bác bỏ';
export type OutputStatusEnum = 'Đang thực thi' | 'Khởi động lại (từ trạng thái chờ hoặc tạm dừng)' | 'Trạng thái chờ là trạng thái xảy ra khi đã chạy đến cuối 1 nhánh nhưng node cuối cùng không phải là endtask' | 'Đã bắt đầu' | 'Tạm dừng' | 'Đã kết thúc là trạng thái khi xử lý tới 1 node được đánh dấu endtask' | 'Lỗi' | 'Bác bỏ';
export type FlowActivityLogStatusEnum2 = 'Đang thực thi' | 'Khởi động lại (từ trạng thái chờ hoặc tạm dừng)' | 'Trạng thái chờ là trạng thái xảy ra khi đã chạy đến cuối 1 nhánh nhưng node cuối cùng không phải là endtask' | 'Đã bắt đầu' | 'Tạm dừng' | 'Đã kết thúc là trạng thái khi xử lý tới 1 node được đánh dấu endtask' | 'Lỗi' | 'Bác bỏ';
