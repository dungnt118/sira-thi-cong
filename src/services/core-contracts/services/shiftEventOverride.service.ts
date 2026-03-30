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

import { FIND_SHIFTEVENTOVERRIDE_DTO, QUERY_SHIFTEVENTOVERRIDES_DTO } from '../queries/shiftEventOverride.queries';
import {
  IShiftEventOverride,
  ICreateShiftEventOverrideInput,
  IShiftEventOverrideListResponse
} from '../types/shiftEventOverride.types';

export const shiftEventOverrideService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ShiftEventOverride', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ShiftEventOverride');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IShiftEventOverrideListResponse> {
    return await query_content<IShiftEventOverride>({ schema: 'ShiftEventOverride', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ShiftEventOverride', filter });
    return response?.data || 0;
  },

  async createShiftEventOverride(input: ICreateShiftEventOverrideInput): Promise<IShiftEventOverride> {
    const response = await save_content({
      schema: 'ShiftEventOverride',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ShiftEventOverride');
    return response.data as IShiftEventOverride;
  },

  async updateShiftEventOverride(id: string, input: Partial<ICreateShiftEventOverrideInput>): Promise<IShiftEventOverride> {
    const response = await update_partial_content({
      schema: 'ShiftEventOverride',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ShiftEventOverride');
    return response.data as IShiftEventOverride;
  },

  async deleteShiftEventOverride(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ShiftEventOverride',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiShiftEventOverride(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ShiftEventOverride',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockShiftEventOverride(id: string, locked: boolean = true): Promise<IShiftEventOverride> {
    const response = await lock_content({
      schema: 'ShiftEventOverride',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ShiftEventOverride');
    return response.data as IShiftEventOverride;
  },

  async findShiftEventOverrideDto(id: string): Promise<IShiftEventOverride> {
    const response = await query<IShiftEventOverride>(FIND_SHIFTEVENTOVERRIDE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ShiftEventOverride');
    return response.data;
  },
  async queryShiftEventOverridesDto(filter?: GeneralCollectionFilter): Promise<IShiftEventOverrideListResponse> {
    return await queryList<IShiftEventOverride>(
      QUERY_SHIFTEVENTOVERRIDES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default shiftEventOverrideService;
