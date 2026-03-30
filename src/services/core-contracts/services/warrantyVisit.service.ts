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

import { FIND_WARRANTYVISIT_DTO, QUERY_WARRANTYVISITS_DTO } from '../queries/warrantyVisit.queries';
import {
  IWarrantyVisit,
  ICreateWarrantyVisitInput,
  IWarrantyVisitListResponse
} from '../types/warrantyVisit.types';

export const warrantyVisitService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WarrantyVisit', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WarrantyVisit');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWarrantyVisitListResponse> {
    return await query_content<IWarrantyVisit>({ schema: 'WarrantyVisit', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WarrantyVisit', filter });
    return response?.data || 0;
  },

  async createWarrantyVisit(input: ICreateWarrantyVisitInput): Promise<IWarrantyVisit> {
    const response = await save_content({
      schema: 'WarrantyVisit',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WarrantyVisit');
    return response.data as IWarrantyVisit;
  },

  async updateWarrantyVisit(id: string, input: Partial<ICreateWarrantyVisitInput>): Promise<IWarrantyVisit> {
    const response = await update_partial_content({
      schema: 'WarrantyVisit',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WarrantyVisit');
    return response.data as IWarrantyVisit;
  },

  async deleteWarrantyVisit(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WarrantyVisit',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWarrantyVisit(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WarrantyVisit',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWarrantyVisit(id: string, locked: boolean = true): Promise<IWarrantyVisit> {
    const response = await lock_content({
      schema: 'WarrantyVisit',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WarrantyVisit');
    return response.data as IWarrantyVisit;
  },

  async findWarrantyVisitDto(id: string): Promise<IWarrantyVisit> {
    const response = await query<IWarrantyVisit>(FIND_WARRANTYVISIT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WarrantyVisit');
    return response.data;
  },
  async queryWarrantyVisitsDto(filter?: GeneralCollectionFilter): Promise<IWarrantyVisitListResponse> {
    return await queryList<IWarrantyVisit>(
      QUERY_WARRANTYVISITS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default warrantyVisitService;
