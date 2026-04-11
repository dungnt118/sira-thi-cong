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

import { FIND_EMPLOYEELIFECYCLEEVENT_DTO, QUERY_EMPLOYEELIFECYCLEEVENTS_DTO } from '../queries/employeeLifecycleEvent.queries';
import {
  IEmployeeLifecycleEvent,
  ICreateEmployeeLifecycleEventInput,
  IEmployeeLifecycleEventListResponse
} from '../types/employeeLifecycleEvent.types';

export const employeeLifecycleEventService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'EmployeeLifecycleEvent', _id: id });
    if (!response.data) throw new Error('Không tìm thấy EmployeeLifecycleEvent');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IEmployeeLifecycleEventListResponse> {
    return await query_content<IEmployeeLifecycleEvent>({ schema: 'EmployeeLifecycleEvent', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'EmployeeLifecycleEvent', filter });
    return response?.data || 0;
  },

  async createEmployeeLifecycleEvent(input: ICreateEmployeeLifecycleEventInput): Promise<IEmployeeLifecycleEvent> {
    const response = await save_content({
      schema: 'EmployeeLifecycleEvent',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo EmployeeLifecycleEvent');
    return response.data as IEmployeeLifecycleEvent;
  },

  async updateEmployeeLifecycleEvent(id: string, input: Partial<ICreateEmployeeLifecycleEventInput>): Promise<IEmployeeLifecycleEvent> {
    const response = await update_partial_content({
      schema: 'EmployeeLifecycleEvent',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật EmployeeLifecycleEvent');
    return response.data as IEmployeeLifecycleEvent;
  },

  async deleteEmployeeLifecycleEvent(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'EmployeeLifecycleEvent',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiEmployeeLifecycleEvent(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'EmployeeLifecycleEvent',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockEmployeeLifecycleEvent(id: string, locked: boolean = true): Promise<IEmployeeLifecycleEvent> {
    const response = await lock_content({
      schema: 'EmployeeLifecycleEvent',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa EmployeeLifecycleEvent');
    return response.data as IEmployeeLifecycleEvent;
  },

  async findEmployeeLifecycleEventDto(id: string): Promise<IEmployeeLifecycleEvent> {
    const response = await query<IEmployeeLifecycleEvent>(FIND_EMPLOYEELIFECYCLEEVENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy EmployeeLifecycleEvent');
    return response.data;
  },
  async queryEmployeeLifecycleEventsDto(filter?: GeneralCollectionFilter): Promise<IEmployeeLifecycleEventListResponse> {
    return await queryList<IEmployeeLifecycleEvent>(
      QUERY_EMPLOYEELIFECYCLEEVENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default employeeLifecycleEventService;
