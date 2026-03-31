import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * NotificationCategory interface
 * Auto-generated from Schema: NotificationCategory
 */
export interface INotificationCategory {
  _id: string;
  name?: string;
  code?: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultPriority?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ICreateNotificationCategoryInput {
  name?: string;
  code?: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultPriority?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export type INotificationCategoryListResponse = ApiListResponse<INotificationCategory>
