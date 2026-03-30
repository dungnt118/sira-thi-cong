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

import { FIND_ROLETYPE_DTO, QUERY_ROLETYPES_DTO } from '../queries/roleType.queries';
import {
  IRoleType,
  ICreateRoleTypeInput,
  IRoleTypeListResponse
} from '../types/roleType.types';

export const roleTypeService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'RoleType', _id: id });
    if (!response.data) throw new Error('Không tìm thấy RoleType');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IRoleTypeListResponse> {
    return await query_content<IRoleType>({ schema: 'RoleType', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'RoleType', filter });
    return response?.data || 0;
  },

  async createRoleType(input: ICreateRoleTypeInput): Promise<IRoleType> {
    const response = await save_content({
      schema: 'RoleType',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo RoleType');
    return response.data as IRoleType;
  },

  async updateRoleType(id: string, input: Partial<ICreateRoleTypeInput>): Promise<IRoleType> {
    const response = await update_partial_content({
      schema: 'RoleType',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật RoleType');
    return response.data as IRoleType;
  },

  async deleteRoleType(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'RoleType',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiRoleType(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'RoleType',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockRoleType(id: string, locked: boolean = true): Promise<IRoleType> {
    const response = await lock_content({
      schema: 'RoleType',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa RoleType');
    return response.data as IRoleType;
  },

  async findRoleTypeDto(id: string): Promise<IRoleType> {
    const response = await query<IRoleType>(FIND_ROLETYPE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy RoleType');
    return response.data;
  },
  async queryRoleTypesDto(filter?: GeneralCollectionFilter): Promise<IRoleTypeListResponse> {
    return await queryList<IRoleType>(
      QUERY_ROLETYPES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default roleTypeService;
