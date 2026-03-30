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

import { FIND_USERNOTIFICATIONITEM_DTO, QUERY_USERNOTIFICATIONITEMS_DTO } from '../queries/userNotificationItem.queries';
import {
  IUserNotificationItem,
  ICreateUserNotificationItemInput,
  IUserNotificationItemListResponse
} from '../types/userNotificationItem.types';

export const userNotificationItemService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'UserNotificationItem', _id: id });
    if (!response.data) throw new Error('Không tìm thấy UserNotificationItem');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IUserNotificationItemListResponse> {
    return await query_content<IUserNotificationItem>({ schema: 'UserNotificationItem', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'UserNotificationItem', filter });
    return response?.data || 0;
  },

  async createUserNotificationItem(input: ICreateUserNotificationItemInput): Promise<IUserNotificationItem> {
    const response = await save_content({
      schema: 'UserNotificationItem',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo UserNotificationItem');
    return response.data as IUserNotificationItem;
  },

  async updateUserNotificationItem(id: string, input: Partial<ICreateUserNotificationItemInput>): Promise<IUserNotificationItem> {
    const response = await update_partial_content({
      schema: 'UserNotificationItem',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật UserNotificationItem');
    return response.data as IUserNotificationItem;
  },

  async deleteUserNotificationItem(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'UserNotificationItem',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiUserNotificationItem(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'UserNotificationItem',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockUserNotificationItem(id: string, locked: boolean = true): Promise<IUserNotificationItem> {
    const response = await lock_content({
      schema: 'UserNotificationItem',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa UserNotificationItem');
    return response.data as IUserNotificationItem;
  },

  async findUserNotificationItemDto(id: string): Promise<IUserNotificationItem> {
    const response = await query<IUserNotificationItem>(FIND_USERNOTIFICATIONITEM_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy UserNotificationItem');
    return response.data;
  },
  async queryUserNotificationItemsDto(filter?: GeneralCollectionFilter): Promise<IUserNotificationItemListResponse> {
    return await queryList<IUserNotificationItem>(
      QUERY_USERNOTIFICATIONITEMS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default userNotificationItemService;
