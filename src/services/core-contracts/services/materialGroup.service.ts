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

import { FIND_MATERIALGROUP_DTO, QUERY_MATERIALGROUPS_DTO } from '../queries/materialGroup.queries';
import {
  IMaterialGroup,
  ICreateMaterialGroupInput,
  IMaterialGroupListResponse
} from '../types/materialGroup.types';

export const materialGroupService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'MaterialGroup', _id: id });
    if (!response.data) throw new Error('Không tìm thấy MaterialGroup');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMaterialGroupListResponse> {
    return await query_content<IMaterialGroup>({ schema: 'MaterialGroup', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'MaterialGroup', filter });
    return response?.data || 0;
  },

  async createMaterialGroup(input: ICreateMaterialGroupInput): Promise<IMaterialGroup> {
    const response = await save_content({
      schema: 'MaterialGroup',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo MaterialGroup');
    return response.data as IMaterialGroup;
  },

  async updateMaterialGroup(id: string, input: Partial<ICreateMaterialGroupInput>): Promise<IMaterialGroup> {
    const response = await update_partial_content({
      schema: 'MaterialGroup',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật MaterialGroup');
    return response.data as IMaterialGroup;
  },

  async deleteMaterialGroup(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'MaterialGroup',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMaterialGroup(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'MaterialGroup',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMaterialGroup(id: string, locked: boolean = true): Promise<IMaterialGroup> {
    const response = await lock_content({
      schema: 'MaterialGroup',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa MaterialGroup');
    return response.data as IMaterialGroup;
  },

  async findMaterialGroupDto(id: string): Promise<IMaterialGroup> {
    const response = await query<IMaterialGroup>(FIND_MATERIALGROUP_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy MaterialGroup');
    return response.data;
  },
  async queryMaterialGroupsDto(filter?: GeneralCollectionFilter): Promise<IMaterialGroupListResponse> {
    return await queryList<IMaterialGroup>(
      QUERY_MATERIALGROUPS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default materialGroupService;
