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

import { FIND_HTMLSTORE_DTO, QUERY_HTMLSTORES_DTO } from '../queries/htmlStore.queries';
import {
  IHtmlStore,
  ICreateHtmlStoreInput,
  IHtmlStoreListResponse
} from '../types/htmlStore.types';

export const htmlStoreService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'HtmlStore', _id: id });
    if (!response.data) throw new Error('Không tìm thấy HtmlStore');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IHtmlStoreListResponse> {
    return await query_content<IHtmlStore>({ schema: 'HtmlStore', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'HtmlStore', filter });
    return response?.data || 0;
  },

  async createHtmlStore(input: ICreateHtmlStoreInput): Promise<IHtmlStore> {
    const response = await save_content({
      schema: 'HtmlStore',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo HtmlStore');
    return response.data as IHtmlStore;
  },

  async updateHtmlStore(id: string, input: Partial<ICreateHtmlStoreInput>): Promise<IHtmlStore> {
    const response = await update_partial_content({
      schema: 'HtmlStore',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật HtmlStore');
    return response.data as IHtmlStore;
  },

  async deleteHtmlStore(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'HtmlStore',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiHtmlStore(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'HtmlStore',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockHtmlStore(id: string, locked: boolean = true): Promise<IHtmlStore> {
    const response = await lock_content({
      schema: 'HtmlStore',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa HtmlStore');
    return response.data as IHtmlStore;
  },

  async findHtmlStoreDto(id: string): Promise<IHtmlStore> {
    const response = await query<IHtmlStore>(FIND_HTMLSTORE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy HtmlStore');
    return response.data;
  },
  async queryHtmlStoresDto(filter?: GeneralCollectionFilter): Promise<IHtmlStoreListResponse> {
    return await queryList<IHtmlStore>(
      QUERY_HTMLSTORES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default htmlStoreService;
