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

import { FIND_STARTACTIVITYINDEX_DTO, QUERY_STARTACTIVITYINDEXS_DTO } from '../queries/startActivityIndex.queries';
import {
  IStartActivityIndex,
  ICreateStartActivityIndexInput,
  IStartActivityIndexListResponse
} from '../types/startActivityIndex.types';

export const startActivityIndexService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'StartActivityIndex', _id: id });
    if (!response.data) throw new Error('Không tìm thấy StartActivityIndex');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IStartActivityIndexListResponse> {
    return await query_content<IStartActivityIndex>({ schema: 'StartActivityIndex', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'StartActivityIndex', filter });
    return response?.data || 0;
  },

  async createStartActivityIndex(input: ICreateStartActivityIndexInput): Promise<IStartActivityIndex> {
    const response = await save_content({
      schema: 'StartActivityIndex',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo StartActivityIndex');
    return response.data as IStartActivityIndex;
  },

  async updateStartActivityIndex(id: string, input: Partial<ICreateStartActivityIndexInput>): Promise<IStartActivityIndex> {
    const response = await update_partial_content({
      schema: 'StartActivityIndex',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật StartActivityIndex');
    return response.data as IStartActivityIndex;
  },

  async deleteStartActivityIndex(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'StartActivityIndex',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiStartActivityIndex(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'StartActivityIndex',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockStartActivityIndex(id: string, locked: boolean = true): Promise<IStartActivityIndex> {
    const response = await lock_content({
      schema: 'StartActivityIndex',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa StartActivityIndex');
    return response.data as IStartActivityIndex;
  },

  async findStartActivityIndexDto(id: string): Promise<IStartActivityIndex> {
    const response = await query<IStartActivityIndex>(FIND_STARTACTIVITYINDEX_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy StartActivityIndex');
    return response.data;
  },
  async queryStartActivityIndexsDto(filter?: GeneralCollectionFilter): Promise<IStartActivityIndexListResponse> {
    return await queryList<IStartActivityIndex>(
      QUERY_STARTACTIVITYINDEXS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default startActivityIndexService;
