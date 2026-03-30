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

import { FIND_CONTENTDELETED_DTO, QUERY_CONTENTDELETEDS_DTO } from '../queries/contentDeleted.queries';
import {
  IContentDeleted,
  ICreateContentDeletedInput,
  IContentDeletedListResponse
} from '../types/contentDeleted.types';

export const contentDeletedService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ContentDeleted', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ContentDeleted');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IContentDeletedListResponse> {
    return await query_content<IContentDeleted>({ schema: 'ContentDeleted', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ContentDeleted', filter });
    return response?.data || 0;
  },

  async createContentDeleted(input: ICreateContentDeletedInput): Promise<IContentDeleted> {
    const response = await save_content({
      schema: 'ContentDeleted',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ContentDeleted');
    return response.data as IContentDeleted;
  },

  async updateContentDeleted(id: string, input: Partial<ICreateContentDeletedInput>): Promise<IContentDeleted> {
    const response = await update_partial_content({
      schema: 'ContentDeleted',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ContentDeleted');
    return response.data as IContentDeleted;
  },

  async deleteContentDeleted(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ContentDeleted',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiContentDeleted(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ContentDeleted',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockContentDeleted(id: string, locked: boolean = true): Promise<IContentDeleted> {
    const response = await lock_content({
      schema: 'ContentDeleted',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ContentDeleted');
    return response.data as IContentDeleted;
  },

  async findContentDeletedDto(id: string): Promise<IContentDeleted> {
    const response = await query<IContentDeleted>(FIND_CONTENTDELETED_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ContentDeleted');
    return response.data;
  },
  async queryContentDeletedsDto(filter?: GeneralCollectionFilter): Promise<IContentDeletedListResponse> {
    return await queryList<IContentDeleted>(
      QUERY_CONTENTDELETEDS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default contentDeletedService;
