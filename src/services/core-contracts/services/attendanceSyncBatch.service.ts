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

import { FIND_ATTENDANCESYNCBATCH_DTO, QUERY_ATTENDANCESYNCBATCHS_DTO } from '../queries/attendanceSyncBatch.queries';
import {
  IAttendanceSyncBatch,
  ICreateAttendanceSyncBatchInput,
  IAttendanceSyncBatchListResponse
} from '../types/attendanceSyncBatch.types';

export const attendanceSyncBatchService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AttendanceSyncBatch', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AttendanceSyncBatch');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAttendanceSyncBatchListResponse> {
    return await query_content<IAttendanceSyncBatch>({ schema: 'AttendanceSyncBatch', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AttendanceSyncBatch', filter });
    return response?.data || 0;
  },

  async createAttendanceSyncBatch(input: ICreateAttendanceSyncBatchInput): Promise<IAttendanceSyncBatch> {
    const response = await save_content({
      schema: 'AttendanceSyncBatch',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AttendanceSyncBatch');
    return response.data as IAttendanceSyncBatch;
  },

  async updateAttendanceSyncBatch(id: string, input: Partial<ICreateAttendanceSyncBatchInput>): Promise<IAttendanceSyncBatch> {
    const response = await update_partial_content({
      schema: 'AttendanceSyncBatch',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AttendanceSyncBatch');
    return response.data as IAttendanceSyncBatch;
  },

  async deleteAttendanceSyncBatch(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AttendanceSyncBatch',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAttendanceSyncBatch(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AttendanceSyncBatch',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAttendanceSyncBatch(id: string, locked: boolean = true): Promise<IAttendanceSyncBatch> {
    const response = await lock_content({
      schema: 'AttendanceSyncBatch',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AttendanceSyncBatch');
    return response.data as IAttendanceSyncBatch;
  },

  async findAttendanceSyncBatchDto(id: string): Promise<IAttendanceSyncBatch> {
    const response = await query<IAttendanceSyncBatch>(FIND_ATTENDANCESYNCBATCH_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AttendanceSyncBatch');
    return response.data;
  },
  async queryAttendanceSyncBatchsDto(filter?: GeneralCollectionFilter): Promise<IAttendanceSyncBatchListResponse> {
    return await queryList<IAttendanceSyncBatch>(
      QUERY_ATTENDANCESYNCBATCHS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default attendanceSyncBatchService;
