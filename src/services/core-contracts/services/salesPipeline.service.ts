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

import { FIND_SALESPIPELINE_DTO, QUERY_SALESPIPELINES_DTO } from '../queries/salesPipeline.queries';
import {
  ISalesPipeline,
  ICreateSalesPipelineInput,
  ISalesPipelineListResponse
} from '../types/salesPipeline.types';

export const salesPipelineService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SalesPipeline', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SalesPipeline');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISalesPipelineListResponse> {
    return await query_content<ISalesPipeline>({ schema: 'SalesPipeline', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SalesPipeline', filter });
    return response?.data || 0;
  },

  async createSalesPipeline(input: ICreateSalesPipelineInput): Promise<ISalesPipeline> {
    const response = await save_content({
      schema: 'SalesPipeline',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SalesPipeline');
    return response.data as ISalesPipeline;
  },

  async updateSalesPipeline(id: string, input: Partial<ICreateSalesPipelineInput>): Promise<ISalesPipeline> {
    const response = await update_partial_content({
      schema: 'SalesPipeline',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SalesPipeline');
    return response.data as ISalesPipeline;
  },

  async deleteSalesPipeline(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SalesPipeline',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSalesPipeline(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SalesPipeline',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSalesPipeline(id: string, locked: boolean = true): Promise<ISalesPipeline> {
    const response = await lock_content({
      schema: 'SalesPipeline',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SalesPipeline');
    return response.data as ISalesPipeline;
  },

  async findSalesPipelineDto(id: string): Promise<ISalesPipeline> {
    const response = await query<ISalesPipeline>(FIND_SALESPIPELINE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SalesPipeline');
    return response.data;
  },
  async querySalesPipelinesDto(filter?: GeneralCollectionFilter): Promise<ISalesPipelineListResponse> {
    return await queryList<ISalesPipeline>(
      QUERY_SALESPIPELINES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default salesPipelineService;
