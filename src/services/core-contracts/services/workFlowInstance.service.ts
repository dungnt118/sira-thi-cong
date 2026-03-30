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

import { FIND_WORKFLOWINSTANCE_DTO, QUERY_WORKFLOWINSTANCES_DTO } from '../queries/workFlowInstance.queries';
import {
  IWorkFlowInstance,
  ICreateWorkFlowInstanceInput,
  IWorkFlowInstanceListResponse
} from '../types/workFlowInstance.types';

export const workFlowInstanceService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WorkFlowInstance', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WorkFlowInstance');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWorkFlowInstanceListResponse> {
    return await query_content<IWorkFlowInstance>({ schema: 'WorkFlowInstance', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WorkFlowInstance', filter });
    return response?.data || 0;
  },

  async createWorkFlowInstance(input: ICreateWorkFlowInstanceInput): Promise<IWorkFlowInstance> {
    const response = await save_content({
      schema: 'WorkFlowInstance',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WorkFlowInstance');
    return response.data as IWorkFlowInstance;
  },

  async updateWorkFlowInstance(id: string, input: Partial<ICreateWorkFlowInstanceInput>): Promise<IWorkFlowInstance> {
    const response = await update_partial_content({
      schema: 'WorkFlowInstance',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WorkFlowInstance');
    return response.data as IWorkFlowInstance;
  },

  async deleteWorkFlowInstance(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WorkFlowInstance',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWorkFlowInstance(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WorkFlowInstance',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWorkFlowInstance(id: string, locked: boolean = true): Promise<IWorkFlowInstance> {
    const response = await lock_content({
      schema: 'WorkFlowInstance',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WorkFlowInstance');
    return response.data as IWorkFlowInstance;
  },

  async findWorkFlowInstanceDto(id: string): Promise<IWorkFlowInstance> {
    const response = await query<IWorkFlowInstance>(FIND_WORKFLOWINSTANCE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WorkFlowInstance');
    return response.data;
  },
  async queryWorkFlowInstancesDto(filter?: GeneralCollectionFilter): Promise<IWorkFlowInstanceListResponse> {
    return await queryList<IWorkFlowInstance>(
      QUERY_WORKFLOWINSTANCES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default workFlowInstanceService;
