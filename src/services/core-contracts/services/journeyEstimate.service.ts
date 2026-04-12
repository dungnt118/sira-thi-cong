import { query, queryList } from 'app/services/graphqlService'; // TODO: Check path
import { GeneralCollectionFilter } from 'types/filters/GeneralCollectionFilter';
import {
  find_content,
  query_content,
  count_content,
  save_content,
  save_many_content,
  update_partial_content,
  delete_content,
  delete_multi_content,
  lock_content
} from 'app/store/actions/data/data.action'; // TODO: Check path

import { FIND_JOURNEYESTIMATE_DTO, QUERY_JOURNEYESTIMATES_DTO } from '../queries/journeyEstimate.queries';
import {
  IJourneyEstimate,
  ICreateJourneyEstimateInput,
  IJourneyEstimateListResponse
} from '../types/journeyEstimate.types';

export const journeyEstimateService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'JourneyEstimate', _id: id });
    if (!response.data) throw new Error('Không tìm thấy JourneyEstimate');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IJourneyEstimateListResponse> {
    return await query_content<IJourneyEstimate>({ schema: 'JourneyEstimate', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'JourneyEstimate', filter });
    return response?.data || 0;
  },

  async createJourneyEstimate(input: ICreateJourneyEstimateInput): Promise<IJourneyEstimate> {
    const response = await save_content({
      schema: 'JourneyEstimate',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo JourneyEstimate');
    return response.data as IJourneyEstimate;
  },

  /** Lưu nhiều JourneyEstimate — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManyJourneyEstimates(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'JourneyEstimate',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt JourneyEstimate');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt JourneyEstimate (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateJourneyEstimate(id: string, input: Partial<ICreateJourneyEstimateInput>): Promise<IJourneyEstimate> {
    const response = await update_partial_content({
      schema: 'JourneyEstimate',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật JourneyEstimate');
    return response.data as IJourneyEstimate;
  },

  async deleteJourneyEstimate(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'JourneyEstimate',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiJourneyEstimate(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'JourneyEstimate',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockJourneyEstimate(id: string, locked: boolean = true): Promise<IJourneyEstimate> {
    const response = await lock_content({
      schema: 'JourneyEstimate',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa JourneyEstimate');
    return response.data as IJourneyEstimate;
  },

  async findJourneyEstimateDto(id: string): Promise<IJourneyEstimate> {
    const response = await query<IJourneyEstimate>(FIND_JOURNEYESTIMATE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy JourneyEstimate');
    return response.data;
  },
  async queryJourneyEstimatesDto(filter?: GeneralCollectionFilter): Promise<IJourneyEstimateListResponse> {
    return await queryList<IJourneyEstimate>(
      QUERY_JOURNEYESTIMATES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default journeyEstimateService;
