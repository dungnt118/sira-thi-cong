import { query, queryList } from 'app/services/graphqlService'; // TODO: Check path
import { GeneralCollectionFilter } from 'types/filters/GeneralCollectionFilter';
import {
  find_content,
  query_content,
  count_content,
  save_content,
  save_many_content,
  update_partial_content,
  delete_content,
  delete_multi_content,
  lock_content
} from 'app/store/actions/data/data.action'; // TODO: Check path

import { FIND_QUOTATIONLINEITEM_DTO, QUERY_QUOTATIONLINEITEMS_DTO } from '../queries/quotationLineItem.queries';
import {
  IQuotationLineItem,
  ICreateQuotationLineItemInput,
  IQuotationLineItemListResponse
} from '../types/quotationLineItem.types';

export const quotationLineItemService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'QuotationLineItem', _id: id });
    if (!response.data) throw new Error('Không tìm thấy QuotationLineItem');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IQuotationLineItemListResponse> {
    return await query_content<IQuotationLineItem>({ schema: 'QuotationLineItem', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'QuotationLineItem', filter });
    return response?.data || 0;
  },

  async createQuotationLineItem(input: ICreateQuotationLineItemInput): Promise<IQuotationLineItem> {
    const response = await save_content({
      schema: 'QuotationLineItem',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo QuotationLineItem');
    return response.data as IQuotationLineItem;
  },

  /** Lưu nhiều QuotationLineItem — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManyQuotationLineItems(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'QuotationLineItem',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt QuotationLineItem');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt QuotationLineItem (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateQuotationLineItem(id: string, input: Partial<ICreateQuotationLineItemInput>): Promise<IQuotationLineItem> {
    const response = await update_partial_content({
      schema: 'QuotationLineItem',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật QuotationLineItem');
    return response.data as IQuotationLineItem;
  },

  async deleteQuotationLineItem(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'QuotationLineItem',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiQuotationLineItem(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'QuotationLineItem',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockQuotationLineItem(id: string, locked: boolean = true): Promise<IQuotationLineItem> {
    const response = await lock_content({
      schema: 'QuotationLineItem',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa QuotationLineItem');
    return response.data as IQuotationLineItem;
  },

  async findQuotationLineItemDto(id: string): Promise<IQuotationLineItem> {
    const response = await query<IQuotationLineItem>(FIND_QUOTATIONLINEITEM_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy QuotationLineItem');
    return response.data;
  },
  async queryQuotationLineItemsDto(filter?: GeneralCollectionFilter): Promise<IQuotationLineItemListResponse> {
    return await queryList<IQuotationLineItem>(
      QUERY_QUOTATIONLINEITEMS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default quotationLineItemService;
