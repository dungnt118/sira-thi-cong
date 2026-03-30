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

import { FIND_MASTERDATAITEM_DTO, QUERY_MASTERDATAITEMS_DTO } from '../queries/masterDataItem.queries';
import {
  IMasterDataItem,
  ICreateMasterDataItemInput,
  IMasterDataItemListResponse
} from '../types/masterDataItem.types';

export const masterDataItemService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'MasterDataItem', _id: id });
    if (!response.data) throw new Error('Không tìm thấy MasterDataItem');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMasterDataItemListResponse> {
    return await query_content<IMasterDataItem>({ schema: 'MasterDataItem', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'MasterDataItem', filter });
    return response?.data || 0;
  },

  async createMasterDataItem(input: ICreateMasterDataItemInput): Promise<IMasterDataItem> {
    const response = await save_content({
      schema: 'MasterDataItem',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo MasterDataItem');
    return response.data as IMasterDataItem;
  },

  async updateMasterDataItem(id: string, input: Partial<ICreateMasterDataItemInput>): Promise<IMasterDataItem> {
    const response = await update_partial_content({
      schema: 'MasterDataItem',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật MasterDataItem');
    return response.data as IMasterDataItem;
  },

  async deleteMasterDataItem(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'MasterDataItem',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMasterDataItem(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'MasterDataItem',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMasterDataItem(id: string, locked: boolean = true): Promise<IMasterDataItem> {
    const response = await lock_content({
      schema: 'MasterDataItem',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa MasterDataItem');
    return response.data as IMasterDataItem;
  },

  async findMasterDataItemDto(id: string): Promise<IMasterDataItem> {
    const response = await query<IMasterDataItem>(FIND_MASTERDATAITEM_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy MasterDataItem');
    return response.data;
  },
  async queryMasterDataItemsDto(filter?: GeneralCollectionFilter): Promise<IMasterDataItemListResponse> {
    return await queryList<IMasterDataItem>(
      QUERY_MASTERDATAITEMS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default masterDataItemService;
