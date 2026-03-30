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

import { FIND_APPDB_DTO, QUERY_APPDBS_DTO } from '../queries/appDB.queries';
import {
  IAppDB,
  ICreateAppDBInput,
  IAppDBListResponse
} from '../types/appDB.types';

export const appDBService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AppDB', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AppDB');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAppDBListResponse> {
    return await query_content<IAppDB>({ schema: 'AppDB', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AppDB', filter });
    return response?.data || 0;
  },

  async createAppDB(input: ICreateAppDBInput): Promise<IAppDB> {
    const response = await save_content({
      schema: 'AppDB',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AppDB');
    return response.data as IAppDB;
  },

  async updateAppDB(id: string, input: Partial<ICreateAppDBInput>): Promise<IAppDB> {
    const response = await update_partial_content({
      schema: 'AppDB',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AppDB');
    return response.data as IAppDB;
  },

  async deleteAppDB(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AppDB',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAppDB(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AppDB',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAppDB(id: string, locked: boolean = true): Promise<IAppDB> {
    const response = await lock_content({
      schema: 'AppDB',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AppDB');
    return response.data as IAppDB;
  },

  async findAppDBDto(id: string): Promise<IAppDB> {
    const response = await query<IAppDB>(FIND_APPDB_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AppDB');
    return response.data;
  },
  async queryAppDBsDto(filter?: GeneralCollectionFilter): Promise<IAppDBListResponse> {
    return await queryList<IAppDB>(
      QUERY_APPDBS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default appDBService;
