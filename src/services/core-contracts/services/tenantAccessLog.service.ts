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

import { FIND_TENANTACCESSLOG_DTO, QUERY_TENANTACCESSLOGS_DTO } from '../queries/tenantAccessLog.queries';
import {
  ITenantAccessLog,
  ICreateTenantAccessLogInput,
  ITenantAccessLogListResponse
} from '../types/tenantAccessLog.types';

export const tenantAccessLogService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'TenantAccessLog', _id: id });
    if (!response.data) throw new Error('Không tìm thấy TenantAccessLog');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ITenantAccessLogListResponse> {
    return await query_content<ITenantAccessLog>({ schema: 'TenantAccessLog', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'TenantAccessLog', filter });
    return response?.data || 0;
  },

  async createTenantAccessLog(input: ICreateTenantAccessLogInput): Promise<ITenantAccessLog> {
    const response = await save_content({
      schema: 'TenantAccessLog',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo TenantAccessLog');
    return response.data as ITenantAccessLog;
  },

  async updateTenantAccessLog(id: string, input: Partial<ICreateTenantAccessLogInput>): Promise<ITenantAccessLog> {
    const response = await update_partial_content({
      schema: 'TenantAccessLog',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật TenantAccessLog');
    return response.data as ITenantAccessLog;
  },

  async deleteTenantAccessLog(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'TenantAccessLog',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiTenantAccessLog(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'TenantAccessLog',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockTenantAccessLog(id: string, locked: boolean = true): Promise<ITenantAccessLog> {
    const response = await lock_content({
      schema: 'TenantAccessLog',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa TenantAccessLog');
    return response.data as ITenantAccessLog;
  },

  async findTenantAccessLogDto(id: string): Promise<ITenantAccessLog> {
    const response = await query<ITenantAccessLog>(FIND_TENANTACCESSLOG_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy TenantAccessLog');
    return response.data;
  },
  async queryTenantAccessLogsDto(filter?: GeneralCollectionFilter): Promise<ITenantAccessLogListResponse> {
    return await queryList<ITenantAccessLog>(
      QUERY_TENANTACCESSLOGS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default tenantAccessLogService;
