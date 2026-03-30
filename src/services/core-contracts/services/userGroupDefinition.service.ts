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

import { FIND_USERGROUPDEFINITION_DTO, QUERY_USERGROUPDEFINITIONS_DTO } from '../queries/userGroupDefinition.queries';
import {
  IUserGroupDefinition,
  ICreateUserGroupDefinitionInput,
  IUserGroupDefinitionListResponse
} from '../types/userGroupDefinition.types';

export const userGroupDefinitionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'UserGroupDefinition', _id: id });
    if (!response.data) throw new Error('Không tìm thấy UserGroupDefinition');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IUserGroupDefinitionListResponse> {
    return await query_content<IUserGroupDefinition>({ schema: 'UserGroupDefinition', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'UserGroupDefinition', filter });
    return response?.data || 0;
  },

  async createUserGroupDefinition(input: ICreateUserGroupDefinitionInput): Promise<IUserGroupDefinition> {
    const response = await save_content({
      schema: 'UserGroupDefinition',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo UserGroupDefinition');
    return response.data as IUserGroupDefinition;
  },

  async updateUserGroupDefinition(id: string, input: Partial<ICreateUserGroupDefinitionInput>): Promise<IUserGroupDefinition> {
    const response = await update_partial_content({
      schema: 'UserGroupDefinition',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật UserGroupDefinition');
    return response.data as IUserGroupDefinition;
  },

  async deleteUserGroupDefinition(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'UserGroupDefinition',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiUserGroupDefinition(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'UserGroupDefinition',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockUserGroupDefinition(id: string, locked: boolean = true): Promise<IUserGroupDefinition> {
    const response = await lock_content({
      schema: 'UserGroupDefinition',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa UserGroupDefinition');
    return response.data as IUserGroupDefinition;
  },

  async findUserGroupDefinitionDto(id: string): Promise<IUserGroupDefinition> {
    const response = await query<IUserGroupDefinition>(FIND_USERGROUPDEFINITION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy UserGroupDefinition');
    return response.data;
  },
  async queryUserGroupDefinitionsDto(filter?: GeneralCollectionFilter): Promise<IUserGroupDefinitionListResponse> {
    return await queryList<IUserGroupDefinition>(
      QUERY_USERGROUPDEFINITIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default userGroupDefinitionService;
