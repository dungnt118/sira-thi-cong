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

import { FIND_BENEFICIARYBANKCONTACT_DTO, QUERY_BENEFICIARYBANKCONTACTS_DTO } from '../queries/beneficiaryBankContact.queries';
import {
  IBeneficiaryBankContact,
  ICreateBeneficiaryBankContactInput,
  IBeneficiaryBankContactListResponse
} from '../types/beneficiaryBankContact.types';

export const beneficiaryBankContactService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'BeneficiaryBankContact', _id: id });
    if (!response.data) throw new Error('Không tìm thấy BeneficiaryBankContact');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IBeneficiaryBankContactListResponse> {
    return await query_content<IBeneficiaryBankContact>({ schema: 'BeneficiaryBankContact', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'BeneficiaryBankContact', filter });
    return response?.data || 0;
  },

  async createBeneficiaryBankContact(input: ICreateBeneficiaryBankContactInput): Promise<IBeneficiaryBankContact> {
    const response = await save_content({
      schema: 'BeneficiaryBankContact',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo BeneficiaryBankContact');
    return response.data as IBeneficiaryBankContact;
  },

  async updateBeneficiaryBankContact(id: string, input: Partial<ICreateBeneficiaryBankContactInput>): Promise<IBeneficiaryBankContact> {
    const response = await update_partial_content({
      schema: 'BeneficiaryBankContact',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật BeneficiaryBankContact');
    return response.data as IBeneficiaryBankContact;
  },

  async deleteBeneficiaryBankContact(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'BeneficiaryBankContact',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiBeneficiaryBankContact(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'BeneficiaryBankContact',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockBeneficiaryBankContact(id: string, locked: boolean = true): Promise<IBeneficiaryBankContact> {
    const response = await lock_content({
      schema: 'BeneficiaryBankContact',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa BeneficiaryBankContact');
    return response.data as IBeneficiaryBankContact;
  },

  async findBeneficiaryBankContactDto(id: string): Promise<IBeneficiaryBankContact> {
    const response = await query<IBeneficiaryBankContact>(FIND_BENEFICIARYBANKCONTACT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy BeneficiaryBankContact');
    return response.data;
  },
  async queryBeneficiaryBankContactsDto(filter?: GeneralCollectionFilter): Promise<IBeneficiaryBankContactListResponse> {
    return await queryList<IBeneficiaryBankContact>(
      QUERY_BENEFICIARYBANKCONTACTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default beneficiaryBankContactService;
