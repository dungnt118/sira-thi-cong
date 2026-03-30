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

import { FIND_PORTALTHREAD_DTO, QUERY_PORTALTHREADS_DTO } from '../queries/portalThread.queries';
import {
  IPortalThread,
  ICreatePortalThreadInput,
  IPortalThreadListResponse
} from '../types/portalThread.types';

export const portalThreadService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PortalThread', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PortalThread');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPortalThreadListResponse> {
    return await query_content<IPortalThread>({ schema: 'PortalThread', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PortalThread', filter });
    return response?.data || 0;
  },

  async createPortalThread(input: ICreatePortalThreadInput): Promise<IPortalThread> {
    const response = await save_content({
      schema: 'PortalThread',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PortalThread');
    return response.data as IPortalThread;
  },

  async updatePortalThread(id: string, input: Partial<ICreatePortalThreadInput>): Promise<IPortalThread> {
    const response = await update_partial_content({
      schema: 'PortalThread',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PortalThread');
    return response.data as IPortalThread;
  },

  async deletePortalThread(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PortalThread',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPortalThread(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PortalThread',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPortalThread(id: string, locked: boolean = true): Promise<IPortalThread> {
    const response = await lock_content({
      schema: 'PortalThread',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PortalThread');
    return response.data as IPortalThread;
  },

  async findPortalThreadDto(id: string): Promise<IPortalThread> {
    const response = await query<IPortalThread>(FIND_PORTALTHREAD_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PortalThread');
    return response.data;
  },
  async queryPortalThreadsDto(filter?: GeneralCollectionFilter): Promise<IPortalThreadListResponse> {
    return await queryList<IPortalThread>(
      QUERY_PORTALTHREADS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default portalThreadService;
