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

import { FIND_WORKFLOW_DTO, QUERY_WORKFLOWS_DTO } from '../queries/workFlow.queries';
import {
  IWorkFlow,
  ICreateWorkFlowInput,
  IWorkFlowListResponse
} from '../types/workFlow.types';

export const workFlowService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WorkFlow', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WorkFlow');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWorkFlowListResponse> {
    return await query_content<IWorkFlow>({ schema: 'WorkFlow', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WorkFlow', filter });
    return response?.data || 0;
  },

  async createWorkFlow(input: ICreateWorkFlowInput): Promise<IWorkFlow> {
    const response = await save_content({
      schema: 'WorkFlow',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WorkFlow');
    return response.data as IWorkFlow;
  },

  async updateWorkFlow(id: string, input: Partial<ICreateWorkFlowInput>): Promise<IWorkFlow> {
    const response = await update_partial_content({
      schema: 'WorkFlow',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WorkFlow');
    return response.data as IWorkFlow;
  },

  async deleteWorkFlow(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WorkFlow',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWorkFlow(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WorkFlow',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWorkFlow(id: string, locked: boolean = true): Promise<IWorkFlow> {
    const response = await lock_content({
      schema: 'WorkFlow',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WorkFlow');
    return response.data as IWorkFlow;
  },

  async findWorkFlowDto(id: string): Promise<IWorkFlow> {
    const response = await query<IWorkFlow>(FIND_WORKFLOW_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WorkFlow');
    return response.data;
  },
  async queryWorkFlowsDto(filter?: GeneralCollectionFilter): Promise<IWorkFlowListResponse> {
    return await queryList<IWorkFlow>(
      QUERY_WORKFLOWS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default workFlowService;
