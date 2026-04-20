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

import { FIND_CUSTOMER_DTO, QUERY_CUSTOMERS_DTO } from '../queries/customer.queries';
import {
  ICustomer,
  ICreateCustomerInput,
  ICustomerListResponse
} from '../types/customer.types';

export const customerService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Customer', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Customer');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ICustomerListResponse> {
    return await query_content<ICustomer>({ schema: 'Customer', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Customer', filter });
    return response?.data || 0;
  },

  async createCustomer(input: ICreateCustomerInput): Promise<ICustomer> {
    const response = await save_content({
      schema: 'Customer',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) {
      console.error('Backend save_content failed for Customer:', response);
      throw new Error(`Không thể tạo Customer: ${response?.message || 'Không có phản hồi'}`);
    }
    return response.data as ICustomer;
  },

  async updateCustomer(id: string, input: Partial<ICreateCustomerInput>): Promise<ICustomer> {
    const response = await update_partial_content({
      schema: 'Customer',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Customer');
    return response.data as ICustomer;
  },

  async deleteCustomer(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Customer',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiCustomer(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Customer',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockCustomer(id: string, locked: boolean = true): Promise<ICustomer> {
    const response = await lock_content({
      schema: 'Customer',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Customer');
    return response.data as ICustomer;
  },

  async findCustomerDto(id: string): Promise<ICustomer> {
    const response = await query<ICustomer>(FIND_CUSTOMER_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Customer');
    return response.data;
  },
  async queryCustomersDto(filter?: GeneralCollectionFilter): Promise<ICustomerListResponse> {
    return await queryList<ICustomer>(
      QUERY_CUSTOMERS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default customerService;
