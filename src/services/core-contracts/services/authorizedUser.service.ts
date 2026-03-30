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

import { FIND_AUTHORIZEDUSER_DTO, QUERY_AUTHORIZEDUSERS_DTO } from '../queries/authorizedUser.queries';
import {
  IAuthorizedUser,
  ICreateAuthorizedUserInput,
  IAuthorizedUserListResponse
} from '../types/authorizedUser.types';

export const authorizedUserService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AuthorizedUser', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AuthorizedUser');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAuthorizedUserListResponse> {
    return await query_content<IAuthorizedUser>({ schema: 'AuthorizedUser', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AuthorizedUser', filter });
    return response?.data || 0;
  },

  async createAuthorizedUser(input: ICreateAuthorizedUserInput): Promise<IAuthorizedUser> {
    const response = await save_content({
      schema: 'AuthorizedUser',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AuthorizedUser');
    return response.data as IAuthorizedUser;
  },

  async updateAuthorizedUser(id: string, input: Partial<ICreateAuthorizedUserInput>): Promise<IAuthorizedUser> {
    const response = await update_partial_content({
      schema: 'AuthorizedUser',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AuthorizedUser');
    return response.data as IAuthorizedUser;
  },

  async deleteAuthorizedUser(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AuthorizedUser',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAuthorizedUser(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AuthorizedUser',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAuthorizedUser(id: string, locked: boolean = true): Promise<IAuthorizedUser> {
    const response = await lock_content({
      schema: 'AuthorizedUser',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AuthorizedUser');
    return response.data as IAuthorizedUser;
  },

  async findAuthorizedUserDto(id: string): Promise<IAuthorizedUser> {
    const response = await query<IAuthorizedUser>(FIND_AUTHORIZEDUSER_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AuthorizedUser');
    return response.data;
  },
  async queryAuthorizedUsersDto(filter?: GeneralCollectionFilter): Promise<IAuthorizedUserListResponse> {
    return await queryList<IAuthorizedUser>(
      QUERY_AUTHORIZEDUSERS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default authorizedUserService;
