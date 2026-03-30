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

import { FIND_DEBTCOLLECTIONTASK_DTO, QUERY_DEBTCOLLECTIONTASKS_DTO } from '../queries/debtCollectionTask.queries';
import {
  IDebtCollectionTask,
  ICreateDebtCollectionTaskInput,
  IDebtCollectionTaskListResponse
} from '../types/debtCollectionTask.types';

export const debtCollectionTaskService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'DebtCollectionTask', _id: id });
    if (!response.data) throw new Error('Không tìm thấy DebtCollectionTask');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IDebtCollectionTaskListResponse> {
    return await query_content<IDebtCollectionTask>({ schema: 'DebtCollectionTask', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'DebtCollectionTask', filter });
    return response?.data || 0;
  },

  async createDebtCollectionTask(input: ICreateDebtCollectionTaskInput): Promise<IDebtCollectionTask> {
    const response = await save_content({
      schema: 'DebtCollectionTask',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo DebtCollectionTask');
    return response.data as IDebtCollectionTask;
  },

  async updateDebtCollectionTask(id: string, input: Partial<ICreateDebtCollectionTaskInput>): Promise<IDebtCollectionTask> {
    const response = await update_partial_content({
      schema: 'DebtCollectionTask',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật DebtCollectionTask');
    return response.data as IDebtCollectionTask;
  },

  async deleteDebtCollectionTask(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'DebtCollectionTask',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiDebtCollectionTask(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'DebtCollectionTask',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockDebtCollectionTask(id: string, locked: boolean = true): Promise<IDebtCollectionTask> {
    const response = await lock_content({
      schema: 'DebtCollectionTask',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa DebtCollectionTask');
    return response.data as IDebtCollectionTask;
  },

  async findDebtCollectionTaskDto(id: string): Promise<IDebtCollectionTask> {
    const response = await query<IDebtCollectionTask>(FIND_DEBTCOLLECTIONTASK_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy DebtCollectionTask');
    return response.data;
  },
  async queryDebtCollectionTasksDto(filter?: GeneralCollectionFilter): Promise<IDebtCollectionTaskListResponse> {
    return await queryList<IDebtCollectionTask>(
      QUERY_DEBTCOLLECTIONTASKS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default debtCollectionTaskService;
