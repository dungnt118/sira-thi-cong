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

import { FIND_MULTIIMPORTQUEUE_DTO, QUERY_MULTIIMPORTQUEUES_DTO } from '../queries/multiImportQueue.queries';
import {
  IMultiImportQueue,
  ICreateMultiImportQueueInput,
  IMultiImportQueueListResponse
} from '../types/multiImportQueue.types';

export const multiImportQueueService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'MultiImportQueue', _id: id });
    if (!response.data) throw new Error('Không tìm thấy MultiImportQueue');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMultiImportQueueListResponse> {
    return await query_content<IMultiImportQueue>({ schema: 'MultiImportQueue', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'MultiImportQueue', filter });
    return response?.data || 0;
  },

  async createMultiImportQueue(input: ICreateMultiImportQueueInput): Promise<IMultiImportQueue> {
    const response = await save_content({
      schema: 'MultiImportQueue',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo MultiImportQueue');
    return response.data as IMultiImportQueue;
  },

  async updateMultiImportQueue(id: string, input: Partial<ICreateMultiImportQueueInput>): Promise<IMultiImportQueue> {
    const response = await update_partial_content({
      schema: 'MultiImportQueue',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật MultiImportQueue');
    return response.data as IMultiImportQueue;
  },

  async deleteMultiImportQueue(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'MultiImportQueue',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMultiImportQueue(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'MultiImportQueue',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMultiImportQueue(id: string, locked: boolean = true): Promise<IMultiImportQueue> {
    const response = await lock_content({
      schema: 'MultiImportQueue',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa MultiImportQueue');
    return response.data as IMultiImportQueue;
  },

  async findMultiImportQueueDto(id: string): Promise<IMultiImportQueue> {
    const response = await query<IMultiImportQueue>(FIND_MULTIIMPORTQUEUE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy MultiImportQueue');
    return response.data;
  },
  async queryMultiImportQueuesDto(filter?: GeneralCollectionFilter): Promise<IMultiImportQueueListResponse> {
    return await queryList<IMultiImportQueue>(
      QUERY_MULTIIMPORTQUEUES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default multiImportQueueService;
