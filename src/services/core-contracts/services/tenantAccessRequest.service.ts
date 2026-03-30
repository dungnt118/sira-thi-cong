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

import { FIND_TENANTACCESSREQUEST_DTO, QUERY_TENANTACCESSREQUESTS_DTO } from '../queries/tenantAccessRequest.queries';
import {
  ITenantAccessRequest,
  ICreateTenantAccessRequestInput,
  ITenantAccessRequestListResponse
} from '../types/tenantAccessRequest.types';

export const tenantAccessRequestService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'TenantAccessRequest', _id: id });
    if (!response.data) throw new Error('Không tìm thấy TenantAccessRequest');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ITenantAccessRequestListResponse> {
    return await query_content<ITenantAccessRequest>({ schema: 'TenantAccessRequest', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'TenantAccessRequest', filter });
    return response?.data || 0;
  },

  async createTenantAccessRequest(input: ICreateTenantAccessRequestInput): Promise<ITenantAccessRequest> {
    const response = await save_content({
      schema: 'TenantAccessRequest',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo TenantAccessRequest');
    return response.data as ITenantAccessRequest;
  },

  async updateTenantAccessRequest(id: string, input: Partial<ICreateTenantAccessRequestInput>): Promise<ITenantAccessRequest> {
    const response = await update_partial_content({
      schema: 'TenantAccessRequest',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật TenantAccessRequest');
    return response.data as ITenantAccessRequest;
  },

  async deleteTenantAccessRequest(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'TenantAccessRequest',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiTenantAccessRequest(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'TenantAccessRequest',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockTenantAccessRequest(id: string, locked: boolean = true): Promise<ITenantAccessRequest> {
    const response = await lock_content({
      schema: 'TenantAccessRequest',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa TenantAccessRequest');
    return response.data as ITenantAccessRequest;
  },

  async findTenantAccessRequestDto(id: string): Promise<ITenantAccessRequest> {
    const response = await query<ITenantAccessRequest>(FIND_TENANTACCESSREQUEST_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy TenantAccessRequest');
    return response.data;
  },
  async queryTenantAccessRequestsDto(filter?: GeneralCollectionFilter): Promise<ITenantAccessRequestListResponse> {
    return await queryList<ITenantAccessRequest>(
      QUERY_TENANTACCESSREQUESTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default tenantAccessRequestService;
