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

import { FIND_INDEXEDCONTENTITEM_DTO, QUERY_INDEXEDCONTENTITEMS_DTO } from '../queries/indexedContentItem.queries';
import {
  IIndexedContentItem,
  ICreateIndexedContentItemInput,
  IIndexedContentItemListResponse
} from '../types/indexedContentItem.types';

export const indexedContentItemService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'IndexedContentItem', _id: id });
    if (!response.data) throw new Error('Không tìm thấy IndexedContentItem');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IIndexedContentItemListResponse> {
    return await query_content<IIndexedContentItem>({ schema: 'IndexedContentItem', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'IndexedContentItem', filter });
    return response?.data || 0;
  },

  async createIndexedContentItem(input: ICreateIndexedContentItemInput): Promise<IIndexedContentItem> {
    const response = await save_content({
      schema: 'IndexedContentItem',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo IndexedContentItem');
    return response.data as IIndexedContentItem;
  },

  async updateIndexedContentItem(id: string, input: Partial<ICreateIndexedContentItemInput>): Promise<IIndexedContentItem> {
    const response = await update_partial_content({
      schema: 'IndexedContentItem',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật IndexedContentItem');
    return response.data as IIndexedContentItem;
  },

  async deleteIndexedContentItem(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'IndexedContentItem',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiIndexedContentItem(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'IndexedContentItem',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockIndexedContentItem(id: string, locked: boolean = true): Promise<IIndexedContentItem> {
    const response = await lock_content({
      schema: 'IndexedContentItem',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa IndexedContentItem');
    return response.data as IIndexedContentItem;
  },

  async findIndexedContentItemDto(id: string): Promise<IIndexedContentItem> {
    const response = await query<IIndexedContentItem>(FIND_INDEXEDCONTENTITEM_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy IndexedContentItem');
    return response.data;
  },
  async queryIndexedContentItemsDto(filter?: GeneralCollectionFilter): Promise<IIndexedContentItemListResponse> {
    return await queryList<IIndexedContentItem>(
      QUERY_INDEXEDCONTENTITEMS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default indexedContentItemService;
