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

import { FIND_CHARTTEMPLATE_DTO, QUERY_CHARTTEMPLATES_DTO } from '../queries/chartTemplate.queries';
import {
  IChartTemplate,
  ICreateChartTemplateInput,
  IChartTemplateListResponse
} from '../types/chartTemplate.types';

export const chartTemplateService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ChartTemplate', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ChartTemplate');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IChartTemplateListResponse> {
    return await query_content<IChartTemplate>({ schema: 'ChartTemplate', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ChartTemplate', filter });
    return response?.data || 0;
  },

  async createChartTemplate(input: ICreateChartTemplateInput): Promise<IChartTemplate> {
    const response = await save_content({
      schema: 'ChartTemplate',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ChartTemplate');
    return response.data as IChartTemplate;
  },

  async updateChartTemplate(id: string, input: Partial<ICreateChartTemplateInput>): Promise<IChartTemplate> {
    const response = await update_partial_content({
      schema: 'ChartTemplate',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ChartTemplate');
    return response.data as IChartTemplate;
  },

  async deleteChartTemplate(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ChartTemplate',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiChartTemplate(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ChartTemplate',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockChartTemplate(id: string, locked: boolean = true): Promise<IChartTemplate> {
    const response = await lock_content({
      schema: 'ChartTemplate',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ChartTemplate');
    return response.data as IChartTemplate;
  },

  async findChartTemplateDto(id: string): Promise<IChartTemplate> {
    const response = await query<IChartTemplate>(FIND_CHARTTEMPLATE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ChartTemplate');
    return response.data;
  },
  async queryChartTemplatesDto(filter?: GeneralCollectionFilter): Promise<IChartTemplateListResponse> {
    return await queryList<IChartTemplate>(
      QUERY_CHARTTEMPLATES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default chartTemplateService;
