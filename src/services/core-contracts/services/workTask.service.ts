import { query, queryList } from 'app/services/graphqlService'; // TODO: Check path
import { GeneralCollectionFilter } from 'types/filters/GeneralCollectionFilter';
import {
  find_content,
  query_content,
  count_content,
  save_content,
  save_many_content,
  update_partial_content,
  delete_content,
  delete_multi_content,
  lock_content
} from 'app/store/actions/data/data.action'; // TODO: Check path

import { FIND_WORKTASK_DTO, QUERY_WORKTASKS_DTO } from '../queries/workTask.queries';
import {
  IWorkTask,
  ICreateWorkTaskInput,
  IWorkTaskListResponse
} from '../types/workTask.types';

export const workTaskService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WorkTask', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WorkTask');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWorkTaskListResponse> {
    return await query_content<IWorkTask>({ schema: 'WorkTask', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WorkTask', filter });
    return response?.data || 0;
  },

  async createWorkTask(input: ICreateWorkTaskInput): Promise<IWorkTask> {
    const response = await save_content({
      schema: 'WorkTask',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WorkTask');
    return response.data as IWorkTask;
  },

  /** Lưu nhiều WorkTask — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManyWorkTasks(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'WorkTask',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt WorkTask');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt WorkTask (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateWorkTask(id: string, input: Partial<ICreateWorkTaskInput>): Promise<IWorkTask> {
    const response = await update_partial_content({
      schema: 'WorkTask',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WorkTask');
    return response.data as IWorkTask;
  },

  async deleteWorkTask(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WorkTask',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWorkTask(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WorkTask',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWorkTask(id: string, locked: boolean = true): Promise<IWorkTask> {
    const response = await lock_content({
      schema: 'WorkTask',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WorkTask');
    return response.data as IWorkTask;
  },

  async findWorkTaskDto(id: string): Promise<IWorkTask> {
    const response = await query<IWorkTask>(FIND_WORKTASK_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WorkTask');
    return response.data;
  },
  async queryWorkTasksDto(filter?: GeneralCollectionFilter): Promise<IWorkTaskListResponse> {
    return await queryList<IWorkTask>(
      QUERY_WORKTASKS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default workTaskService;
