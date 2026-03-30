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

import { FIND_NOTIFICATIONOUTBOX_DTO, QUERY_NOTIFICATIONOUTBOXS_DTO } from '../queries/notificationOutbox.queries';
import {
  INotificationOutbox,
  ICreateNotificationOutboxInput,
  INotificationOutboxListResponse
} from '../types/notificationOutbox.types';

export const notificationOutboxService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'NotificationOutbox', _id: id });
    if (!response.data) throw new Error('Không tìm thấy NotificationOutbox');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<INotificationOutboxListResponse> {
    return await query_content<INotificationOutbox>({ schema: 'NotificationOutbox', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'NotificationOutbox', filter });
    return response?.data || 0;
  },

  async createNotificationOutbox(input: ICreateNotificationOutboxInput): Promise<INotificationOutbox> {
    const response = await save_content({
      schema: 'NotificationOutbox',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo NotificationOutbox');
    return response.data as INotificationOutbox;
  },

  async updateNotificationOutbox(id: string, input: Partial<ICreateNotificationOutboxInput>): Promise<INotificationOutbox> {
    const response = await update_partial_content({
      schema: 'NotificationOutbox',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật NotificationOutbox');
    return response.data as INotificationOutbox;
  },

  async deleteNotificationOutbox(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'NotificationOutbox',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiNotificationOutbox(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'NotificationOutbox',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockNotificationOutbox(id: string, locked: boolean = true): Promise<INotificationOutbox> {
    const response = await lock_content({
      schema: 'NotificationOutbox',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa NotificationOutbox');
    return response.data as INotificationOutbox;
  },

  async findNotificationOutboxDto(id: string): Promise<INotificationOutbox> {
    const response = await query<INotificationOutbox>(FIND_NOTIFICATIONOUTBOX_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy NotificationOutbox');
    return response.data;
  },
  async queryNotificationOutboxsDto(filter?: GeneralCollectionFilter): Promise<INotificationOutboxListResponse> {
    return await queryList<INotificationOutbox>(
      QUERY_NOTIFICATIONOUTBOXS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default notificationOutboxService;
