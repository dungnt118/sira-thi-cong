import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Employee interface
 * Auto-generated from Schema: Employee
 */
export interface IEmployee {
  _id: string;
  code?: string;
  name?: string;
  email?: string;
  sex?: EmployeeSexEnum;
  status?: EmployeeStatusEnum;
  workScheduleId?: string;
}

export interface ICreateEmployeeInput {
  code?: string;
  name?: string;
  email?: string;
  sex?: EmployeeSexEnum2;
  status?: EmployeeStatusEnum2;
  workScheduleId?: string;
}

export type IEmployeeListResponse = ApiListResponse<IEmployee>

// Union types generated from value_options
export type EmployeeSexEnum = 'male' | 'female';
export type EmployeeStatusEnum = 'active' | 'on_leave' | 'probation' | 'resigned' | 'terminated';
export type EmployeeSexEnum2 = 'male' | 'female';
export type EmployeeStatusEnum2 = 'active' | 'on_leave' | 'probation' | 'resigned' | 'terminated';
