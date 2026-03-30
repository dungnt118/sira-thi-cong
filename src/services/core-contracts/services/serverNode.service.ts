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

import { FIND_SERVERNODE_DTO, QUERY_SERVERNODES_DTO } from '../queries/serverNode.queries';
import {
  IServerNode,
  ICreateServerNodeInput,
  IServerNodeListResponse
} from '../types/serverNode.types';

export const serverNodeService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ServerNode', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ServerNode');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IServerNodeListResponse> {
    return await query_content<IServerNode>({ schema: 'ServerNode', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ServerNode', filter });
    return response?.data || 0;
  },

  async createServerNode(input: ICreateServerNodeInput): Promise<IServerNode> {
    const response = await save_content({
      schema: 'ServerNode',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ServerNode');
    return response.data as IServerNode;
  },

  async updateServerNode(id: string, input: Partial<ICreateServerNodeInput>): Promise<IServerNode> {
    const response = await update_partial_content({
      schema: 'ServerNode',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ServerNode');
    return response.data as IServerNode;
  },

  async deleteServerNode(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ServerNode',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiServerNode(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ServerNode',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockServerNode(id: string, locked: boolean = true): Promise<IServerNode> {
    const response = await lock_content({
      schema: 'ServerNode',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ServerNode');
    return response.data as IServerNode;
  },

  async findServerNodeDto(id: string): Promise<IServerNode> {
    const response = await query<IServerNode>(FIND_SERVERNODE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ServerNode');
    return response.data;
  },
  async queryServerNodesDto(filter?: GeneralCollectionFilter): Promise<IServerNodeListResponse> {
    return await queryList<IServerNode>(
      QUERY_SERVERNODES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default serverNodeService;
