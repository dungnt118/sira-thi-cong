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

import { FIND_APPSTORE_DTO, QUERY_APPSTORES_DTO } from '../queries/appStore.queries';
import {
  IAppStore,
  ICreateAppStoreInput,
  IAppStoreListResponse
} from '../types/appStore.types';

export const appStoreService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AppStore', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AppStore');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAppStoreListResponse> {
    return await query_content<IAppStore>({ schema: 'AppStore', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AppStore', filter });
    return response?.data || 0;
  },

  async createAppStore(input: ICreateAppStoreInput): Promise<IAppStore> {
    const response = await save_content({
      schema: 'AppStore',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AppStore');
    return response.data as IAppStore;
  },

  async updateAppStore(id: string, input: Partial<ICreateAppStoreInput>): Promise<IAppStore> {
    const response = await update_partial_content({
      schema: 'AppStore',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AppStore');
    return response.data as IAppStore;
  },

  async deleteAppStore(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AppStore',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAppStore(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AppStore',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAppStore(id: string, locked: boolean = true): Promise<IAppStore> {
    const response = await lock_content({
      schema: 'AppStore',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AppStore');
    return response.data as IAppStore;
  },

  async findAppStoreDto(id: string): Promise<IAppStore> {
    const response = await query<IAppStore>(FIND_APPSTORE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AppStore');
    return response.data;
  },
  async queryAppStoresDto(filter?: GeneralCollectionFilter): Promise<IAppStoreListResponse> {
    return await queryList<IAppStore>(
      QUERY_APPSTORES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default appStoreService;
