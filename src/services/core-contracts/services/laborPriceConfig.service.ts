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

import { FIND_LABORPRICECONFIG_DTO, QUERY_LABORPRICECONFIGS_DTO } from '../queries/laborPriceConfig.queries';
import {
  ILaborPriceConfig,
  ICreateLaborPriceConfigInput,
  ILaborPriceConfigListResponse
} from '../types/laborPriceConfig.types';

export const laborPriceConfigService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'LaborPriceConfig', _id: id });
    if (!response.data) throw new Error('Không tìm thấy LaborPriceConfig');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ILaborPriceConfigListResponse> {
    return await query_content<ILaborPriceConfig>({ schema: 'LaborPriceConfig', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'LaborPriceConfig', filter });
    return response?.data || 0;
  },

  async createLaborPriceConfig(input: ICreateLaborPriceConfigInput): Promise<ILaborPriceConfig> {
    const response = await save_content({
      schema: 'LaborPriceConfig',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo LaborPriceConfig');
    return response.data as ILaborPriceConfig;
  },

  async updateLaborPriceConfig(id: string, input: Partial<ICreateLaborPriceConfigInput>): Promise<ILaborPriceConfig> {
    const response = await update_partial_content({
      schema: 'LaborPriceConfig',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật LaborPriceConfig');
    return response.data as ILaborPriceConfig;
  },

  async deleteLaborPriceConfig(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'LaborPriceConfig',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiLaborPriceConfig(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'LaborPriceConfig',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockLaborPriceConfig(id: string, locked: boolean = true): Promise<ILaborPriceConfig> {
    const response = await lock_content({
      schema: 'LaborPriceConfig',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa LaborPriceConfig');
    return response.data as ILaborPriceConfig;
  },

  async findLaborPriceConfigDto(id: string): Promise<ILaborPriceConfig> {
    const response = await query<ILaborPriceConfig>(FIND_LABORPRICECONFIG_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy LaborPriceConfig');
    return response.data;
  },
  async queryLaborPriceConfigsDto(filter?: GeneralCollectionFilter): Promise<ILaborPriceConfigListResponse> {
    return await queryList<ILaborPriceConfig>(
      QUERY_LABORPRICECONFIGS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default laborPriceConfigService;
