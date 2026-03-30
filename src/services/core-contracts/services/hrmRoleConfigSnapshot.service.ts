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

import { FIND_HRMROLECONFIGSNAPSHOT_DTO, QUERY_HRMROLECONFIGSNAPSHOTS_DTO } from '../queries/hrmRoleConfigSnapshot.queries';
import {
  IHrmRoleConfigSnapshot,
  ICreateHrmRoleConfigSnapshotInput,
  IHrmRoleConfigSnapshotListResponse
} from '../types/hrmRoleConfigSnapshot.types';

export const hrmRoleConfigSnapshotService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'HrmRoleConfigSnapshot', _id: id });
    if (!response.data) throw new Error('Không tìm thấy HrmRoleConfigSnapshot');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IHrmRoleConfigSnapshotListResponse> {
    return await query_content<IHrmRoleConfigSnapshot>({ schema: 'HrmRoleConfigSnapshot', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'HrmRoleConfigSnapshot', filter });
    return response?.data || 0;
  },

  async createHrmRoleConfigSnapshot(input: ICreateHrmRoleConfigSnapshotInput): Promise<IHrmRoleConfigSnapshot> {
    const response = await save_content({
      schema: 'HrmRoleConfigSnapshot',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo HrmRoleConfigSnapshot');
    return response.data as IHrmRoleConfigSnapshot;
  },

  async updateHrmRoleConfigSnapshot(id: string, input: Partial<ICreateHrmRoleConfigSnapshotInput>): Promise<IHrmRoleConfigSnapshot> {
    const response = await update_partial_content({
      schema: 'HrmRoleConfigSnapshot',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật HrmRoleConfigSnapshot');
    return response.data as IHrmRoleConfigSnapshot;
  },

  async deleteHrmRoleConfigSnapshot(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'HrmRoleConfigSnapshot',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiHrmRoleConfigSnapshot(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'HrmRoleConfigSnapshot',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockHrmRoleConfigSnapshot(id: string, locked: boolean = true): Promise<IHrmRoleConfigSnapshot> {
    const response = await lock_content({
      schema: 'HrmRoleConfigSnapshot',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa HrmRoleConfigSnapshot');
    return response.data as IHrmRoleConfigSnapshot;
  },

  async findHrmRoleConfigSnapshotDto(id: string): Promise<IHrmRoleConfigSnapshot> {
    const response = await query<IHrmRoleConfigSnapshot>(FIND_HRMROLECONFIGSNAPSHOT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy HrmRoleConfigSnapshot');
    return response.data;
  },
  async queryHrmRoleConfigSnapshotsDto(filter?: GeneralCollectionFilter): Promise<IHrmRoleConfigSnapshotListResponse> {
    return await queryList<IHrmRoleConfigSnapshot>(
      QUERY_HRMROLECONFIGSNAPSHOTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default hrmRoleConfigSnapshotService;
