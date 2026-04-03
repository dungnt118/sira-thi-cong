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

import { FIND_COMPANYBANKACCOUNT_DTO, QUERY_COMPANYBANKACCOUNTS_DTO } from '../queries/companyBankAccount.queries';
import {
  ICompanyBankAccount,
  ICreateCompanyBankAccountInput,
  ICompanyBankAccountListResponse
} from '../types/companyBankAccount.types';

export const companyBankAccountService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'CompanyBankAccount', _id: id });
    if (!response.data) throw new Error('Không tìm thấy CompanyBankAccount');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ICompanyBankAccountListResponse> {
    return await query_content<ICompanyBankAccount>({ schema: 'CompanyBankAccount', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'CompanyBankAccount', filter });
    return response?.data || 0;
  },

  async createCompanyBankAccount(input: ICreateCompanyBankAccountInput): Promise<ICompanyBankAccount> {
    const response = await save_content({
      schema: 'CompanyBankAccount',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo CompanyBankAccount');
    return response.data as ICompanyBankAccount;
  },

  async updateCompanyBankAccount(id: string, input: Partial<ICreateCompanyBankAccountInput>): Promise<ICompanyBankAccount> {
    const response = await update_partial_content({
      schema: 'CompanyBankAccount',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật CompanyBankAccount');
    return response.data as ICompanyBankAccount;
  },

  async deleteCompanyBankAccount(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'CompanyBankAccount',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiCompanyBankAccount(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'CompanyBankAccount',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockCompanyBankAccount(id: string, locked: boolean = true): Promise<ICompanyBankAccount> {
    const response = await lock_content({
      schema: 'CompanyBankAccount',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa CompanyBankAccount');
    return response.data as ICompanyBankAccount;
  },

  async findCompanyBankAccountDto(id: string): Promise<ICompanyBankAccount> {
    const response = await query<ICompanyBankAccount>(FIND_COMPANYBANKACCOUNT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy CompanyBankAccount');
    return response.data;
  },
  async queryCompanyBankAccountsDto(filter?: GeneralCollectionFilter): Promise<ICompanyBankAccountListResponse> {
    return await queryList<ICompanyBankAccount>(
      QUERY_COMPANYBANKACCOUNTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default companyBankAccountService;
