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

import { FIND_PAYMENTREQUEST_DTO, QUERY_PAYMENTREQUESTS_DTO } from '../queries/paymentRequest.queries';
import {
  IPaymentRequest,
  ICreatePaymentRequestInput,
  IPaymentRequestListResponse
} from '../types/paymentRequest.types';

export const paymentRequestService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PaymentRequest', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PaymentRequest');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPaymentRequestListResponse> {
    return await query_content<IPaymentRequest>({ schema: 'PaymentRequest', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PaymentRequest', filter });
    return response?.data || 0;
  },

  async createPaymentRequest(input: ICreatePaymentRequestInput): Promise<IPaymentRequest> {
    const response = await save_content({
      schema: 'PaymentRequest',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PaymentRequest');
    return response.data as IPaymentRequest;
  },

  async updatePaymentRequest(id: string, input: Partial<ICreatePaymentRequestInput>): Promise<IPaymentRequest> {
    const response = await update_partial_content({
      schema: 'PaymentRequest',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PaymentRequest');
    return response.data as IPaymentRequest;
  },

  async deletePaymentRequest(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PaymentRequest',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPaymentRequest(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PaymentRequest',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPaymentRequest(id: string, locked: boolean = true): Promise<IPaymentRequest> {
    const response = await lock_content({
      schema: 'PaymentRequest',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PaymentRequest');
    return response.data as IPaymentRequest;
  },

  async findPaymentRequestDto(id: string): Promise<IPaymentRequest> {
    const response = await query<IPaymentRequest>(FIND_PAYMENTREQUEST_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PaymentRequest');
    return response.data;
  },
  async queryPaymentRequestsDto(filter?: GeneralCollectionFilter): Promise<IPaymentRequestListResponse> {
    return await queryList<IPaymentRequest>(
      QUERY_PAYMENTREQUESTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default paymentRequestService;
