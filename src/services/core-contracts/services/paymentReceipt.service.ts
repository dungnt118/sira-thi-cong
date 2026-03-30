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

import { FIND_PAYMENTRECEIPT_DTO, QUERY_PAYMENTRECEIPTS_DTO } from '../queries/paymentReceipt.queries';
import {
  IPaymentReceipt,
  ICreatePaymentReceiptInput,
  IPaymentReceiptListResponse
} from '../types/paymentReceipt.types';

export const paymentReceiptService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PaymentReceipt', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PaymentReceipt');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPaymentReceiptListResponse> {
    return await query_content<IPaymentReceipt>({ schema: 'PaymentReceipt', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PaymentReceipt', filter });
    return response?.data || 0;
  },

  async createPaymentReceipt(input: ICreatePaymentReceiptInput): Promise<IPaymentReceipt> {
    const response = await save_content({
      schema: 'PaymentReceipt',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PaymentReceipt');
    return response.data as IPaymentReceipt;
  },

  async updatePaymentReceipt(id: string, input: Partial<ICreatePaymentReceiptInput>): Promise<IPaymentReceipt> {
    const response = await update_partial_content({
      schema: 'PaymentReceipt',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PaymentReceipt');
    return response.data as IPaymentReceipt;
  },

  async deletePaymentReceipt(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PaymentReceipt',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPaymentReceipt(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PaymentReceipt',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPaymentReceipt(id: string, locked: boolean = true): Promise<IPaymentReceipt> {
    const response = await lock_content({
      schema: 'PaymentReceipt',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PaymentReceipt');
    return response.data as IPaymentReceipt;
  },

  async findPaymentReceiptDto(id: string): Promise<IPaymentReceipt> {
    const response = await query<IPaymentReceipt>(FIND_PAYMENTRECEIPT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PaymentReceipt');
    return response.data;
  },
  async queryPaymentReceiptsDto(filter?: GeneralCollectionFilter): Promise<IPaymentReceiptListResponse> {
    return await queryList<IPaymentReceipt>(
      QUERY_PAYMENTRECEIPTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default paymentReceiptService;
