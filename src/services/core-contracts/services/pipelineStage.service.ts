import { query, queryList } from 'app/services/graphqlService'; // TODO: Check path
import { GeneralCollectionFilter } from 'types/filters/GeneralCollectionFilter';
import {
  find_content,
  query_content,
  count_content,
  save_content,
  update_partial_content,
  delete_content,
  delete_multi_content,
  lock_content
} from 'app/store/actions/data/data.action'; // TODO: Check path

import { FIND_PIPELINESTAGE_DTO, QUERY_PIPELINESTAGES_DTO } from '../queries/pipelineStage.queries';
import {
  IPipelineStage,
  ICreatePipelineStageInput,
  IPipelineStageListResponse
} from '../types/pipelineStage.types';

export const pipelineStageService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PipelineStage', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PipelineStage');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPipelineStageListResponse> {
    return await query_content<IPipelineStage>({ schema: 'PipelineStage', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PipelineStage', filter });
    return response?.data || 0;
  },

  async createPipelineStage(input: ICreatePipelineStageInput): Promise<IPipelineStage> {
    const response = await save_content({
      schema: 'PipelineStage',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PipelineStage');
    return response.data as IPipelineStage;
  },

  async updatePipelineStage(id: string, input: Partial<ICreatePipelineStageInput>): Promise<IPipelineStage> {
    const response = await update_partial_content({
      schema: 'PipelineStage',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PipelineStage');
    return response.data as IPipelineStage;
  },

  async deletePipelineStage(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PipelineStage',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPipelineStage(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PipelineStage',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPipelineStage(id: string, locked: boolean = true): Promise<IPipelineStage> {
    const response = await lock_content({
      schema: 'PipelineStage',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PipelineStage');
    return response.data as IPipelineStage;
  },

  async findPipelineStageDto(id: string): Promise<IPipelineStage> {
    const response = await query<IPipelineStage>(FIND_PIPELINESTAGE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PipelineStage');
    return response.data;
  },
  async queryPipelineStagesDto(filter?: GeneralCollectionFilter): Promise<IPipelineStageListResponse> {
    return await queryList<IPipelineStage>(
      QUERY_PIPELINESTAGES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default pipelineStageService;
