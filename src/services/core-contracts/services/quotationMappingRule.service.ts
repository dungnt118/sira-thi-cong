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

import { FIND_QUOTATIONMAPPINGRULE_DTO, QUERY_QUOTATIONMAPPINGRULES_DTO } from '../queries/quotationMappingRule.queries';
import {
  IQuotationMappingRule,
  ICreateQuotationMappingRuleInput,
  IQuotationMappingRuleListResponse
} from '../types/quotationMappingRule.types';

export const quotationMappingRuleService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'QuotationMappingRule', _id: id });
    if (!response.data) throw new Error('Không tìm thấy QuotationMappingRule');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IQuotationMappingRuleListResponse> {
    return await query_content<IQuotationMappingRule>({ schema: 'QuotationMappingRule', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'QuotationMappingRule', filter });
    return response?.data || 0;
  },

  async createQuotationMappingRule(input: ICreateQuotationMappingRuleInput): Promise<IQuotationMappingRule> {
    const response = await save_content({
      schema: 'QuotationMappingRule',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo QuotationMappingRule');
    return response.data as IQuotationMappingRule;
  },

  async updateQuotationMappingRule(id: string, input: Partial<ICreateQuotationMappingRuleInput>): Promise<IQuotationMappingRule> {
    const response = await update_partial_content({
      schema: 'QuotationMappingRule',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật QuotationMappingRule');
    return response.data as IQuotationMappingRule;
  },

  async deleteQuotationMappingRule(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'QuotationMappingRule',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiQuotationMappingRule(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'QuotationMappingRule',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockQuotationMappingRule(id: string, locked: boolean = true): Promise<IQuotationMappingRule> {
    const response = await lock_content({
      schema: 'QuotationMappingRule',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa QuotationMappingRule');
    return response.data as IQuotationMappingRule;
  },

  async findQuotationMappingRuleDto(id: string): Promise<IQuotationMappingRule> {
    const response = await query<IQuotationMappingRule>(FIND_QUOTATIONMAPPINGRULE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy QuotationMappingRule');
    return response.data;
  },
  async queryQuotationMappingRulesDto(filter?: GeneralCollectionFilter): Promise<IQuotationMappingRuleListResponse> {
    return await queryList<IQuotationMappingRule>(
      QUERY_QUOTATIONMAPPINGRULES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default quotationMappingRuleService;
