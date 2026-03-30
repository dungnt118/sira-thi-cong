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

import { FIND_LEAVETYPE_DTO, QUERY_LEAVETYPES_DTO } from '../queries/leaveType.queries';
import {
  ILeaveType,
  ICreateLeaveTypeInput,
  ILeaveTypeListResponse
} from '../types/leaveType.types';

export const leaveTypeService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'LeaveType', _id: id });
    if (!response.data) throw new Error('Không tìm thấy LeaveType');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ILeaveTypeListResponse> {
    return await query_content<ILeaveType>({ schema: 'LeaveType', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'LeaveType', filter });
    return response?.data || 0;
  },

  async createLeaveType(input: ICreateLeaveTypeInput): Promise<ILeaveType> {
    const response = await save_content({
      schema: 'LeaveType',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo LeaveType');
    return response.data as ILeaveType;
  },

  async updateLeaveType(id: string, input: Partial<ICreateLeaveTypeInput>): Promise<ILeaveType> {
    const response = await update_partial_content({
      schema: 'LeaveType',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật LeaveType');
    return response.data as ILeaveType;
  },

  async deleteLeaveType(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'LeaveType',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiLeaveType(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'LeaveType',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockLeaveType(id: string, locked: boolean = true): Promise<ILeaveType> {
    const response = await lock_content({
      schema: 'LeaveType',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa LeaveType');
    return response.data as ILeaveType;
  },

  async findLeaveTypeDto(id: string): Promise<ILeaveType> {
    const response = await query<ILeaveType>(FIND_LEAVETYPE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy LeaveType');
    return response.data;
  },
  async queryLeaveTypesDto(filter?: GeneralCollectionFilter): Promise<ILeaveTypeListResponse> {
    return await queryList<ILeaveType>(
      QUERY_LEAVETYPES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default leaveTypeService;
