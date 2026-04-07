import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * WorkerTeam interface
 * Auto-generated from Schema: WorkerTeam
 */
export interface IWorkerTeam {
  _id: string;
  code?: string;
  teamName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  zalo?: string;
  status?: WorkerTeamStatusEnum;
  joinDate?: string | Date;
  specializations?: string[];
  rating?: number;
  totalProjects?: number;
  completedProjects?: number;
  taxCode?: string;
  bankAccount?: string;
  city?: string;
  ward?: string;
  address?: string;
  lat?: number;
  lng?: number;
  note?: string;
}

export interface ICreateWorkerTeamInput {
  code?: string;
  teamName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  zalo?: string;
  status?: WorkerTeamStatusEnum2;
  joinDate?: string | Date;
  specializations?: string[];
  rating?: number;
  totalProjects?: number;
  completedProjects?: number;
  taxCode?: string;
  bankAccount?: string;
  city?: string;
  ward?: string;
  address?: string;
  lat?: number;
  lng?: number;
  note?: string;
}

export type IWorkerTeamListResponse = ApiListResponse<IWorkerTeam>

// Union types generated from value_options
export type WorkerTeamStatusEnum = 'active' | 'inactive';
export type WorkerTeamStatusEnum2 = 'active' | 'inactive';
