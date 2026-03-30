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

import { FIND_DATAWRITEPIPELINEDEFINITION_DTO, QUERY_DATAWRITEPIPELINEDEFINITIONS_DTO } from '../queries/dataWritePipelineDefinition.queries';
import {
  IDataWritePipelineDefinition,
  ICreateDataWritePipelineDefinitionInput,
  IDataWritePipelineDefinitionListResponse
} from '../types/dataWritePipelineDefinition.types';

export const dataWritePipelineDefinitionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'DataWritePipelineDefinition', _id: id });
    if (!response.data) throw new Error('Không tìm thấy DataWritePipelineDefinition');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IDataWritePipelineDefinitionListResponse> {
    return await query_content<IDataWritePipelineDefinition>({ schema: 'DataWritePipelineDefinition', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'DataWritePipelineDefinition', filter });
    return response?.data || 0;
  },

  async createDataWritePipelineDefinition(input: ICreateDataWritePipelineDefinitionInput): Promise<IDataWritePipelineDefinition> {
    const response = await save_content({
      schema: 'DataWritePipelineDefinition',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo DataWritePipelineDefinition');
    return response.data as IDataWritePipelineDefinition;
  },

  async updateDataWritePipelineDefinition(id: string, input: Partial<ICreateDataWritePipelineDefinitionInput>): Promise<IDataWritePipelineDefinition> {
    const response = await update_partial_content({
      schema: 'DataWritePipelineDefinition',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật DataWritePipelineDefinition');
    return response.data as IDataWritePipelineDefinition;
  },

  async deleteDataWritePipelineDefinition(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'DataWritePipelineDefinition',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiDataWritePipelineDefinition(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'DataWritePipelineDefinition',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockDataWritePipelineDefinition(id: string, locked: boolean = true): Promise<IDataWritePipelineDefinition> {
    const response = await lock_content({
      schema: 'DataWritePipelineDefinition',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa DataWritePipelineDefinition');
    return response.data as IDataWritePipelineDefinition;
  },

  async findDataWritePipelineDefinitionDto(id: string): Promise<IDataWritePipelineDefinition> {
    const response = await query<IDataWritePipelineDefinition>(FIND_DATAWRITEPIPELINEDEFINITION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy DataWritePipelineDefinition');
    return response.data;
  },
  async queryDataWritePipelineDefinitionsDto(filter?: GeneralCollectionFilter): Promise<IDataWritePipelineDefinitionListResponse> {
    return await queryList<IDataWritePipelineDefinition>(
      QUERY_DATAWRITEPIPELINEDEFINITIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default dataWritePipelineDefinitionService;
