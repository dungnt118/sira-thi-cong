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

import { FIND_PROJECT_DTO, QUERY_PROJECTS_DTO } from '../queries/project.queries';
import {
  IProject,
  ICreateProjectInput,
  IProjectListResponse
} from '../types/project.types';

export const projectService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Project', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Project');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IProjectListResponse> {
    return await query_content<IProject>({ schema: 'Project', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Project', filter });
    return response?.data || 0;
  },

  async createProject(input: ICreateProjectInput): Promise<IProject> {
    const response = await save_content({
      schema: 'Project',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Project');
    return response.data as IProject;
  },

  async updateProject(id: string, input: Partial<ICreateProjectInput>): Promise<IProject> {
    const response = await update_partial_content({
      schema: 'Project',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Project');
    return response.data as IProject;
  },

  async deleteProject(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Project',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiProject(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Project',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockProject(id: string, locked: boolean = true): Promise<IProject> {
    const response = await lock_content({
      schema: 'Project',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Project');
    return response.data as IProject;
  },

  async findProjectDto(id: string): Promise<IProject> {
    const response = await query<IProject>(FIND_PROJECT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Project');
    return response.data;
  },
  async queryProjectsDto(filter?: GeneralCollectionFilter): Promise<IProjectListResponse> {
    return await queryList<IProject>(
      QUERY_PROJECTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default projectService;
