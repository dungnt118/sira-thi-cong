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

import { FIND_SURVEYAPPOINTMENT_DTO, QUERY_SURVEYAPPOINTMENTS_DTO } from '../queries/surveyAppointment.queries';
import {
  ISurveyAppointment,
  ICreateSurveyAppointmentInput,
  ISurveyAppointmentListResponse
} from '../types/surveyAppointment.types';

export const surveyAppointmentService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SurveyAppointment', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SurveyAppointment');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISurveyAppointmentListResponse> {
    return await query_content<ISurveyAppointment>({ schema: 'SurveyAppointment', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SurveyAppointment', filter });
    return response?.data || 0;
  },

  async createSurveyAppointment(input: ICreateSurveyAppointmentInput): Promise<ISurveyAppointment> {
    const response = await save_content({
      schema: 'SurveyAppointment',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SurveyAppointment');
    return response.data as ISurveyAppointment;
  },

  /** Lưu nhiều SurveyAppointment — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManySurveyAppointments(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'SurveyAppointment',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt SurveyAppointment');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt SurveyAppointment (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateSurveyAppointment(id: string, input: Partial<ICreateSurveyAppointmentInput>): Promise<ISurveyAppointment> {
    const response = await update_partial_content({
      schema: 'SurveyAppointment',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SurveyAppointment');
    return response.data as ISurveyAppointment;
  },

  async deleteSurveyAppointment(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SurveyAppointment',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSurveyAppointment(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SurveyAppointment',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSurveyAppointment(id: string, locked: boolean = true): Promise<ISurveyAppointment> {
    const response = await lock_content({
      schema: 'SurveyAppointment',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SurveyAppointment');
    return response.data as ISurveyAppointment;
  },

  async findSurveyAppointmentDto(id: string): Promise<ISurveyAppointment> {
    const response = await query<ISurveyAppointment>(FIND_SURVEYAPPOINTMENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SurveyAppointment');
    return response.data;
  },
  async querySurveyAppointmentsDto(filter?: GeneralCollectionFilter): Promise<ISurveyAppointmentListResponse> {
    return await queryList<ISurveyAppointment>(
      QUERY_SURVEYAPPOINTMENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default surveyAppointmentService;
