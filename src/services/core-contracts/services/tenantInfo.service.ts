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

import { FIND_TENANTINFO_DTO, QUERY_TENANTINFOS_DTO } from '../queries/tenantInfo.queries';
import {
  ITenantInfo,
  ICreateTenantInfoInput,
  ITenantInfoListResponse
} from '../types/tenantInfo.types';

export const tenantInfoService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'TenantInfo', _id: id });
    if (!response.data) throw new Error('Không tìm thấy TenantInfo');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ITenantInfoListResponse> {
    return await query_content<ITenantInfo>({ schema: 'TenantInfo', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'TenantInfo', filter });
    return response?.data || 0;
  },

  async createTenantInfo(input: ICreateTenantInfoInput): Promise<ITenantInfo> {
    const response = await save_content({
      schema: 'TenantInfo',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo TenantInfo');
    return response.data as ITenantInfo;
  },

  async updateTenantInfo(id: string, input: Partial<ICreateTenantInfoInput>): Promise<ITenantInfo> {
    const response = await update_partial_content({
      schema: 'TenantInfo',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật TenantInfo');
    return response.data as ITenantInfo;
  },

  async deleteTenantInfo(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'TenantInfo',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiTenantInfo(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'TenantInfo',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockTenantInfo(id: string, locked: boolean = true): Promise<ITenantInfo> {
    const response = await lock_content({
      schema: 'TenantInfo',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa TenantInfo');
    return response.data as ITenantInfo;
  },

  async findTenantInfoDto(id: string): Promise<ITenantInfo> {
    const response = await query<ITenantInfo>(FIND_TENANTINFO_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy TenantInfo');
    return response.data;
  },
  async queryTenantInfosDto(filter?: GeneralCollectionFilter): Promise<ITenantInfoListResponse> {
    return await queryList<ITenantInfo>(
      QUERY_TENANTINFOS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default tenantInfoService;
