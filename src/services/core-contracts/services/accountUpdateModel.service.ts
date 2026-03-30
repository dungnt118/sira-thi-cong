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

import { FIND_ACCOUNTUPDATEMODEL_DTO, QUERY_ACCOUNTUPDATEMODELS_DTO } from '../queries/accountUpdateModel.queries';
import {
  IAccountUpdateModel,
  ICreateAccountUpdateModelInput,
  IAccountUpdateModelListResponse
} from '../types/accountUpdateModel.types';

export const accountUpdateModelService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AccountUpdateModel', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AccountUpdateModel');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAccountUpdateModelListResponse> {
    return await query_content<IAccountUpdateModel>({ schema: 'AccountUpdateModel', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AccountUpdateModel', filter });
    return response?.data || 0;
  },

  async createAccountUpdateModel(input: ICreateAccountUpdateModelInput): Promise<IAccountUpdateModel> {
    const response = await save_content({
      schema: 'AccountUpdateModel',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AccountUpdateModel');
    return response.data as IAccountUpdateModel;
  },

  async updateAccountUpdateModel(id: string, input: Partial<ICreateAccountUpdateModelInput>): Promise<IAccountUpdateModel> {
    const response = await update_partial_content({
      schema: 'AccountUpdateModel',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AccountUpdateModel');
    return response.data as IAccountUpdateModel;
  },

  async deleteAccountUpdateModel(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AccountUpdateModel',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAccountUpdateModel(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AccountUpdateModel',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAccountUpdateModel(id: string, locked: boolean = true): Promise<IAccountUpdateModel> {
    const response = await lock_content({
      schema: 'AccountUpdateModel',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AccountUpdateModel');
    return response.data as IAccountUpdateModel;
  },

  async findAccountUpdateModelDto(id: string): Promise<IAccountUpdateModel> {
    const response = await query<IAccountUpdateModel>(FIND_ACCOUNTUPDATEMODEL_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AccountUpdateModel');
    return response.data;
  },
  async queryAccountUpdateModelsDto(filter?: GeneralCollectionFilter): Promise<IAccountUpdateModelListResponse> {
    return await queryList<IAccountUpdateModel>(
      QUERY_ACCOUNTUPDATEMODELS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default accountUpdateModelService;
