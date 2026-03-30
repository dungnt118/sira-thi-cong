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

import { FIND_MATERIAL_DTO, QUERY_MATERIALS_DTO } from '../queries/material.queries';
import {
  IMaterial,
  ICreateMaterialInput,
  IMaterialListResponse
} from '../types/material.types';

export const materialService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Material', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Material');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMaterialListResponse> {
    return await query_content<IMaterial>({ schema: 'Material', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Material', filter });
    return response?.data || 0;
  },

  async createMaterial(input: ICreateMaterialInput): Promise<IMaterial> {
    const response = await save_content({
      schema: 'Material',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Material');
    return response.data as IMaterial;
  },

  async updateMaterial(id: string, input: Partial<ICreateMaterialInput>): Promise<IMaterial> {
    const response = await update_partial_content({
      schema: 'Material',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Material');
    return response.data as IMaterial;
  },

  async deleteMaterial(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Material',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMaterial(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Material',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMaterial(id: string, locked: boolean = true): Promise<IMaterial> {
    const response = await lock_content({
      schema: 'Material',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Material');
    return response.data as IMaterial;
  },

  async findMaterialDto(id: string): Promise<IMaterial> {
    const response = await query<IMaterial>(FIND_MATERIAL_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Material');
    return response.data;
  },
  async queryMaterialsDto(filter?: GeneralCollectionFilter): Promise<IMaterialListResponse> {
    return await queryList<IMaterial>(
      QUERY_MATERIALS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default materialService;
