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

import { FIND_APPLICATION_DTO, QUERY_APPLICATIONS_DTO } from '../queries/application.queries';
import {
  IApplication,
  ICreateApplicationInput,
  IApplicationListResponse
} from '../types/application.types';

export const applicationService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Application', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Application');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IApplicationListResponse> {
    return await query_content<IApplication>({ schema: 'Application', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Application', filter });
    return response?.data || 0;
  },

  async createApplication(input: ICreateApplicationInput): Promise<IApplication> {
    const response = await save_content({
      schema: 'Application',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Application');
    return response.data as IApplication;
  },

  async updateApplication(id: string, input: Partial<ICreateApplicationInput>): Promise<IApplication> {
    const response = await update_partial_content({
      schema: 'Application',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Application');
    return response.data as IApplication;
  },

  async deleteApplication(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Application',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiApplication(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Application',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockApplication(id: string, locked: boolean = true): Promise<IApplication> {
    const response = await lock_content({
      schema: 'Application',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Application');
    return response.data as IApplication;
  },

  async findApplicationDto(id: string): Promise<IApplication> {
    const response = await query<IApplication>(FIND_APPLICATION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Application');
    return response.data;
  },
  async queryApplicationsDto(filter?: GeneralCollectionFilter): Promise<IApplicationListResponse> {
    return await queryList<IApplication>(
      QUERY_APPLICATIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default applicationService;
