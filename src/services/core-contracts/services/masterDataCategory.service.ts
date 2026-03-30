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

import { FIND_MASTERDATACATEGORY_DTO, QUERY_MASTERDATACATEGORYS_DTO } from '../queries/masterDataCategory.queries';
import {
  IMasterDataCategory,
  ICreateMasterDataCategoryInput,
  IMasterDataCategoryListResponse
} from '../types/masterDataCategory.types';

export const masterDataCategoryService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'MasterDataCategory', _id: id });
    if (!response.data) throw new Error('Không tìm thấy MasterDataCategory');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMasterDataCategoryListResponse> {
    return await query_content<IMasterDataCategory>({ schema: 'MasterDataCategory', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'MasterDataCategory', filter });
    return response?.data || 0;
  },

  async createMasterDataCategory(input: ICreateMasterDataCategoryInput): Promise<IMasterDataCategory> {
    const response = await save_content({
      schema: 'MasterDataCategory',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo MasterDataCategory');
    return response.data as IMasterDataCategory;
  },

  async updateMasterDataCategory(id: string, input: Partial<ICreateMasterDataCategoryInput>): Promise<IMasterDataCategory> {
    const response = await update_partial_content({
      schema: 'MasterDataCategory',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật MasterDataCategory');
    return response.data as IMasterDataCategory;
  },

  async deleteMasterDataCategory(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'MasterDataCategory',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMasterDataCategory(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'MasterDataCategory',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMasterDataCategory(id: string, locked: boolean = true): Promise<IMasterDataCategory> {
    const response = await lock_content({
      schema: 'MasterDataCategory',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa MasterDataCategory');
    return response.data as IMasterDataCategory;
  },

  async findMasterDataCategoryDto(id: string): Promise<IMasterDataCategory> {
    const response = await query<IMasterDataCategory>(FIND_MASTERDATACATEGORY_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy MasterDataCategory');
    return response.data;
  },
  async queryMasterDataCategorysDto(filter?: GeneralCollectionFilter): Promise<IMasterDataCategoryListResponse> {
    return await queryList<IMasterDataCategory>(
      QUERY_MASTERDATACATEGORYS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default masterDataCategoryService;
