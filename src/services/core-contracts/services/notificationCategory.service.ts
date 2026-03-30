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

import { FIND_NOTIFICATIONCATEGORY_DTO, QUERY_NOTIFICATIONCATEGORYS_DTO } from '../queries/notificationCategory.queries';
import {
  INotificationCategory,
  ICreateNotificationCategoryInput,
  INotificationCategoryListResponse
} from '../types/notificationCategory.types';

export const notificationCategoryService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'NotificationCategory', _id: id });
    if (!response.data) throw new Error('Không tìm thấy NotificationCategory');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<INotificationCategoryListResponse> {
    return await query_content<INotificationCategory>({ schema: 'NotificationCategory', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'NotificationCategory', filter });
    return response?.data || 0;
  },

  async createNotificationCategory(input: ICreateNotificationCategoryInput): Promise<INotificationCategory> {
    const response = await save_content({
      schema: 'NotificationCategory',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo NotificationCategory');
    return response.data as INotificationCategory;
  },

  async updateNotificationCategory(id: string, input: Partial<ICreateNotificationCategoryInput>): Promise<INotificationCategory> {
    const response = await update_partial_content({
      schema: 'NotificationCategory',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật NotificationCategory');
    return response.data as INotificationCategory;
  },

  async deleteNotificationCategory(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'NotificationCategory',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiNotificationCategory(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'NotificationCategory',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockNotificationCategory(id: string, locked: boolean = true): Promise<INotificationCategory> {
    const response = await lock_content({
      schema: 'NotificationCategory',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa NotificationCategory');
    return response.data as INotificationCategory;
  },

  async findNotificationCategoryDto(id: string): Promise<INotificationCategory> {
    const response = await query<INotificationCategory>(FIND_NOTIFICATIONCATEGORY_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy NotificationCategory');
    return response.data;
  },
  async queryNotificationCategorysDto(filter?: GeneralCollectionFilter): Promise<INotificationCategoryListResponse> {
    return await queryList<INotificationCategory>(
      QUERY_NOTIFICATIONCATEGORYS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default notificationCategoryService;
