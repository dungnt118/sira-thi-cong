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

import { FIND_LEAVEREQUEST_DTO, QUERY_LEAVEREQUESTS_DTO } from '../queries/leaveRequest.queries';
import {
  ILeaveRequest,
  ICreateLeaveRequestInput,
  ILeaveRequestListResponse
} from '../types/leaveRequest.types';

export const leaveRequestService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'LeaveRequest', _id: id });
    if (!response.data) throw new Error('Không tìm thấy LeaveRequest');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ILeaveRequestListResponse> {
    return await query_content<ILeaveRequest>({ schema: 'LeaveRequest', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'LeaveRequest', filter });
    return response?.data || 0;
  },

  async createLeaveRequest(input: ICreateLeaveRequestInput): Promise<ILeaveRequest> {
    const response = await save_content({
      schema: 'LeaveRequest',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo LeaveRequest');
    return response.data as ILeaveRequest;
  },

  async updateLeaveRequest(id: string, input: Partial<ICreateLeaveRequestInput>): Promise<ILeaveRequest> {
    const response = await update_partial_content({
      schema: 'LeaveRequest',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật LeaveRequest');
    return response.data as ILeaveRequest;
  },

  async deleteLeaveRequest(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'LeaveRequest',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiLeaveRequest(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'LeaveRequest',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockLeaveRequest(id: string, locked: boolean = true): Promise<ILeaveRequest> {
    const response = await lock_content({
      schema: 'LeaveRequest',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa LeaveRequest');
    return response.data as ILeaveRequest;
  },

  async findLeaveRequestDto(id: string): Promise<ILeaveRequest> {
    const response = await query<ILeaveRequest>(FIND_LEAVEREQUEST_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy LeaveRequest');
    return response.data;
  },
  async queryLeaveRequestsDto(filter?: GeneralCollectionFilter): Promise<ILeaveRequestListResponse> {
    return await queryList<ILeaveRequest>(
      QUERY_LEAVEREQUESTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default leaveRequestService;
