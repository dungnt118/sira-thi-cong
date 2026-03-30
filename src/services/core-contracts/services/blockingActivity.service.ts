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

import { FIND_BLOCKINGACTIVITY_DTO, QUERY_BLOCKINGACTIVITYS_DTO } from '../queries/blockingActivity.queries';
import {
  IBlockingActivity,
  ICreateBlockingActivityInput,
  IBlockingActivityListResponse
} from '../types/blockingActivity.types';

export const blockingActivityService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'BlockingActivity', _id: id });
    if (!response.data) throw new Error('Không tìm thấy BlockingActivity');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IBlockingActivityListResponse> {
    return await query_content<IBlockingActivity>({ schema: 'BlockingActivity', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'BlockingActivity', filter });
    return response?.data || 0;
  },

  async createBlockingActivity(input: ICreateBlockingActivityInput): Promise<IBlockingActivity> {
    const response = await save_content({
      schema: 'BlockingActivity',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo BlockingActivity');
    return response.data as IBlockingActivity;
  },

  async updateBlockingActivity(id: string, input: Partial<ICreateBlockingActivityInput>): Promise<IBlockingActivity> {
    const response = await update_partial_content({
      schema: 'BlockingActivity',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật BlockingActivity');
    return response.data as IBlockingActivity;
  },

  async deleteBlockingActivity(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'BlockingActivity',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiBlockingActivity(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'BlockingActivity',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockBlockingActivity(id: string, locked: boolean = true): Promise<IBlockingActivity> {
    const response = await lock_content({
      schema: 'BlockingActivity',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa BlockingActivity');
    return response.data as IBlockingActivity;
  },

  async findBlockingActivityDto(id: string): Promise<IBlockingActivity> {
    const response = await query<IBlockingActivity>(FIND_BLOCKINGACTIVITY_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy BlockingActivity');
    return response.data;
  },
  async queryBlockingActivitysDto(filter?: GeneralCollectionFilter): Promise<IBlockingActivityListResponse> {
    return await queryList<IBlockingActivity>(
      QUERY_BLOCKINGACTIVITYS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default blockingActivityService;
