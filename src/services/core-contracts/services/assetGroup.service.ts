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

import { FIND_ASSETGROUP_DTO, QUERY_ASSETGROUPS_DTO } from '../queries/assetGroup.queries';
import {
  IAssetGroup,
  ICreateAssetGroupInput,
  IAssetGroupListResponse
} from '../types/assetGroup.types';

export const assetGroupService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AssetGroup', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AssetGroup');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAssetGroupListResponse> {
    return await query_content<IAssetGroup>({ schema: 'AssetGroup', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AssetGroup', filter });
    return response?.data || 0;
  },

  async createAssetGroup(input: ICreateAssetGroupInput): Promise<IAssetGroup> {
    const response = await save_content({
      schema: 'AssetGroup',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AssetGroup');
    return response.data as IAssetGroup;
  },

  async updateAssetGroup(id: string, input: Partial<ICreateAssetGroupInput>): Promise<IAssetGroup> {
    const response = await update_partial_content({
      schema: 'AssetGroup',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AssetGroup');
    return response.data as IAssetGroup;
  },

  async deleteAssetGroup(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AssetGroup',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAssetGroup(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AssetGroup',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAssetGroup(id: string, locked: boolean = true): Promise<IAssetGroup> {
    const response = await lock_content({
      schema: 'AssetGroup',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AssetGroup');
    return response.data as IAssetGroup;
  },

  async findAssetGroupDto(id: string): Promise<IAssetGroup> {
    const response = await query<IAssetGroup>(FIND_ASSETGROUP_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AssetGroup');
    return response.data;
  },
  async queryAssetGroupsDto(filter?: GeneralCollectionFilter): Promise<IAssetGroupListResponse> {
    return await queryList<IAssetGroup>(
      QUERY_ASSETGROUPS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default assetGroupService;
