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

import { FIND_SYSTEMFIELDGROUP_DTO, QUERY_SYSTEMFIELDGROUPS_DTO } from '../queries/systemFieldGroup.queries';
import {
  ISystemFieldGroup,
  ICreateSystemFieldGroupInput,
  ISystemFieldGroupListResponse
} from '../types/systemFieldGroup.types';

export const systemFieldGroupService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SystemFieldGroup', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SystemFieldGroup');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISystemFieldGroupListResponse> {
    return await query_content<ISystemFieldGroup>({ schema: 'SystemFieldGroup', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SystemFieldGroup', filter });
    return response?.data || 0;
  },

  async createSystemFieldGroup(input: ICreateSystemFieldGroupInput): Promise<ISystemFieldGroup> {
    const response = await save_content({
      schema: 'SystemFieldGroup',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SystemFieldGroup');
    return response.data as ISystemFieldGroup;
  },

  async updateSystemFieldGroup(id: string, input: Partial<ICreateSystemFieldGroupInput>): Promise<ISystemFieldGroup> {
    const response = await update_partial_content({
      schema: 'SystemFieldGroup',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SystemFieldGroup');
    return response.data as ISystemFieldGroup;
  },

  async deleteSystemFieldGroup(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SystemFieldGroup',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSystemFieldGroup(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SystemFieldGroup',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSystemFieldGroup(id: string, locked: boolean = true): Promise<ISystemFieldGroup> {
    const response = await lock_content({
      schema: 'SystemFieldGroup',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SystemFieldGroup');
    return response.data as ISystemFieldGroup;
  },

  async findSystemFieldGroupDto(id: string): Promise<ISystemFieldGroup> {
    const response = await query<ISystemFieldGroup>(FIND_SYSTEMFIELDGROUP_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SystemFieldGroup');
    return response.data;
  },
  async querySystemFieldGroupsDto(filter?: GeneralCollectionFilter): Promise<ISystemFieldGroupListResponse> {
    return await queryList<ISystemFieldGroup>(
      QUERY_SYSTEMFIELDGROUPS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default systemFieldGroupService;
