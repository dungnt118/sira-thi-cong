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

import { FIND_ROLE_DTO, QUERY_ROLES_DTO } from '../queries/role.queries';
import {
  IRole,
  ICreateRoleInput,
  IRoleListResponse
} from '../types/role.types';

export const roleService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Role', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Role');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IRoleListResponse> {
    return await query_content<IRole>({ schema: 'Role', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Role', filter });
    return response?.data || 0;
  },

  async createRole(input: ICreateRoleInput): Promise<IRole> {
    const response = await save_content({
      schema: 'Role',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Role');
    return response.data as IRole;
  },

  async updateRole(id: string, input: Partial<ICreateRoleInput>): Promise<IRole> {
    const response = await update_partial_content({
      schema: 'Role',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Role');
    return response.data as IRole;
  },

  async deleteRole(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Role',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiRole(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Role',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockRole(id: string, locked: boolean = true): Promise<IRole> {
    const response = await lock_content({
      schema: 'Role',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Role');
    return response.data as IRole;
  },

  async findRoleDto(id: string): Promise<IRole> {
    const response = await query<IRole>(FIND_ROLE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Role');
    return response.data;
  },
  async queryRolesDto(filter?: GeneralCollectionFilter): Promise<IRoleListResponse> {
    return await queryList<IRole>(
      QUERY_ROLES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default roleService;
