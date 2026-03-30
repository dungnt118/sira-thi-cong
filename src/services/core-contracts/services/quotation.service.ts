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

import { FIND_QUOTATION_DTO, QUERY_QUOTATIONS_DTO } from '../queries/quotation.queries';
import {
  IQuotation,
  ICreateQuotationInput,
  IQuotationListResponse
} from '../types/quotation.types';

export const quotationService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Quotation', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Quotation');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IQuotationListResponse> {
    return await query_content<IQuotation>({ schema: 'Quotation', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Quotation', filter });
    return response?.data || 0;
  },

  async createQuotation(input: ICreateQuotationInput): Promise<IQuotation> {
    const response = await save_content({
      schema: 'Quotation',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Quotation');
    return response.data as IQuotation;
  },

  async updateQuotation(id: string, input: Partial<ICreateQuotationInput>): Promise<IQuotation> {
    const response = await update_partial_content({
      schema: 'Quotation',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Quotation');
    return response.data as IQuotation;
  },

  async deleteQuotation(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Quotation',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiQuotation(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Quotation',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockQuotation(id: string, locked: boolean = true): Promise<IQuotation> {
    const response = await lock_content({
      schema: 'Quotation',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Quotation');
    return response.data as IQuotation;
  },

  async findQuotationDto(id: string): Promise<IQuotation> {
    const response = await query<IQuotation>(FIND_QUOTATION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Quotation');
    return response.data;
  },
  async queryQuotationsDto(filter?: GeneralCollectionFilter): Promise<IQuotationListResponse> {
    return await queryList<IQuotation>(
      QUERY_QUOTATIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default quotationService;
