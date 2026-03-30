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

import { FIND_GUESTACCOUNT_DTO, QUERY_GUESTACCOUNTS_DTO } from '../queries/guestAccount.queries';
import {
  IGuestAccount,
  ICreateGuestAccountInput,
  IGuestAccountListResponse
} from '../types/guestAccount.types';

export const guestAccountService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'GuestAccount', _id: id });
    if (!response.data) throw new Error('Không tìm thấy GuestAccount');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IGuestAccountListResponse> {
    return await query_content<IGuestAccount>({ schema: 'GuestAccount', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'GuestAccount', filter });
    return response?.data || 0;
  },

  async createGuestAccount(input: ICreateGuestAccountInput): Promise<IGuestAccount> {
    const response = await save_content({
      schema: 'GuestAccount',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo GuestAccount');
    return response.data as IGuestAccount;
  },

  async updateGuestAccount(id: string, input: Partial<ICreateGuestAccountInput>): Promise<IGuestAccount> {
    const response = await update_partial_content({
      schema: 'GuestAccount',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật GuestAccount');
    return response.data as IGuestAccount;
  },

  async deleteGuestAccount(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'GuestAccount',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiGuestAccount(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'GuestAccount',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockGuestAccount(id: string, locked: boolean = true): Promise<IGuestAccount> {
    const response = await lock_content({
      schema: 'GuestAccount',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa GuestAccount');
    return response.data as IGuestAccount;
  },

  async findGuestAccountDto(id: string): Promise<IGuestAccount> {
    const response = await query<IGuestAccount>(FIND_GUESTACCOUNT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy GuestAccount');
    return response.data;
  },
  async queryGuestAccountsDto(filter?: GeneralCollectionFilter): Promise<IGuestAccountListResponse> {
    return await queryList<IGuestAccount>(
      QUERY_GUESTACCOUNTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default guestAccountService;
