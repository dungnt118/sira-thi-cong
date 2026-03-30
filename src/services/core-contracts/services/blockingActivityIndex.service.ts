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

import { FIND_BLOCKINGACTIVITYINDEX_DTO, QUERY_BLOCKINGACTIVITYINDEXS_DTO } from '../queries/blockingActivityIndex.queries';
import {
  IBlockingActivityIndex,
  ICreateBlockingActivityIndexInput,
  IBlockingActivityIndexListResponse
} from '../types/blockingActivityIndex.types';

export const blockingActivityIndexService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'BlockingActivityIndex', _id: id });
    if (!response.data) throw new Error('Không tìm thấy BlockingActivityIndex');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IBlockingActivityIndexListResponse> {
    return await query_content<IBlockingActivityIndex>({ schema: 'BlockingActivityIndex', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'BlockingActivityIndex', filter });
    return response?.data || 0;
  },

  async createBlockingActivityIndex(input: ICreateBlockingActivityIndexInput): Promise<IBlockingActivityIndex> {
    const response = await save_content({
      schema: 'BlockingActivityIndex',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo BlockingActivityIndex');
    return response.data as IBlockingActivityIndex;
  },

  async updateBlockingActivityIndex(id: string, input: Partial<ICreateBlockingActivityIndexInput>): Promise<IBlockingActivityIndex> {
    const response = await update_partial_content({
      schema: 'BlockingActivityIndex',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật BlockingActivityIndex');
    return response.data as IBlockingActivityIndex;
  },

  async deleteBlockingActivityIndex(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'BlockingActivityIndex',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiBlockingActivityIndex(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'BlockingActivityIndex',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockBlockingActivityIndex(id: string, locked: boolean = true): Promise<IBlockingActivityIndex> {
    const response = await lock_content({
      schema: 'BlockingActivityIndex',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa BlockingActivityIndex');
    return response.data as IBlockingActivityIndex;
  },

  async findBlockingActivityIndexDto(id: string): Promise<IBlockingActivityIndex> {
    const response = await query<IBlockingActivityIndex>(FIND_BLOCKINGACTIVITYINDEX_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy BlockingActivityIndex');
    return response.data;
  },
  async queryBlockingActivityIndexsDto(filter?: GeneralCollectionFilter): Promise<IBlockingActivityIndexListResponse> {
    return await queryList<IBlockingActivityIndex>(
      QUERY_BLOCKINGACTIVITYINDEXS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default blockingActivityIndexService;
