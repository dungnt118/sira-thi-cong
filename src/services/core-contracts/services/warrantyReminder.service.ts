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

import { FIND_WARRANTYREMINDER_DTO, QUERY_WARRANTYREMINDERS_DTO } from '../queries/warrantyReminder.queries';
import {
  IWarrantyReminder,
  ICreateWarrantyReminderInput,
  IWarrantyReminderListResponse
} from '../types/warrantyReminder.types';

export const warrantyReminderService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WarrantyReminder', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WarrantyReminder');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWarrantyReminderListResponse> {
    return await query_content<IWarrantyReminder>({ schema: 'WarrantyReminder', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WarrantyReminder', filter });
    return response?.data || 0;
  },

  async createWarrantyReminder(input: ICreateWarrantyReminderInput): Promise<IWarrantyReminder> {
    const response = await save_content({
      schema: 'WarrantyReminder',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WarrantyReminder');
    return response.data as IWarrantyReminder;
  },

  async updateWarrantyReminder(id: string, input: Partial<ICreateWarrantyReminderInput>): Promise<IWarrantyReminder> {
    const response = await update_partial_content({
      schema: 'WarrantyReminder',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WarrantyReminder');
    return response.data as IWarrantyReminder;
  },

  async deleteWarrantyReminder(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WarrantyReminder',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWarrantyReminder(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WarrantyReminder',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWarrantyReminder(id: string, locked: boolean = true): Promise<IWarrantyReminder> {
    const response = await lock_content({
      schema: 'WarrantyReminder',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WarrantyReminder');
    return response.data as IWarrantyReminder;
  },

  async findWarrantyReminderDto(id: string): Promise<IWarrantyReminder> {
    const response = await query<IWarrantyReminder>(FIND_WARRANTYREMINDER_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WarrantyReminder');
    return response.data;
  },
  async queryWarrantyRemindersDto(filter?: GeneralCollectionFilter): Promise<IWarrantyReminderListResponse> {
    return await queryList<IWarrantyReminder>(
      QUERY_WARRANTYREMINDERS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default warrantyReminderService;
