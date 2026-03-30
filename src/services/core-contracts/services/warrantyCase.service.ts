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

import { FIND_WARRANTYCASE_DTO, QUERY_WARRANTYCASES_DTO } from '../queries/warrantyCase.queries';
import {
  IWarrantyCase,
  ICreateWarrantyCaseInput,
  IWarrantyCaseListResponse
} from '../types/warrantyCase.types';

export const warrantyCaseService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WarrantyCase', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WarrantyCase');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWarrantyCaseListResponse> {
    return await query_content<IWarrantyCase>({ schema: 'WarrantyCase', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WarrantyCase', filter });
    return response?.data || 0;
  },

  async createWarrantyCase(input: ICreateWarrantyCaseInput): Promise<IWarrantyCase> {
    const response = await save_content({
      schema: 'WarrantyCase',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WarrantyCase');
    return response.data as IWarrantyCase;
  },

  async updateWarrantyCase(id: string, input: Partial<ICreateWarrantyCaseInput>): Promise<IWarrantyCase> {
    const response = await update_partial_content({
      schema: 'WarrantyCase',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WarrantyCase');
    return response.data as IWarrantyCase;
  },

  async deleteWarrantyCase(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WarrantyCase',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWarrantyCase(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WarrantyCase',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWarrantyCase(id: string, locked: boolean = true): Promise<IWarrantyCase> {
    const response = await lock_content({
      schema: 'WarrantyCase',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WarrantyCase');
    return response.data as IWarrantyCase;
  },

  async findWarrantyCaseDto(id: string): Promise<IWarrantyCase> {
    const response = await query<IWarrantyCase>(FIND_WARRANTYCASE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WarrantyCase');
    return response.data;
  },
  async queryWarrantyCasesDto(filter?: GeneralCollectionFilter): Promise<IWarrantyCaseListResponse> {
    return await queryList<IWarrantyCase>(
      QUERY_WARRANTYCASES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default warrantyCaseService;
