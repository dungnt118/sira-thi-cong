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

import { FIND_ESTIMATEPRICINGPOLICY_DTO, QUERY_ESTIMATEPRICINGPOLICYS_DTO } from '../queries/estimatePricingPolicy.queries';
import {
  IEstimatePricingPolicy,
  ICreateEstimatePricingPolicyInput,
  IEstimatePricingPolicyListResponse
} from '../types/estimatePricingPolicy.types';

export const estimatePricingPolicyService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'EstimatePricingPolicy', _id: id });
    if (!response.data) throw new Error('Không tìm thấy EstimatePricingPolicy');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IEstimatePricingPolicyListResponse> {
    return await query_content<IEstimatePricingPolicy>({ schema: 'EstimatePricingPolicy', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'EstimatePricingPolicy', filter });
    return response?.data || 0;
  },

  async createEstimatePricingPolicy(input: ICreateEstimatePricingPolicyInput): Promise<IEstimatePricingPolicy> {
    const response = await save_content({
      schema: 'EstimatePricingPolicy',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo EstimatePricingPolicy');
    return response.data as IEstimatePricingPolicy;
  },

  /** Lưu nhiều EstimatePricingPolicy — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManyEstimatePricingPolicys(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'EstimatePricingPolicy',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt EstimatePricingPolicy');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt EstimatePricingPolicy (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateEstimatePricingPolicy(id: string, input: Partial<ICreateEstimatePricingPolicyInput>): Promise<IEstimatePricingPolicy> {
    const response = await update_partial_content({
      schema: 'EstimatePricingPolicy',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật EstimatePricingPolicy');
    return response.data as IEstimatePricingPolicy;
  },

  async deleteEstimatePricingPolicy(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'EstimatePricingPolicy',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiEstimatePricingPolicy(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'EstimatePricingPolicy',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockEstimatePricingPolicy(id: string, locked: boolean = true): Promise<IEstimatePricingPolicy> {
    const response = await lock_content({
      schema: 'EstimatePricingPolicy',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa EstimatePricingPolicy');
    return response.data as IEstimatePricingPolicy;
  },

  async findEstimatePricingPolicyDto(id: string): Promise<IEstimatePricingPolicy> {
    const response = await query<IEstimatePricingPolicy>(FIND_ESTIMATEPRICINGPOLICY_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy EstimatePricingPolicy');
    return response.data;
  },
  async queryEstimatePricingPolicysDto(filter?: GeneralCollectionFilter): Promise<IEstimatePricingPolicyListResponse> {
    return await queryList<IEstimatePricingPolicy>(
      QUERY_ESTIMATEPRICINGPOLICYS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default estimatePricingPolicyService;
