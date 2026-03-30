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

import { FIND_ATTENDANCEADJUSTMENTREQUEST_DTO, QUERY_ATTENDANCEADJUSTMENTREQUESTS_DTO } from '../queries/attendanceAdjustmentRequest.queries';
import {
  IAttendanceAdjustmentRequest,
  ICreateAttendanceAdjustmentRequestInput,
  IAttendanceAdjustmentRequestListResponse
} from '../types/attendanceAdjustmentRequest.types';

export const attendanceAdjustmentRequestService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AttendanceAdjustmentRequest', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AttendanceAdjustmentRequest');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAttendanceAdjustmentRequestListResponse> {
    return await query_content<IAttendanceAdjustmentRequest>({ schema: 'AttendanceAdjustmentRequest', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AttendanceAdjustmentRequest', filter });
    return response?.data || 0;
  },

  async createAttendanceAdjustmentRequest(input: ICreateAttendanceAdjustmentRequestInput): Promise<IAttendanceAdjustmentRequest> {
    const response = await save_content({
      schema: 'AttendanceAdjustmentRequest',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AttendanceAdjustmentRequest');
    return response.data as IAttendanceAdjustmentRequest;
  },

  async updateAttendanceAdjustmentRequest(id: string, input: Partial<ICreateAttendanceAdjustmentRequestInput>): Promise<IAttendanceAdjustmentRequest> {
    const response = await update_partial_content({
      schema: 'AttendanceAdjustmentRequest',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AttendanceAdjustmentRequest');
    return response.data as IAttendanceAdjustmentRequest;
  },

  async deleteAttendanceAdjustmentRequest(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AttendanceAdjustmentRequest',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAttendanceAdjustmentRequest(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AttendanceAdjustmentRequest',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAttendanceAdjustmentRequest(id: string, locked: boolean = true): Promise<IAttendanceAdjustmentRequest> {
    const response = await lock_content({
      schema: 'AttendanceAdjustmentRequest',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AttendanceAdjustmentRequest');
    return response.data as IAttendanceAdjustmentRequest;
  },

  async findAttendanceAdjustmentRequestDto(id: string): Promise<IAttendanceAdjustmentRequest> {
    const response = await query<IAttendanceAdjustmentRequest>(FIND_ATTENDANCEADJUSTMENTREQUEST_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AttendanceAdjustmentRequest');
    return response.data;
  },
  async queryAttendanceAdjustmentRequestsDto(filter?: GeneralCollectionFilter): Promise<IAttendanceAdjustmentRequestListResponse> {
    return await queryList<IAttendanceAdjustmentRequest>(
      QUERY_ATTENDANCEADJUSTMENTREQUESTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default attendanceAdjustmentRequestService;
