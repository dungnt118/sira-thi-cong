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

import { FIND_ESTIMATETEMPLATE_DTO, QUERY_ESTIMATETEMPLATES_DTO } from '../queries/estimateTemplate.queries';
import {
  IEstimateTemplate,
  ICreateEstimateTemplateInput,
  IEstimateTemplateListResponse
} from '../types/estimateTemplate.types';

export const estimateTemplateService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'EstimateTemplate', _id: id });
    if (!response.data) throw new Error('Không tìm thấy EstimateTemplate');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IEstimateTemplateListResponse> {
    return await query_content<IEstimateTemplate>({ schema: 'EstimateTemplate', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'EstimateTemplate', filter });
    return response?.data || 0;
  },

  async createEstimateTemplate(input: ICreateEstimateTemplateInput): Promise<IEstimateTemplate> {
    const response = await save_content({
      schema: 'EstimateTemplate',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo EstimateTemplate');
    return response.data as IEstimateTemplate;
  },

  /** Lưu nhiều EstimateTemplate — phải dùng save_many_content (mảng), không dùng save_content (một Dictionary). */
  async saveManyEstimateTemplates(data: any[]): Promise<any[]> {
    if (!data.length) return [];
    const response = await save_many_content({
      schema: 'EstimateTemplate',
      data: data,
      update_if_duplicate: false
    });
    if (response?.code != null && response.code !== 0 && response.code !== 202) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt EstimateTemplate');
    }
    const savedData = response?.data;
    if (savedData == null) {
      throw new Error(response?.message || 'Không thể lưu hàng loạt EstimateTemplate (thiếu dữ liệu trả về)');
    }
    return Array.isArray(savedData) ? savedData : [savedData];
  },

  async updateEstimateTemplate(id: string, input: Partial<ICreateEstimateTemplateInput>): Promise<IEstimateTemplate> {
    const response = await update_partial_content({
      schema: 'EstimateTemplate',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật EstimateTemplate');
    return response.data as IEstimateTemplate;
  },

  async deleteEstimateTemplate(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'EstimateTemplate',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiEstimateTemplate(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'EstimateTemplate',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockEstimateTemplate(id: string, locked: boolean = true): Promise<IEstimateTemplate> {
    const response = await lock_content({
      schema: 'EstimateTemplate',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa EstimateTemplate');
    return response.data as IEstimateTemplate;
  },

  async findEstimateTemplateDto(id: string): Promise<IEstimateTemplate> {
    const response = await query<IEstimateTemplate>(FIND_ESTIMATETEMPLATE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy EstimateTemplate');
    return response.data;
  },
  async queryEstimateTemplatesDto(filter?: GeneralCollectionFilter): Promise<IEstimateTemplateListResponse> {
    return await queryList<IEstimateTemplate>(
      QUERY_ESTIMATETEMPLATES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default estimateTemplateService;
