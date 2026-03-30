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

import { FIND_WORKFLOWGROUP_DTO, QUERY_WORKFLOWGROUPS_DTO } from '../queries/workFlowGroup.queries';
import {
  IWorkFlowGroup,
  ICreateWorkFlowGroupInput,
  IWorkFlowGroupListResponse
} from '../types/workFlowGroup.types';

export const workFlowGroupService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WorkFlowGroup', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WorkFlowGroup');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWorkFlowGroupListResponse> {
    return await query_content<IWorkFlowGroup>({ schema: 'WorkFlowGroup', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WorkFlowGroup', filter });
    return response?.data || 0;
  },

  async createWorkFlowGroup(input: ICreateWorkFlowGroupInput): Promise<IWorkFlowGroup> {
    const response = await save_content({
      schema: 'WorkFlowGroup',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WorkFlowGroup');
    return response.data as IWorkFlowGroup;
  },

  async updateWorkFlowGroup(id: string, input: Partial<ICreateWorkFlowGroupInput>): Promise<IWorkFlowGroup> {
    const response = await update_partial_content({
      schema: 'WorkFlowGroup',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WorkFlowGroup');
    return response.data as IWorkFlowGroup;
  },

  async deleteWorkFlowGroup(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WorkFlowGroup',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWorkFlowGroup(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WorkFlowGroup',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWorkFlowGroup(id: string, locked: boolean = true): Promise<IWorkFlowGroup> {
    const response = await lock_content({
      schema: 'WorkFlowGroup',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WorkFlowGroup');
    return response.data as IWorkFlowGroup;
  },

  async findWorkFlowGroupDto(id: string): Promise<IWorkFlowGroup> {
    const response = await query<IWorkFlowGroup>(FIND_WORKFLOWGROUP_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WorkFlowGroup');
    return response.data;
  },
  async queryWorkFlowGroupsDto(filter?: GeneralCollectionFilter): Promise<IWorkFlowGroupListResponse> {
    return await queryList<IWorkFlowGroup>(
      QUERY_WORKFLOWGROUPS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default workFlowGroupService;
