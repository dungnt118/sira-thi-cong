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

import { FIND_LEAVEBALANCE_DTO, QUERY_LEAVEBALANCES_DTO } from '../queries/leaveBalance.queries';
import {
  ILeaveBalance,
  ICreateLeaveBalanceInput,
  ILeaveBalanceListResponse
} from '../types/leaveBalance.types';

export const leaveBalanceService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'LeaveBalance', _id: id });
    if (!response.data) throw new Error('Không tìm thấy LeaveBalance');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ILeaveBalanceListResponse> {
    return await query_content<ILeaveBalance>({ schema: 'LeaveBalance', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'LeaveBalance', filter });
    return response?.data || 0;
  },

  async createLeaveBalance(input: ICreateLeaveBalanceInput): Promise<ILeaveBalance> {
    const response = await save_content({
      schema: 'LeaveBalance',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo LeaveBalance');
    return response.data as ILeaveBalance;
  },

  async updateLeaveBalance(id: string, input: Partial<ICreateLeaveBalanceInput>): Promise<ILeaveBalance> {
    const response = await update_partial_content({
      schema: 'LeaveBalance',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật LeaveBalance');
    return response.data as ILeaveBalance;
  },

  async deleteLeaveBalance(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'LeaveBalance',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiLeaveBalance(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'LeaveBalance',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockLeaveBalance(id: string, locked: boolean = true): Promise<ILeaveBalance> {
    const response = await lock_content({
      schema: 'LeaveBalance',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa LeaveBalance');
    return response.data as ILeaveBalance;
  },

  async findLeaveBalanceDto(id: string): Promise<ILeaveBalance> {
    const response = await query<ILeaveBalance>(FIND_LEAVEBALANCE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy LeaveBalance');
    return response.data;
  },
  async queryLeaveBalancesDto(filter?: GeneralCollectionFilter): Promise<ILeaveBalanceListResponse> {
    return await queryList<ILeaveBalance>(
      QUERY_LEAVEBALANCES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default leaveBalanceService;
