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

import { FIND_PROJECTCLOSEOUTPACKAGE_DTO, QUERY_PROJECTCLOSEOUTPACKAGES_DTO } from '../queries/projectCloseoutPackage.queries';
import {
  IProjectCloseoutPackage,
  ICreateProjectCloseoutPackageInput,
  IProjectCloseoutPackageListResponse
} from '../types/projectCloseoutPackage.types';

export const projectCloseoutPackageService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ProjectCloseoutPackage', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ProjectCloseoutPackage');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IProjectCloseoutPackageListResponse> {
    return await query_content<IProjectCloseoutPackage>({ schema: 'ProjectCloseoutPackage', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ProjectCloseoutPackage', filter });
    return response?.data || 0;
  },

  async createProjectCloseoutPackage(input: ICreateProjectCloseoutPackageInput): Promise<IProjectCloseoutPackage> {
    const response = await save_content({
      schema: 'ProjectCloseoutPackage',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ProjectCloseoutPackage');
    return response.data as IProjectCloseoutPackage;
  },

  async updateProjectCloseoutPackage(id: string, input: Partial<ICreateProjectCloseoutPackageInput>): Promise<IProjectCloseoutPackage> {
    const response = await update_partial_content({
      schema: 'ProjectCloseoutPackage',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ProjectCloseoutPackage');
    return response.data as IProjectCloseoutPackage;
  },

  async deleteProjectCloseoutPackage(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ProjectCloseoutPackage',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiProjectCloseoutPackage(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ProjectCloseoutPackage',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockProjectCloseoutPackage(id: string, locked: boolean = true): Promise<IProjectCloseoutPackage> {
    const response = await lock_content({
      schema: 'ProjectCloseoutPackage',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ProjectCloseoutPackage');
    return response.data as IProjectCloseoutPackage;
  },

  async findProjectCloseoutPackageDto(id: string): Promise<IProjectCloseoutPackage> {
    const response = await query<IProjectCloseoutPackage>(FIND_PROJECTCLOSEOUTPACKAGE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ProjectCloseoutPackage');
    return response.data;
  },
  async queryProjectCloseoutPackagesDto(filter?: GeneralCollectionFilter): Promise<IProjectCloseoutPackageListResponse> {
    return await queryList<IProjectCloseoutPackage>(
      QUERY_PROJECTCLOSEOUTPACKAGES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default projectCloseoutPackageService;
