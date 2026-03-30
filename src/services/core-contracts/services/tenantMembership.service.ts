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

import { FIND_TENANTMEMBERSHIP_DTO, QUERY_TENANTMEMBERSHIPS_DTO } from '../queries/tenantMembership.queries';
import {
  ITenantMembership,
  ICreateTenantMembershipInput,
  ITenantMembershipListResponse
} from '../types/tenantMembership.types';

export const tenantMembershipService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'TenantMembership', _id: id });
    if (!response.data) throw new Error('Không tìm thấy TenantMembership');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ITenantMembershipListResponse> {
    return await query_content<ITenantMembership>({ schema: 'TenantMembership', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'TenantMembership', filter });
    return response?.data || 0;
  },

  async createTenantMembership(input: ICreateTenantMembershipInput): Promise<ITenantMembership> {
    const response = await save_content({
      schema: 'TenantMembership',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo TenantMembership');
    return response.data as ITenantMembership;
  },

  async updateTenantMembership(id: string, input: Partial<ICreateTenantMembershipInput>): Promise<ITenantMembership> {
    const response = await update_partial_content({
      schema: 'TenantMembership',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật TenantMembership');
    return response.data as ITenantMembership;
  },

  async deleteTenantMembership(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'TenantMembership',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiTenantMembership(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'TenantMembership',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockTenantMembership(id: string, locked: boolean = true): Promise<ITenantMembership> {
    const response = await lock_content({
      schema: 'TenantMembership',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa TenantMembership');
    return response.data as ITenantMembership;
  },

  async findTenantMembershipDto(id: string): Promise<ITenantMembership> {
    const response = await query<ITenantMembership>(FIND_TENANTMEMBERSHIP_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy TenantMembership');
    return response.data;
  },
  async queryTenantMembershipsDto(filter?: GeneralCollectionFilter): Promise<ITenantMembershipListResponse> {
    return await queryList<ITenantMembership>(
      QUERY_TENANTMEMBERSHIPS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default tenantMembershipService;
