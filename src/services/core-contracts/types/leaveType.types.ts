import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * LeaveType interface
 * Auto-generated from Schema: LeaveType
 */
export interface ILeaveType {
  _id: string;
  code?: string;
  name?: string;
  description?: string;
  isPaid?: string;
  requiresApproval?: string;
  maxDaysPerYear?: string;
  isActive?: string;
}

export interface ICreateLeaveTypeInput {
  code?: string;
  name?: string;
  description?: string;
  isPaid?: string;
  requiresApproval?: string;
  maxDaysPerYear?: string;
  isActive?: string;
}

export type ILeaveTypeListResponse = ApiListResponse<ILeaveType>
