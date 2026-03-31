import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * OrgMembership interface
 * Auto-generated from Schema: OrgMembership
 */
export interface IOrgMembership {
  _id: string;
  employeeId?: string;
  departmentId?: string;
  isManager?: boolean;
  isPrimary?: boolean;
  positionId?: string;
}

export interface ICreateOrgMembershipInput {
  employeeId?: string;
  departmentId?: string;
  isManager?: boolean;
  isPrimary?: boolean;
  positionId?: string;
}

export type IOrgMembershipListResponse = ApiListResponse<IOrgMembership>
