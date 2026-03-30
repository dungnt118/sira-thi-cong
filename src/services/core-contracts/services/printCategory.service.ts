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

import { FIND_PRINTCATEGORY_DTO, QUERY_PRINTCATEGORYS_DTO } from '../queries/printCategory.queries';
import {
  IPrintCategory,
  ICreatePrintCategoryInput,
  IPrintCategoryListResponse
} from '../types/printCategory.types';

export const printCategoryService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PrintCategory', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PrintCategory');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPrintCategoryListResponse> {
    return await query_content<IPrintCategory>({ schema: 'PrintCategory', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PrintCategory', filter });
    return response?.data || 0;
  },

  async createPrintCategory(input: ICreatePrintCategoryInput): Promise<IPrintCategory> {
    const response = await save_content({
      schema: 'PrintCategory',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PrintCategory');
    return response.data as IPrintCategory;
  },

  async updatePrintCategory(id: string, input: Partial<ICreatePrintCategoryInput>): Promise<IPrintCategory> {
    const response = await update_partial_content({
      schema: 'PrintCategory',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PrintCategory');
    return response.data as IPrintCategory;
  },

  async deletePrintCategory(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PrintCategory',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPrintCategory(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PrintCategory',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPrintCategory(id: string, locked: boolean = true): Promise<IPrintCategory> {
    const response = await lock_content({
      schema: 'PrintCategory',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PrintCategory');
    return response.data as IPrintCategory;
  },

  async findPrintCategoryDto(id: string): Promise<IPrintCategory> {
    const response = await query<IPrintCategory>(FIND_PRINTCATEGORY_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PrintCategory');
    return response.data;
  },
  async queryPrintCategorysDto(filter?: GeneralCollectionFilter): Promise<IPrintCategoryListResponse> {
    return await queryList<IPrintCategory>(
      QUERY_PRINTCATEGORYS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default printCategoryService;
