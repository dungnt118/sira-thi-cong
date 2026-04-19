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

import { FIND_JOURNEY_DTO, QUERY_JOURNEYS_DTO } from '../queries/journey.queries';
import {
  IJourney,
  ICreateJourneyInput,
  IJourneyListResponse
} from '../types/journey.types';

export const journeyService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Journey', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Journey');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IJourneyListResponse> {
    return await query_content<IJourney>({ schema: 'Journey', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Journey', filter });
    return response?.data || 0;
  },

  async createJourney(input: ICreateJourneyInput): Promise<IJourney> {
    const response = await save_content({
      schema: 'Journey',
      data: input,
      update_if_duplicate: false
    });
    console.log('Backend Response createJourney:', response);
    const res = response as any;
    if (res.code !== 0 || !res.data) {
      console.error('Backend Reject createJourney:', res);
      throw new Error(res.message || 'Không thể tạo Journey');
    }
    return response.data as IJourney;
  },

  /** Lưu nhiều Journey — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManyJourneys(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'Journey',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt Journey');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt Journey (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateJourney(id: string, input: Partial<ICreateJourneyInput>): Promise<IJourney> {
    const response = await update_partial_content({
      schema: 'Journey',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Journey');
    return response.data as IJourney;
  },

  async deleteJourney(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Journey',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiJourney(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Journey',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockJourney(id: string, locked: boolean = true): Promise<IJourney> {
    const response = await lock_content({
      schema: 'Journey',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Journey');
    return response.data as IJourney;
  },

  async findJourneyDto(id: string): Promise<IJourney> {
    const response = await query<IJourney>(FIND_JOURNEY_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Journey');
    return response.data;
  },
  async queryJourneysDto(filter?: GeneralCollectionFilter): Promise<IJourneyListResponse> {
    return await queryList<IJourney>(
      QUERY_JOURNEYS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default journeyService;
