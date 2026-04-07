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

import { FIND_WORKER_DTO, QUERY_WORKERS_DTO } from '../queries/worker.queries';
import {
  IWorker,
  ICreateWorkerInput,
  IWorkerListResponse
} from '../types/worker.types';

export const workerService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Worker', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Worker');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWorkerListResponse> {
    return await query_content<IWorker>({ schema: 'Worker', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Worker', filter });
    return response?.data || 0;
  },

  async createWorker(input: ICreateWorkerInput): Promise<IWorker> {
    const response = await save_content({
      schema: 'Worker',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Worker');
    return response.data as IWorker;
  },

  async updateWorker(id: string, input: Partial<ICreateWorkerInput>): Promise<IWorker> {
    const response = await update_partial_content({
      schema: 'Worker',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Worker');
    return response.data as IWorker;
  },

  async deleteWorker(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Worker',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWorker(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Worker',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWorker(id: string, locked: boolean = true): Promise<IWorker> {
    const response = await lock_content({
      schema: 'Worker',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Worker');
    return response.data as IWorker;
  },

  async findWorkerDto(id: string): Promise<IWorker> {
    const response = await query<IWorker>(FIND_WORKER_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Worker');
    return response.data;
  },
  async queryWorkersDto(filter?: GeneralCollectionFilter): Promise<IWorkerListResponse> {
    return await queryList<IWorker>(
      QUERY_WORKERS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default workerService;
