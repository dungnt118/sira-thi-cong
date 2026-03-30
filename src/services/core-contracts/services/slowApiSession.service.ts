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

import { FIND_SLOWAPISESSION_DTO, QUERY_SLOWAPISESSIONS_DTO } from '../queries/slowApiSession.queries';
import {
  ISlowApiSession,
  ICreateSlowApiSessionInput,
  ISlowApiSessionListResponse
} from '../types/slowApiSession.types';

export const slowApiSessionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SlowApiSession', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SlowApiSession');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISlowApiSessionListResponse> {
    return await query_content<ISlowApiSession>({ schema: 'SlowApiSession', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SlowApiSession', filter });
    return response?.data || 0;
  },

  async createSlowApiSession(input: ICreateSlowApiSessionInput): Promise<ISlowApiSession> {
    const response = await save_content({
      schema: 'SlowApiSession',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SlowApiSession');
    return response.data as ISlowApiSession;
  },

  async updateSlowApiSession(id: string, input: Partial<ICreateSlowApiSessionInput>): Promise<ISlowApiSession> {
    const response = await update_partial_content({
      schema: 'SlowApiSession',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SlowApiSession');
    return response.data as ISlowApiSession;
  },

  async deleteSlowApiSession(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SlowApiSession',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSlowApiSession(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SlowApiSession',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSlowApiSession(id: string, locked: boolean = true): Promise<ISlowApiSession> {
    const response = await lock_content({
      schema: 'SlowApiSession',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SlowApiSession');
    return response.data as ISlowApiSession;
  },

  async findSlowApiSessionDto(id: string): Promise<ISlowApiSession> {
    const response = await query<ISlowApiSession>(FIND_SLOWAPISESSION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SlowApiSession');
    return response.data;
  },
  async querySlowApiSessionsDto(filter?: GeneralCollectionFilter): Promise<ISlowApiSessionListResponse> {
    return await queryList<ISlowApiSession>(
      QUERY_SLOWAPISESSIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default slowApiSessionService;
