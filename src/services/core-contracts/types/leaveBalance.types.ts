import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * LeaveBalance interface
 * Auto-generated from Schema: LeaveBalance
 */
export interface ILeaveBalance {
  _id: string;
  employeeId?: string;
  year?: string;
  balances?: IBalancesItem[];
  name?: string;
}

export interface IBalancesItem {
  leaveTypeId?: string;
  leaveTypeName?: string;
  totalEntitlement?: number;
  used?: number;
  pending?: number;
  remaining?: number;
}

export interface ICreateLeaveBalanceInput {
  employeeId?: string;
  year?: string;
  balances?: IBalancesItem[];
  name?: string;
}

export type ILeaveBalanceListResponse = ApiListResponse<ILeaveBalance>
