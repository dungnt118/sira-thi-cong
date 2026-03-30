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

import { FIND_ATTENDANCERECORD_DTO, QUERY_ATTENDANCERECORDS_DTO } from '../queries/attendanceRecord.queries';
import {
  IAttendanceRecord,
  ICreateAttendanceRecordInput,
  IAttendanceRecordListResponse
} from '../types/attendanceRecord.types';

export const attendanceRecordService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AttendanceRecord', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AttendanceRecord');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAttendanceRecordListResponse> {
    return await query_content<IAttendanceRecord>({ schema: 'AttendanceRecord', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AttendanceRecord', filter });
    return response?.data || 0;
  },

  async createAttendanceRecord(input: ICreateAttendanceRecordInput): Promise<IAttendanceRecord> {
    const response = await save_content({
      schema: 'AttendanceRecord',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AttendanceRecord');
    return response.data as IAttendanceRecord;
  },

  async updateAttendanceRecord(id: string, input: Partial<ICreateAttendanceRecordInput>): Promise<IAttendanceRecord> {
    const response = await update_partial_content({
      schema: 'AttendanceRecord',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AttendanceRecord');
    return response.data as IAttendanceRecord;
  },

  async deleteAttendanceRecord(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AttendanceRecord',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAttendanceRecord(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AttendanceRecord',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAttendanceRecord(id: string, locked: boolean = true): Promise<IAttendanceRecord> {
    const response = await lock_content({
      schema: 'AttendanceRecord',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AttendanceRecord');
    return response.data as IAttendanceRecord;
  },

  async findAttendanceRecordDto(id: string): Promise<IAttendanceRecord> {
    const response = await query<IAttendanceRecord>(FIND_ATTENDANCERECORD_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AttendanceRecord');
    return response.data;
  },
  async queryAttendanceRecordsDto(filter?: GeneralCollectionFilter): Promise<IAttendanceRecordListResponse> {
    return await queryList<IAttendanceRecord>(
      QUERY_ATTENDANCERECORDS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default attendanceRecordService;
