import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AnnouncementTemplateDefinition interface
 * Auto-generated from Schema: AnnouncementTemplateDefinition
 */
export interface IAnnouncementTemplateDefinition {
  _id: string;
  name?: string;
  code?: string;
  description?: string;
  subjectTemplate?: string;
  bodyTemplate?: string;
  channels?: IChannelsItem[];
  categoryId?: string;
  defaultPriority?: number;
  isActive?: boolean;
  tags?: any[];
  sortOrder?: number;
}

export interface IChannelsItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface ICreateAnnouncementTemplateDefinitionInput {
  name?: string;
  code?: string;
  description?: string;
  subjectTemplate?: string;
  bodyTemplate?: string;
  channels?: IChannelsItem[];
  categoryId?: string;
  defaultPriority?: number;
  isActive?: boolean;
  tags?: any[];
  sortOrder?: number;
}

export type IAnnouncementTemplateDefinitionListResponse = ApiListResponse<IAnnouncementTemplateDefinition>
