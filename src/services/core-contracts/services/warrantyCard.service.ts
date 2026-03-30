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

import { FIND_WARRANTYCARD_DTO, QUERY_WARRANTYCARDS_DTO } from '../queries/warrantyCard.queries';
import {
  IWarrantyCard,
  ICreateWarrantyCardInput,
  IWarrantyCardListResponse
} from '../types/warrantyCard.types';

export const warrantyCardService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WarrantyCard', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WarrantyCard');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWarrantyCardListResponse> {
    return await query_content<IWarrantyCard>({ schema: 'WarrantyCard', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WarrantyCard', filter });
    return response?.data || 0;
  },

  async createWarrantyCard(input: ICreateWarrantyCardInput): Promise<IWarrantyCard> {
    const response = await save_content({
      schema: 'WarrantyCard',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WarrantyCard');
    return response.data as IWarrantyCard;
  },

  async updateWarrantyCard(id: string, input: Partial<ICreateWarrantyCardInput>): Promise<IWarrantyCard> {
    const response = await update_partial_content({
      schema: 'WarrantyCard',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WarrantyCard');
    return response.data as IWarrantyCard;
  },

  async deleteWarrantyCard(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WarrantyCard',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWarrantyCard(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WarrantyCard',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWarrantyCard(id: string, locked: boolean = true): Promise<IWarrantyCard> {
    const response = await lock_content({
      schema: 'WarrantyCard',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WarrantyCard');
    return response.data as IWarrantyCard;
  },

  async findWarrantyCardDto(id: string): Promise<IWarrantyCard> {
    const response = await query<IWarrantyCard>(FIND_WARRANTYCARD_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WarrantyCard');
    return response.data;
  },
  async queryWarrantyCardsDto(filter?: GeneralCollectionFilter): Promise<IWarrantyCardListResponse> {
    return await queryList<IWarrantyCard>(
      QUERY_WARRANTYCARDS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default warrantyCardService;
