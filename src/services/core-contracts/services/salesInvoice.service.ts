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

import { FIND_SALESINVOICE_DTO, QUERY_SALESINVOICES_DTO } from '../queries/salesInvoice.queries';
import {
  ISalesInvoice,
  ICreateSalesInvoiceInput,
  ISalesInvoiceListResponse
} from '../types/salesInvoice.types';

export const salesInvoiceService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SalesInvoice', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SalesInvoice');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISalesInvoiceListResponse> {
    return await query_content<ISalesInvoice>({ schema: 'SalesInvoice', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SalesInvoice', filter });
    return response?.data || 0;
  },

  async createSalesInvoice(input: ICreateSalesInvoiceInput): Promise<ISalesInvoice> {
    const response = await save_content({
      schema: 'SalesInvoice',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SalesInvoice');
    return response.data as ISalesInvoice;
  },

  async updateSalesInvoice(id: string, input: Partial<ICreateSalesInvoiceInput>): Promise<ISalesInvoice> {
    const response = await update_partial_content({
      schema: 'SalesInvoice',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SalesInvoice');
    return response.data as ISalesInvoice;
  },

  async deleteSalesInvoice(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SalesInvoice',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSalesInvoice(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SalesInvoice',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSalesInvoice(id: string, locked: boolean = true): Promise<ISalesInvoice> {
    const response = await lock_content({
      schema: 'SalesInvoice',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SalesInvoice');
    return response.data as ISalesInvoice;
  },

  async findSalesInvoiceDto(id: string): Promise<ISalesInvoice> {
    const response = await query<ISalesInvoice>(FIND_SALESINVOICE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SalesInvoice');
    return response.data;
  },
  async querySalesInvoicesDto(filter?: GeneralCollectionFilter): Promise<ISalesInvoiceListResponse> {
    return await queryList<ISalesInvoice>(
      QUERY_SALESINVOICES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default salesInvoiceService;
