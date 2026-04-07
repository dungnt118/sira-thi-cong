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

import { FIND_WORKERTEAM_DTO, QUERY_WORKERTEAMS_DTO } from '../queries/workerTeam.queries';
import {
  IWorkerTeam,
  ICreateWorkerTeamInput,
  IWorkerTeamListResponse
} from '../types/workerTeam.types';

export const workerTeamService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'WorkerTeam', _id: id });
    if (!response.data) throw new Error('Không tìm thấy WorkerTeam');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IWorkerTeamListResponse> {
    return await query_content<IWorkerTeam>({ schema: 'WorkerTeam', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'WorkerTeam', filter });
    return response?.data || 0;
  },

  async createWorkerTeam(input: ICreateWorkerTeamInput): Promise<IWorkerTeam> {
    const response = await save_content({
      schema: 'WorkerTeam',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo WorkerTeam');
    return response.data as IWorkerTeam;
  },

  async updateWorkerTeam(id: string, input: Partial<ICreateWorkerTeamInput>): Promise<IWorkerTeam> {
    const response = await update_partial_content({
      schema: 'WorkerTeam',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật WorkerTeam');
    return response.data as IWorkerTeam;
  },

  async deleteWorkerTeam(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'WorkerTeam',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiWorkerTeam(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'WorkerTeam',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockWorkerTeam(id: string, locked: boolean = true): Promise<IWorkerTeam> {
    const response = await lock_content({
      schema: 'WorkerTeam',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa WorkerTeam');
    return response.data as IWorkerTeam;
  },

  async findWorkerTeamDto(id: string): Promise<IWorkerTeam> {
    const response = await query<IWorkerTeam>(FIND_WORKERTEAM_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy WorkerTeam');
    return response.data;
  },
  async queryWorkerTeamsDto(filter?: GeneralCollectionFilter): Promise<IWorkerTeamListResponse> {
    return await queryList<IWorkerTeam>(
      QUERY_WORKERTEAMS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default workerTeamService;
