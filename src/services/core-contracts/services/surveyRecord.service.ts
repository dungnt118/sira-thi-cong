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

import { FIND_SURVEYRECORD_DTO, QUERY_SURVEYRECORDS_DTO } from '../queries/surveyRecord.queries';
import {
  ISurveyRecord,
  ICreateSurveyRecordInput,
  ISurveyRecordListResponse
} from '../types/surveyRecord.types';

export const surveyRecordService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SurveyRecord', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SurveyRecord');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISurveyRecordListResponse> {
    return await query_content<ISurveyRecord>({ schema: 'SurveyRecord', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SurveyRecord', filter });
    return response?.data || 0;
  },

  async createSurveyRecord(input: ICreateSurveyRecordInput): Promise<ISurveyRecord> {
    const response = await save_content({
      schema: 'SurveyRecord',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SurveyRecord');
    return response.data as ISurveyRecord;
  },

  /** Lưu nhiều SurveyRecord — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManySurveyRecords(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'SurveyRecord',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt SurveyRecord');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt SurveyRecord (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateSurveyRecord(id: string, input: Partial<ICreateSurveyRecordInput>): Promise<ISurveyRecord> {
    const response = await update_partial_content({
      schema: 'SurveyRecord',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SurveyRecord');
    return response.data as ISurveyRecord;
  },

  async deleteSurveyRecord(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SurveyRecord',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSurveyRecord(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SurveyRecord',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSurveyRecord(id: string, locked: boolean = true): Promise<ISurveyRecord> {
    const response = await lock_content({
      schema: 'SurveyRecord',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SurveyRecord');
    return response.data as ISurveyRecord;
  },

  async findSurveyRecordDto(id: string): Promise<ISurveyRecord> {
    const response = await query<ISurveyRecord>(FIND_SURVEYRECORD_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SurveyRecord');
    return response.data;
  },
  async querySurveyRecordsDto(filter?: GeneralCollectionFilter): Promise<ISurveyRecordListResponse> {
    return await queryList<ISurveyRecord>(
      QUERY_SURVEYRECORDS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default surveyRecordService;
