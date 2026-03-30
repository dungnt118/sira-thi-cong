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

import { FIND_APPVERSION_DTO, QUERY_APPVERSIONS_DTO } from '../queries/appVersion.queries';
import {
  IAppVersion,
  ICreateAppVersionInput,
  IAppVersionListResponse
} from '../types/appVersion.types';

export const appVersionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AppVersion', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AppVersion');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAppVersionListResponse> {
    return await query_content<IAppVersion>({ schema: 'AppVersion', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AppVersion', filter });
    return response?.data || 0;
  },

  async createAppVersion(input: ICreateAppVersionInput): Promise<IAppVersion> {
    const response = await save_content({
      schema: 'AppVersion',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AppVersion');
    return response.data as IAppVersion;
  },

  async updateAppVersion(id: string, input: Partial<ICreateAppVersionInput>): Promise<IAppVersion> {
    const response = await update_partial_content({
      schema: 'AppVersion',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AppVersion');
    return response.data as IAppVersion;
  },

  async deleteAppVersion(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AppVersion',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAppVersion(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AppVersion',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAppVersion(id: string, locked: boolean = true): Promise<IAppVersion> {
    const response = await lock_content({
      schema: 'AppVersion',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AppVersion');
    return response.data as IAppVersion;
  },

  async findAppVersionDto(id: string): Promise<IAppVersion> {
    const response = await query<IAppVersion>(FIND_APPVERSION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AppVersion');
    return response.data;
  },
  async queryAppVersionsDto(filter?: GeneralCollectionFilter): Promise<IAppVersionListResponse> {
    return await queryList<IAppVersion>(
      QUERY_APPVERSIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default appVersionService;
