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

import { FIND_ORGMEMBERSHIP_DTO, QUERY_ORGMEMBERSHIPS_DTO } from '../queries/orgMembership.queries';
import {
  IOrgMembership,
  ICreateOrgMembershipInput,
  IOrgMembershipListResponse
} from '../types/orgMembership.types';

export const orgMembershipService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'OrgMembership', _id: id });
    if (!response.data) throw new Error('Không tìm thấy OrgMembership');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IOrgMembershipListResponse> {
    return await query_content<IOrgMembership>({ schema: 'OrgMembership', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'OrgMembership', filter });
    return response?.data || 0;
  },

  async createOrgMembership(input: ICreateOrgMembershipInput): Promise<IOrgMembership> {
    const response = await save_content({
      schema: 'OrgMembership',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo OrgMembership');
    return response.data as IOrgMembership;
  },

  async updateOrgMembership(id: string, input: Partial<ICreateOrgMembershipInput>): Promise<IOrgMembership> {
    const response = await update_partial_content({
      schema: 'OrgMembership',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật OrgMembership');
    return response.data as IOrgMembership;
  },

  async deleteOrgMembership(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'OrgMembership',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiOrgMembership(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'OrgMembership',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockOrgMembership(id: string, locked: boolean = true): Promise<IOrgMembership> {
    const response = await lock_content({
      schema: 'OrgMembership',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa OrgMembership');
    return response.data as IOrgMembership;
  },

  async findOrgMembershipDto(id: string): Promise<IOrgMembership> {
    const response = await query<IOrgMembership>(FIND_ORGMEMBERSHIP_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy OrgMembership');
    return response.data;
  },
  async queryOrgMembershipsDto(filter?: GeneralCollectionFilter): Promise<IOrgMembershipListResponse> {
    return await queryList<IOrgMembership>(
      QUERY_ORGMEMBERSHIPS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default orgMembershipService;
