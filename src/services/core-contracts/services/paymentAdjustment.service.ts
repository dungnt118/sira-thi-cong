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

import { FIND_PAYMENTADJUSTMENT_DTO, QUERY_PAYMENTADJUSTMENTS_DTO } from '../queries/paymentAdjustment.queries';
import {
  IPaymentAdjustment,
  ICreatePaymentAdjustmentInput,
  IPaymentAdjustmentListResponse
} from '../types/paymentAdjustment.types';

export const paymentAdjustmentService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PaymentAdjustment', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PaymentAdjustment');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPaymentAdjustmentListResponse> {
    return await query_content<IPaymentAdjustment>({ schema: 'PaymentAdjustment', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PaymentAdjustment', filter });
    return response?.data || 0;
  },

  async createPaymentAdjustment(input: ICreatePaymentAdjustmentInput): Promise<IPaymentAdjustment> {
    const response = await save_content({
      schema: 'PaymentAdjustment',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PaymentAdjustment');
    return response.data as IPaymentAdjustment;
  },

  async updatePaymentAdjustment(id: string, input: Partial<ICreatePaymentAdjustmentInput>): Promise<IPaymentAdjustment> {
    const response = await update_partial_content({
      schema: 'PaymentAdjustment',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PaymentAdjustment');
    return response.data as IPaymentAdjustment;
  },

  async deletePaymentAdjustment(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PaymentAdjustment',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPaymentAdjustment(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PaymentAdjustment',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPaymentAdjustment(id: string, locked: boolean = true): Promise<IPaymentAdjustment> {
    const response = await lock_content({
      schema: 'PaymentAdjustment',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PaymentAdjustment');
    return response.data as IPaymentAdjustment;
  },

  async findPaymentAdjustmentDto(id: string): Promise<IPaymentAdjustment> {
    const response = await query<IPaymentAdjustment>(FIND_PAYMENTADJUSTMENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PaymentAdjustment');
    return response.data;
  },
  async queryPaymentAdjustmentsDto(filter?: GeneralCollectionFilter): Promise<IPaymentAdjustmentListResponse> {
    return await queryList<IPaymentAdjustment>(
      QUERY_PAYMENTADJUSTMENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default paymentAdjustmentService;
