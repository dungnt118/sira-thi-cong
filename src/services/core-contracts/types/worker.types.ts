import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * Worker interface
 * Auto-generated from Schema: Worker
 */
export interface IWorker {
  _id: string;
  code?: string;
  name?: string;
  workerType?: WorkerWorkerTypeEnum;
  employeeId?: string;
  idx_employeeId?: IndexedContentItem;
  gender?: WorkerGenderEnum;
  dob?: string | Date;
  phone?: string;
  email?: string;
  status?: WorkerStatusEnum;
  position?: string;
  priceConfigId?: string;
  idx_priceConfigId?: IndexedContentItem;
  teamId?: string;
  idx_teamId?: IndexedContentItem;
  rating?: number;
  skills?: string[];
  city?: string;
  district?: string;
  ward?: string;
  address?: string;
  lat?: number;
  lng?: number;
  attachments?: HeadlessFileUpload[];
  note?: string;
  costPerDay?: number;
}

export interface ICreateWorkerInput {
  code?: string;
  name?: string;
  workerType?: WorkerWorkerTypeEnum2;
  employeeId?: string;
  gender?: WorkerGenderEnum2;
  dob?: string | Date;
  phone?: string;
  email?: string;
  status?: WorkerStatusEnum2;
  position?: string;
  priceConfigId?: string;
  teamId?: string;
  rating?: number;
  skills?: string[];
  city?: string;
  district?: string;
  ward?: string;
  address?: string;
  lat?: number;
  lng?: number;
  attachments?: HeadlessFileUpload[];
  note?: string;
  costPerDay?: number;
}

export type IWorkerListResponse = ApiListResponse<IWorker>

// Union types generated from value_options
export type WorkerWorkerTypeEnum = 'internal' | 'external' | 'collaborator';
export type WorkerGenderEnum = 'male' | 'female' | 'other';
export type WorkerStatusEnum = 'active' | 'inactive';
export type WorkerWorkerTypeEnum2 = 'internal' | 'external' | 'collaborator';
export type WorkerGenderEnum2 = 'male' | 'female' | 'other';
export type WorkerStatusEnum2 = 'active' | 'inactive';
