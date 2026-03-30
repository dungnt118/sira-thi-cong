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

import { FIND_PROJECTASSIGNMENT_DTO, QUERY_PROJECTASSIGNMENTS_DTO } from '../queries/projectAssignment.queries';
import {
  IProjectAssignment,
  ICreateProjectAssignmentInput,
  IProjectAssignmentListResponse
} from '../types/projectAssignment.types';

export const projectAssignmentService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ProjectAssignment', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ProjectAssignment');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IProjectAssignmentListResponse> {
    return await query_content<IProjectAssignment>({ schema: 'ProjectAssignment', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ProjectAssignment', filter });
    return response?.data || 0;
  },

  async createProjectAssignment(input: ICreateProjectAssignmentInput): Promise<IProjectAssignment> {
    const response = await save_content({
      schema: 'ProjectAssignment',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ProjectAssignment');
    return response.data as IProjectAssignment;
  },

  async updateProjectAssignment(id: string, input: Partial<ICreateProjectAssignmentInput>): Promise<IProjectAssignment> {
    const response = await update_partial_content({
      schema: 'ProjectAssignment',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ProjectAssignment');
    return response.data as IProjectAssignment;
  },

  async deleteProjectAssignment(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ProjectAssignment',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiProjectAssignment(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ProjectAssignment',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockProjectAssignment(id: string, locked: boolean = true): Promise<IProjectAssignment> {
    const response = await lock_content({
      schema: 'ProjectAssignment',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ProjectAssignment');
    return response.data as IProjectAssignment;
  },

  async findProjectAssignmentDto(id: string): Promise<IProjectAssignment> {
    const response = await query<IProjectAssignment>(FIND_PROJECTASSIGNMENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ProjectAssignment');
    return response.data;
  },
  async queryProjectAssignmentsDto(filter?: GeneralCollectionFilter): Promise<IProjectAssignmentListResponse> {
    return await queryList<IProjectAssignment>(
      QUERY_PROJECTASSIGNMENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default projectAssignmentService;
