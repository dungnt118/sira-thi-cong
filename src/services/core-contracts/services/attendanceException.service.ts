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

import { FIND_ATTENDANCEEXCEPTION_DTO, QUERY_ATTENDANCEEXCEPTIONS_DTO } from '../queries/attendanceException.queries';
import {
  IAttendanceException,
  ICreateAttendanceExceptionInput,
  IAttendanceExceptionListResponse
} from '../types/attendanceException.types';

export const attendanceExceptionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AttendanceException', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AttendanceException');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAttendanceExceptionListResponse> {
    return await query_content<IAttendanceException>({ schema: 'AttendanceException', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AttendanceException', filter });
    return response?.data || 0;
  },

  async createAttendanceException(input: ICreateAttendanceExceptionInput): Promise<IAttendanceException> {
    const response = await save_content({
      schema: 'AttendanceException',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AttendanceException');
    return response.data as IAttendanceException;
  },

  async updateAttendanceException(id: string, input: Partial<ICreateAttendanceExceptionInput>): Promise<IAttendanceException> {
    const response = await update_partial_content({
      schema: 'AttendanceException',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AttendanceException');
    return response.data as IAttendanceException;
  },

  async deleteAttendanceException(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AttendanceException',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAttendanceException(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AttendanceException',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAttendanceException(id: string, locked: boolean = true): Promise<IAttendanceException> {
    const response = await lock_content({
      schema: 'AttendanceException',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AttendanceException');
    return response.data as IAttendanceException;
  },

  async findAttendanceExceptionDto(id: string): Promise<IAttendanceException> {
    const response = await query<IAttendanceException>(FIND_ATTENDANCEEXCEPTION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AttendanceException');
    return response.data;
  },
  async queryAttendanceExceptionsDto(filter?: GeneralCollectionFilter): Promise<IAttendanceExceptionListResponse> {
    return await queryList<IAttendanceException>(
      QUERY_ATTENDANCEEXCEPTIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default attendanceExceptionService;
