import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ShiftEventOverride interface
 * Auto-generated from Schema: ShiftEventOverride
 */
export interface IShiftEventOverride {
  _id: string;
  employeeId?: string;
  date?: string;
  overrideType?: string;
  shiftCode?: string;
  reason?: string;
  name?: string;
}

export interface ICreateShiftEventOverrideInput {
  employeeId?: string;
  date?: string;
  overrideType?: string;
  shiftCode?: string;
  reason?: string;
  name?: string;
}

export type IShiftEventOverrideListResponse = ApiListResponse<IShiftEventOverride>
