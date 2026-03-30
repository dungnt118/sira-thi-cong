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

import { FIND_DEPARTMENT_DTO, QUERY_DEPARTMENTS_DTO } from '../queries/department.queries';
import {
  IDepartment,
  ICreateDepartmentInput,
  IDepartmentListResponse
} from '../types/department.types';

export const departmentService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Department', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Department');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IDepartmentListResponse> {
    return await query_content<IDepartment>({ schema: 'Department', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Department', filter });
    return response?.data || 0;
  },

  async createDepartment(input: ICreateDepartmentInput): Promise<IDepartment> {
    const response = await save_content({
      schema: 'Department',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Department');
    return response.data as IDepartment;
  },

  async updateDepartment(id: string, input: Partial<ICreateDepartmentInput>): Promise<IDepartment> {
    const response = await update_partial_content({
      schema: 'Department',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Department');
    return response.data as IDepartment;
  },

  async deleteDepartment(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Department',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiDepartment(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Department',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockDepartment(id: string, locked: boolean = true): Promise<IDepartment> {
    const response = await lock_content({
      schema: 'Department',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Department');
    return response.data as IDepartment;
  },

  async findDepartmentDto(id: string): Promise<IDepartment> {
    const response = await query<IDepartment>(FIND_DEPARTMENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Department');
    return response.data;
  },
  async queryDepartmentsDto(filter?: GeneralCollectionFilter): Promise<IDepartmentListResponse> {
    return await queryList<IDepartment>(
      QUERY_DEPARTMENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default departmentService;
