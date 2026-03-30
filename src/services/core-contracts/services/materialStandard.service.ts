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

import { FIND_MATERIALSTANDARD_DTO, QUERY_MATERIALSTANDARDS_DTO } from '../queries/materialStandard.queries';
import {
  IMaterialStandard,
  ICreateMaterialStandardInput,
  IMaterialStandardListResponse
} from '../types/materialStandard.types';

export const materialStandardService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'MaterialStandard', _id: id });
    if (!response.data) throw new Error('Không tìm thấy MaterialStandard');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMaterialStandardListResponse> {
    return await query_content<IMaterialStandard>({ schema: 'MaterialStandard', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'MaterialStandard', filter });
    return response?.data || 0;
  },

  async createMaterialStandard(input: ICreateMaterialStandardInput): Promise<IMaterialStandard> {
    const response = await save_content({
      schema: 'MaterialStandard',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo MaterialStandard');
    return response.data as IMaterialStandard;
  },

  async updateMaterialStandard(id: string, input: Partial<ICreateMaterialStandardInput>): Promise<IMaterialStandard> {
    const response = await update_partial_content({
      schema: 'MaterialStandard',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật MaterialStandard');
    return response.data as IMaterialStandard;
  },

  async deleteMaterialStandard(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'MaterialStandard',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMaterialStandard(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'MaterialStandard',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMaterialStandard(id: string, locked: boolean = true): Promise<IMaterialStandard> {
    const response = await lock_content({
      schema: 'MaterialStandard',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa MaterialStandard');
    return response.data as IMaterialStandard;
  },

  async findMaterialStandardDto(id: string): Promise<IMaterialStandard> {
    const response = await query<IMaterialStandard>(FIND_MATERIALSTANDARD_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy MaterialStandard');
    return response.data;
  },
  async queryMaterialStandardsDto(filter?: GeneralCollectionFilter): Promise<IMaterialStandardListResponse> {
    return await queryList<IMaterialStandard>(
      QUERY_MATERIALSTANDARDS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default materialStandardService;
