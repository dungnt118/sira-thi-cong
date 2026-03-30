import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PipelineStage interface
 * Auto-generated from Schema: PipelineStage
 */
export interface IPipelineStage {
  _id: string;
  name?: string;
  pipeline_id?: string;
  idx_pipeline_id?: IndexedContentItem;
  order?: number;
  color?: string;
  system_stage?: PipelineStageSystemStageEnum;
}

export interface ICreatePipelineStageInput {
  name?: string;
  pipeline_id?: string;
  order?: number;
  color?: string;
  system_stage?: PipelineStageSystemStageEnum2;
}

export type IPipelineStageListResponse = ApiListResponse<IPipelineStage>

// Union types generated from value_options
export type PipelineStageSystemStageEnum = 'new' | 'in_progress' | 'won' | 'lost';
export type PipelineStageSystemStageEnum2 = 'new' | 'in_progress' | 'won' | 'lost';
