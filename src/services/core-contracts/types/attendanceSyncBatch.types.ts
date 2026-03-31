import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AttendanceSyncBatch interface
 * Auto-generated from Schema: AttendanceSyncBatch
 */
export interface IAttendanceSyncBatch {
  _id: string;
  batchCode?: string;
  source?: string;
  fromDate?: string;
  toDate?: string;
  totalRecords?: string;
  successCount?: string;
  errorCount?: string;
  status?: string;
  note?: string;
  syncedBy?: string;
  syncedAt?: string;
  name?: string;
}

export interface ICreateAttendanceSyncBatchInput {
  batchCode?: string;
  source?: string;
  fromDate?: string;
  toDate?: string;
  totalRecords?: string;
  successCount?: string;
  errorCount?: string;
  status?: string;
  note?: string;
  syncedBy?: string;
  syncedAt?: string;
  name?: string;
}

export type IAttendanceSyncBatchListResponse = ApiListResponse<IAttendanceSyncBatch>
