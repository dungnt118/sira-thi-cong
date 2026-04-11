import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * EmployeeLifecycleEvent interface
 * Auto-generated from Schema: EmployeeLifecycleEvent
 */
export interface IEmployeeLifecycleEvent {
  _id: string;
  employeeId?: string;
  eventType?: EmployeeLifecycleEventEventTypeEnum;
  eventDate?: string;
  title?: string;
  description?: string;
  actorAuthorizedUserId?: string;
  sourceModule?: string;
  sourceEntityId?: string;
  isDerived?: string;
  name?: string;
}

export interface ICreateEmployeeLifecycleEventInput {
  employeeId?: string;
  eventType?: EmployeeLifecycleEventEventTypeEnum2;
  eventDate?: string;
  title?: string;
  description?: string;
  actorAuthorizedUserId?: string;
  sourceModule?: string;
  sourceEntityId?: string;
  isDerived?: string;
  name?: string;
}

export type IEmployeeLifecycleEventListResponse = ApiListResponse<IEmployeeLifecycleEvent>

// Union types generated from value_options
export type EmployeeLifecycleEventEventTypeEnum = 'Nhận việc' | 'Hoàn tất thử việc' | 'Thay đổi loại hợp đồng' | 'Thay đổi phòng ban' | 'Thay đổi chức vụ' | 'Thay đổi lịch làm việc' | 'Nghỉ việc' | 'Bị chấm dứt';
export type EmployeeLifecycleEventEventTypeEnum2 = 'Nhận việc' | 'Hoàn tất thử việc' | 'Thay đổi loại hợp đồng' | 'Thay đổi phòng ban' | 'Thay đổi chức vụ' | 'Thay đổi lịch làm việc' | 'Nghỉ việc' | 'Bị chấm dứt';
