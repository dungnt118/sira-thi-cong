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

import { FIND_TENANTREGISTRATION_DTO, QUERY_TENANTREGISTRATIONS_DTO } from '../queries/tenantRegistration.queries';
import {
  ITenantRegistration,
  ICreateTenantRegistrationInput,
  ITenantRegistrationListResponse
} from '../types/tenantRegistration.types';

export const tenantRegistrationService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'TenantRegistration', _id: id });
    if (!response.data) throw new Error('Không tìm thấy TenantRegistration');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ITenantRegistrationListResponse> {
    return await query_content<ITenantRegistration>({ schema: 'TenantRegistration', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'TenantRegistration', filter });
    return response?.data || 0;
  },

  async createTenantRegistration(input: ICreateTenantRegistrationInput): Promise<ITenantRegistration> {
    const response = await save_content({
      schema: 'TenantRegistration',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo TenantRegistration');
    return response.data as ITenantRegistration;
  },

  async updateTenantRegistration(id: string, input: Partial<ICreateTenantRegistrationInput>): Promise<ITenantRegistration> {
    const response = await update_partial_content({
      schema: 'TenantRegistration',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật TenantRegistration');
    return response.data as ITenantRegistration;
  },

  async deleteTenantRegistration(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'TenantRegistration',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiTenantRegistration(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'TenantRegistration',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockTenantRegistration(id: string, locked: boolean = true): Promise<ITenantRegistration> {
    const response = await lock_content({
      schema: 'TenantRegistration',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa TenantRegistration');
    return response.data as ITenantRegistration;
  },

  async findTenantRegistrationDto(id: string): Promise<ITenantRegistration> {
    const response = await query<ITenantRegistration>(FIND_TENANTREGISTRATION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy TenantRegistration');
    return response.data;
  },
  async queryTenantRegistrationsDto(filter?: GeneralCollectionFilter): Promise<ITenantRegistrationListResponse> {
    return await queryList<ITenantRegistration>(
      QUERY_TENANTREGISTRATIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default tenantRegistrationService;
