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

import { FIND_ASSET_DTO, QUERY_ASSETS_DTO } from '../queries/asset.queries';
import {
  IAsset,
  ICreateAssetInput,
  IAssetListResponse
} from '../types/asset.types';

export const assetService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Asset', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Asset');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAssetListResponse> {
    return await query_content<IAsset>({ schema: 'Asset', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Asset', filter });
    return response?.data || 0;
  },

  async createAsset(input: ICreateAssetInput): Promise<IAsset> {
    const response = await save_content({
      schema: 'Asset',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Asset');
    return response.data as IAsset;
  },

  async updateAsset(id: string, input: Partial<ICreateAssetInput>): Promise<IAsset> {
    const response = await update_partial_content({
      schema: 'Asset',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Asset');
    return response.data as IAsset;
  },

  async deleteAsset(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Asset',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAsset(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Asset',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAsset(id: string, locked: boolean = true): Promise<IAsset> {
    const response = await lock_content({
      schema: 'Asset',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Asset');
    return response.data as IAsset;
  },

  async findAssetDto(id: string): Promise<IAsset> {
    const response = await query<IAsset>(FIND_ASSET_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Asset');
    return response.data;
  },
  async queryAssetsDto(filter?: GeneralCollectionFilter): Promise<IAssetListResponse> {
    return await queryList<IAsset>(
      QUERY_ASSETS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default assetService;
