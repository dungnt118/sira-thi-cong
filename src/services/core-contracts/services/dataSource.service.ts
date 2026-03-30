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

import { FIND_DATASOURCE_DTO, QUERY_DATASOURCES_DTO } from '../queries/dataSource.queries';
import {
  IDataSource,
  ICreateDataSourceInput,
  IDataSourceListResponse
} from '../types/dataSource.types';

export const dataSourceService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'DataSource', _id: id });
    if (!response.data) throw new Error('Không tìm thấy DataSource');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IDataSourceListResponse> {
    return await query_content<IDataSource>({ schema: 'DataSource', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'DataSource', filter });
    return response?.data || 0;
  },

  async createDataSource(input: ICreateDataSourceInput): Promise<IDataSource> {
    const response = await save_content({
      schema: 'DataSource',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo DataSource');
    return response.data as IDataSource;
  },

  async updateDataSource(id: string, input: Partial<ICreateDataSourceInput>): Promise<IDataSource> {
    const response = await update_partial_content({
      schema: 'DataSource',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật DataSource');
    return response.data as IDataSource;
  },

  async deleteDataSource(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'DataSource',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiDataSource(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'DataSource',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockDataSource(id: string, locked: boolean = true): Promise<IDataSource> {
    const response = await lock_content({
      schema: 'DataSource',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa DataSource');
    return response.data as IDataSource;
  },

  async findDataSourceDto(id: string): Promise<IDataSource> {
    const response = await query<IDataSource>(FIND_DATASOURCE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy DataSource');
    return response.data;
  },
  async queryDataSourcesDto(filter?: GeneralCollectionFilter): Promise<IDataSourceListResponse> {
    return await queryList<IDataSource>(
      QUERY_DATASOURCES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default dataSourceService;
