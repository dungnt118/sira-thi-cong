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

import { FIND_PERMISSIONDEFINITION_DTO, QUERY_PERMISSIONDEFINITIONS_DTO } from '../queries/permissionDefinition.queries';
import {
  IPermissionDefinition,
  ICreatePermissionDefinitionInput,
  IPermissionDefinitionListResponse
} from '../types/permissionDefinition.types';

export const permissionDefinitionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PermissionDefinition', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PermissionDefinition');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPermissionDefinitionListResponse> {
    return await query_content<IPermissionDefinition>({ schema: 'PermissionDefinition', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PermissionDefinition', filter });
    return response?.data || 0;
  },

  async createPermissionDefinition(input: ICreatePermissionDefinitionInput): Promise<IPermissionDefinition> {
    const response = await save_content({
      schema: 'PermissionDefinition',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PermissionDefinition');
    return response.data as IPermissionDefinition;
  },

  async updatePermissionDefinition(id: string, input: Partial<ICreatePermissionDefinitionInput>): Promise<IPermissionDefinition> {
    const response = await update_partial_content({
      schema: 'PermissionDefinition',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PermissionDefinition');
    return response.data as IPermissionDefinition;
  },

  async deletePermissionDefinition(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PermissionDefinition',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPermissionDefinition(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PermissionDefinition',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPermissionDefinition(id: string, locked: boolean = true): Promise<IPermissionDefinition> {
    const response = await lock_content({
      schema: 'PermissionDefinition',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PermissionDefinition');
    return response.data as IPermissionDefinition;
  },

  async findPermissionDefinitionDto(id: string): Promise<IPermissionDefinition> {
    const response = await query<IPermissionDefinition>(FIND_PERMISSIONDEFINITION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PermissionDefinition');
    return response.data;
  },
  async queryPermissionDefinitionsDto(filter?: GeneralCollectionFilter): Promise<IPermissionDefinitionListResponse> {
    return await queryList<IPermissionDefinition>(
      QUERY_PERMISSIONDEFINITIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default permissionDefinitionService;
