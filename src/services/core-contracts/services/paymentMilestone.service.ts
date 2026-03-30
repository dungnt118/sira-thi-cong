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

import { FIND_PAYMENTMILESTONE_DTO, QUERY_PAYMENTMILESTONES_DTO } from '../queries/paymentMilestone.queries';
import {
  IPaymentMilestone,
  ICreatePaymentMilestoneInput,
  IPaymentMilestoneListResponse
} from '../types/paymentMilestone.types';

export const paymentMilestoneService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PaymentMilestone', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PaymentMilestone');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPaymentMilestoneListResponse> {
    return await query_content<IPaymentMilestone>({ schema: 'PaymentMilestone', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PaymentMilestone', filter });
    return response?.data || 0;
  },

  async createPaymentMilestone(input: ICreatePaymentMilestoneInput): Promise<IPaymentMilestone> {
    const response = await save_content({
      schema: 'PaymentMilestone',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PaymentMilestone');
    return response.data as IPaymentMilestone;
  },

  async updatePaymentMilestone(id: string, input: Partial<ICreatePaymentMilestoneInput>): Promise<IPaymentMilestone> {
    const response = await update_partial_content({
      schema: 'PaymentMilestone',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PaymentMilestone');
    return response.data as IPaymentMilestone;
  },

  async deletePaymentMilestone(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PaymentMilestone',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPaymentMilestone(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PaymentMilestone',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPaymentMilestone(id: string, locked: boolean = true): Promise<IPaymentMilestone> {
    const response = await lock_content({
      schema: 'PaymentMilestone',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PaymentMilestone');
    return response.data as IPaymentMilestone;
  },

  async findPaymentMilestoneDto(id: string): Promise<IPaymentMilestone> {
    const response = await query<IPaymentMilestone>(FIND_PAYMENTMILESTONE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PaymentMilestone');
    return response.data;
  },
  async queryPaymentMilestonesDto(filter?: GeneralCollectionFilter): Promise<IPaymentMilestoneListResponse> {
    return await queryList<IPaymentMilestone>(
      QUERY_PAYMENTMILESTONES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default paymentMilestoneService;
