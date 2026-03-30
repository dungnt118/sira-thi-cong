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

import { FIND_HRMROLECONFIGITEM_DTO, QUERY_HRMROLECONFIGITEMS_DTO } from '../queries/hrmRoleConfigItem.queries';
import {
  IHrmRoleConfigItem,
  ICreateHrmRoleConfigItemInput,
  IHrmRoleConfigItemListResponse
} from '../types/hrmRoleConfigItem.types';

export const hrmRoleConfigItemService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'HrmRoleConfigItem', _id: id });
    if (!response.data) throw new Error('Không tìm thấy HrmRoleConfigItem');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IHrmRoleConfigItemListResponse> {
    return await query_content<IHrmRoleConfigItem>({ schema: 'HrmRoleConfigItem', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'HrmRoleConfigItem', filter });
    return response?.data || 0;
  },

  async createHrmRoleConfigItem(input: ICreateHrmRoleConfigItemInput): Promise<IHrmRoleConfigItem> {
    const response = await save_content({
      schema: 'HrmRoleConfigItem',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo HrmRoleConfigItem');
    return response.data as IHrmRoleConfigItem;
  },

  async updateHrmRoleConfigItem(id: string, input: Partial<ICreateHrmRoleConfigItemInput>): Promise<IHrmRoleConfigItem> {
    const response = await update_partial_content({
      schema: 'HrmRoleConfigItem',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật HrmRoleConfigItem');
    return response.data as IHrmRoleConfigItem;
  },

  async deleteHrmRoleConfigItem(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'HrmRoleConfigItem',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiHrmRoleConfigItem(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'HrmRoleConfigItem',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockHrmRoleConfigItem(id: string, locked: boolean = true): Promise<IHrmRoleConfigItem> {
    const response = await lock_content({
      schema: 'HrmRoleConfigItem',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa HrmRoleConfigItem');
    return response.data as IHrmRoleConfigItem;
  },

  async findHrmRoleConfigItemDto(id: string): Promise<IHrmRoleConfigItem> {
    const response = await query<IHrmRoleConfigItem>(FIND_HRMROLECONFIGITEM_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy HrmRoleConfigItem');
    return response.data;
  },
  async queryHrmRoleConfigItemsDto(filter?: GeneralCollectionFilter): Promise<IHrmRoleConfigItemListResponse> {
    return await queryList<IHrmRoleConfigItem>(
      QUERY_HRMROLECONFIGITEMS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default hrmRoleConfigItemService;
