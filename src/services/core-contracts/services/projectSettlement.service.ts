import { query, queryList } from 'app/services/graphqlService'; // TODO: Check path
import { GeneralCollectionFilter } from 'types/filters/GeneralCollectionFilter';
import {
  find_content,
  query_content,
  count_content,
  save_content,
  save_many_content,
  update_partial_content,
  delete_content,
  delete_multi_content,
  lock_content
} from 'app/store/actions/data/data.action'; // TODO: Check path

import { FIND_PROJECTSETTLEMENT_DTO, QUERY_PROJECTSETTLEMENTS_DTO } from '../queries/projectSettlement.queries';
import {
  IProjectSettlement,
  ICreateProjectSettlementInput,
  IProjectSettlementListResponse
} from '../types/projectSettlement.types';

export const projectSettlementService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ProjectSettlement', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ProjectSettlement');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IProjectSettlementListResponse> {
    return await query_content<IProjectSettlement>({ schema: 'ProjectSettlement', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ProjectSettlement', filter });
    return response?.data || 0;
  },

  async createProjectSettlement(input: ICreateProjectSettlementInput): Promise<IProjectSettlement> {
    const response = await save_content({
      schema: 'ProjectSettlement',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ProjectSettlement');
    return response.data as IProjectSettlement;
  },

  /** Lưu nhiều ProjectSettlement — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManyProjectSettlements(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'ProjectSettlement',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt ProjectSettlement');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt ProjectSettlement (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateProjectSettlement(id: string, input: Partial<ICreateProjectSettlementInput>): Promise<IProjectSettlement> {
    const response = await update_partial_content({
      schema: 'ProjectSettlement',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ProjectSettlement');
    return response.data as IProjectSettlement;
  },

  async deleteProjectSettlement(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ProjectSettlement',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiProjectSettlement(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ProjectSettlement',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockProjectSettlement(id: string, locked: boolean = true): Promise<IProjectSettlement> {
    const response = await lock_content({
      schema: 'ProjectSettlement',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ProjectSettlement');
    return response.data as IProjectSettlement;
  },

  async findProjectSettlementDto(id: string): Promise<IProjectSettlement> {
    const response = await query<IProjectSettlement>(FIND_PROJECTSETTLEMENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ProjectSettlement');
    return response.data;
  },
  async queryProjectSettlementsDto(filter?: GeneralCollectionFilter): Promise<IProjectSettlementListResponse> {
    return await queryList<IProjectSettlement>(
      QUERY_PROJECTSETTLEMENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default projectSettlementService;
