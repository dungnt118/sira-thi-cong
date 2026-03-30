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

import { FIND_EMPLOYEE_DTO, QUERY_EMPLOYEES_DTO } from '../queries/employee.queries';
import {
  IEmployee,
  ICreateEmployeeInput,
  IEmployeeListResponse
} from '../types/employee.types';

export const employeeService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Employee', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Employee');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IEmployeeListResponse> {
    return await query_content<IEmployee>({ schema: 'Employee', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Employee', filter });
    return response?.data || 0;
  },

  async createEmployee(input: ICreateEmployeeInput): Promise<IEmployee> {
    const response = await save_content({
      schema: 'Employee',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Employee');
    return response.data as IEmployee;
  },

  async updateEmployee(id: string, input: Partial<ICreateEmployeeInput>): Promise<IEmployee> {
    const response = await update_partial_content({
      schema: 'Employee',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Employee');
    return response.data as IEmployee;
  },

  async deleteEmployee(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Employee',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiEmployee(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Employee',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockEmployee(id: string, locked: boolean = true): Promise<IEmployee> {
    const response = await lock_content({
      schema: 'Employee',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Employee');
    return response.data as IEmployee;
  },

  async findEmployeeDto(id: string): Promise<IEmployee> {
    const response = await query<IEmployee>(FIND_EMPLOYEE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Employee');
    return response.data;
  },
  async queryEmployeesDto(filter?: GeneralCollectionFilter): Promise<IEmployeeListResponse> {
    return await queryList<IEmployee>(
      QUERY_EMPLOYEES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default employeeService;
