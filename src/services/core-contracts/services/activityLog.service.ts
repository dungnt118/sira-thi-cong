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

import { FIND_ACTIVITYLOG_DTO, QUERY_ACTIVITYLOGS_DTO } from '../queries/activityLog.queries';
import {
  IActivityLog,
  ICreateActivityLogInput,
  IActivityLogListResponse
} from '../types/activityLog.types';

export const activityLogService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ActivityLog', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ActivityLog');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IActivityLogListResponse> {
    return await query_content<IActivityLog>({ schema: 'ActivityLog', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ActivityLog', filter });
    return response?.data || 0;
  },

  async createActivityLog(input: ICreateActivityLogInput): Promise<IActivityLog> {
    const response = await save_content({
      schema: 'ActivityLog',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ActivityLog');
    return response.data as IActivityLog;
  },

  async updateActivityLog(id: string, input: Partial<ICreateActivityLogInput>): Promise<IActivityLog> {
    const response = await update_partial_content({
      schema: 'ActivityLog',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ActivityLog');
    return response.data as IActivityLog;
  },

  async deleteActivityLog(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ActivityLog',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiActivityLog(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ActivityLog',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockActivityLog(id: string, locked: boolean = true): Promise<IActivityLog> {
    const response = await lock_content({
      schema: 'ActivityLog',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ActivityLog');
    return response.data as IActivityLog;
  },

  async findActivityLogDto(id: string): Promise<IActivityLog> {
    const response = await query<IActivityLog>(FIND_ACTIVITYLOG_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ActivityLog');
    return response.data;
  },
  async queryActivityLogsDto(filter?: GeneralCollectionFilter): Promise<IActivityLogListResponse> {
    return await queryList<IActivityLog>(
      QUERY_ACTIVITYLOGS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default activityLogService;
