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

import { FIND_SHIFTRULESCONFIG_DTO, QUERY_SHIFTRULESCONFIGS_DTO } from '../queries/shiftRulesConfig.queries';
import {
  IShiftRulesConfig,
  ICreateShiftRulesConfigInput,
  IShiftRulesConfigListResponse
} from '../types/shiftRulesConfig.types';

export const shiftRulesConfigService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ShiftRulesConfig', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ShiftRulesConfig');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IShiftRulesConfigListResponse> {
    return await query_content<IShiftRulesConfig>({ schema: 'ShiftRulesConfig', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ShiftRulesConfig', filter });
    return response?.data || 0;
  },

  async createShiftRulesConfig(input: ICreateShiftRulesConfigInput): Promise<IShiftRulesConfig> {
    const response = await save_content({
      schema: 'ShiftRulesConfig',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ShiftRulesConfig');
    return response.data as IShiftRulesConfig;
  },

  async updateShiftRulesConfig(id: string, input: Partial<ICreateShiftRulesConfigInput>): Promise<IShiftRulesConfig> {
    const response = await update_partial_content({
      schema: 'ShiftRulesConfig',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ShiftRulesConfig');
    return response.data as IShiftRulesConfig;
  },

  async deleteShiftRulesConfig(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ShiftRulesConfig',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiShiftRulesConfig(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ShiftRulesConfig',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockShiftRulesConfig(id: string, locked: boolean = true): Promise<IShiftRulesConfig> {
    const response = await lock_content({
      schema: 'ShiftRulesConfig',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ShiftRulesConfig');
    return response.data as IShiftRulesConfig;
  },

  async findShiftRulesConfigDto(id: string): Promise<IShiftRulesConfig> {
    const response = await query<IShiftRulesConfig>(FIND_SHIFTRULESCONFIG_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ShiftRulesConfig');
    return response.data;
  },
  async queryShiftRulesConfigsDto(filter?: GeneralCollectionFilter): Promise<IShiftRulesConfigListResponse> {
    return await queryList<IShiftRulesConfig>(
      QUERY_SHIFTRULESCONFIGS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default shiftRulesConfigService;
