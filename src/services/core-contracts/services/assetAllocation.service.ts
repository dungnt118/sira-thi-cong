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

import { FIND_ASSETALLOCATION_DTO, QUERY_ASSETALLOCATIONS_DTO } from '../queries/assetAllocation.queries';
import {
  IAssetAllocation,
  ICreateAssetAllocationInput,
  IAssetAllocationListResponse
} from '../types/assetAllocation.types';

export const assetAllocationService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AssetAllocation', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AssetAllocation');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAssetAllocationListResponse> {
    return await query_content<IAssetAllocation>({ schema: 'AssetAllocation', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AssetAllocation', filter });
    return response?.data || 0;
  },

  async createAssetAllocation(input: ICreateAssetAllocationInput): Promise<IAssetAllocation> {
    const response = await save_content({
      schema: 'AssetAllocation',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AssetAllocation');
    return response.data as IAssetAllocation;
  },

  async updateAssetAllocation(id: string, input: Partial<ICreateAssetAllocationInput>): Promise<IAssetAllocation> {
    const response = await update_partial_content({
      schema: 'AssetAllocation',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AssetAllocation');
    return response.data as IAssetAllocation;
  },

  async deleteAssetAllocation(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AssetAllocation',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAssetAllocation(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AssetAllocation',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAssetAllocation(id: string, locked: boolean = true): Promise<IAssetAllocation> {
    const response = await lock_content({
      schema: 'AssetAllocation',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AssetAllocation');
    return response.data as IAssetAllocation;
  },

  async findAssetAllocationDto(id: string): Promise<IAssetAllocation> {
    const response = await query<IAssetAllocation>(FIND_ASSETALLOCATION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AssetAllocation');
    return response.data;
  },
  async queryAssetAllocationsDto(filter?: GeneralCollectionFilter): Promise<IAssetAllocationListResponse> {
    return await queryList<IAssetAllocation>(
      QUERY_ASSETALLOCATIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default assetAllocationService;
