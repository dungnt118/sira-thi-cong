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

import { FIND_NOTIFICATIONDELIVERYLOG_DTO, QUERY_NOTIFICATIONDELIVERYLOGS_DTO } from '../queries/notificationDeliveryLog.queries';
import {
  INotificationDeliveryLog,
  ICreateNotificationDeliveryLogInput,
  INotificationDeliveryLogListResponse
} from '../types/notificationDeliveryLog.types';

export const notificationDeliveryLogService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'NotificationDeliveryLog', _id: id });
    if (!response.data) throw new Error('Không tìm thấy NotificationDeliveryLog');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<INotificationDeliveryLogListResponse> {
    return await query_content<INotificationDeliveryLog>({ schema: 'NotificationDeliveryLog', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'NotificationDeliveryLog', filter });
    return response?.data || 0;
  },

  async createNotificationDeliveryLog(input: ICreateNotificationDeliveryLogInput): Promise<INotificationDeliveryLog> {
    const response = await save_content({
      schema: 'NotificationDeliveryLog',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo NotificationDeliveryLog');
    return response.data as INotificationDeliveryLog;
  },

  async updateNotificationDeliveryLog(id: string, input: Partial<ICreateNotificationDeliveryLogInput>): Promise<INotificationDeliveryLog> {
    const response = await update_partial_content({
      schema: 'NotificationDeliveryLog',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật NotificationDeliveryLog');
    return response.data as INotificationDeliveryLog;
  },

  async deleteNotificationDeliveryLog(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'NotificationDeliveryLog',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiNotificationDeliveryLog(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'NotificationDeliveryLog',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockNotificationDeliveryLog(id: string, locked: boolean = true): Promise<INotificationDeliveryLog> {
    const response = await lock_content({
      schema: 'NotificationDeliveryLog',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa NotificationDeliveryLog');
    return response.data as INotificationDeliveryLog;
  },

  async findNotificationDeliveryLogDto(id: string): Promise<INotificationDeliveryLog> {
    const response = await query<INotificationDeliveryLog>(FIND_NOTIFICATIONDELIVERYLOG_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy NotificationDeliveryLog');
    return response.data;
  },
  async queryNotificationDeliveryLogsDto(filter?: GeneralCollectionFilter): Promise<INotificationDeliveryLogListResponse> {
    return await queryList<INotificationDeliveryLog>(
      QUERY_NOTIFICATIONDELIVERYLOGS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default notificationDeliveryLogService;
