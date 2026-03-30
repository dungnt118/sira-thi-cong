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

import { FIND_SYSTEMPROMPTTEMPLATE_DTO, QUERY_SYSTEMPROMPTTEMPLATES_DTO } from '../queries/systemPromptTemplate.queries';
import {
  ISystemPromptTemplate,
  ICreateSystemPromptTemplateInput,
  ISystemPromptTemplateListResponse
} from '../types/systemPromptTemplate.types';

export const systemPromptTemplateService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SystemPromptTemplate', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SystemPromptTemplate');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISystemPromptTemplateListResponse> {
    return await query_content<ISystemPromptTemplate>({ schema: 'SystemPromptTemplate', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SystemPromptTemplate', filter });
    return response?.data || 0;
  },

  async createSystemPromptTemplate(input: ICreateSystemPromptTemplateInput): Promise<ISystemPromptTemplate> {
    const response = await save_content({
      schema: 'SystemPromptTemplate',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SystemPromptTemplate');
    return response.data as ISystemPromptTemplate;
  },

  async updateSystemPromptTemplate(id: string, input: Partial<ICreateSystemPromptTemplateInput>): Promise<ISystemPromptTemplate> {
    const response = await update_partial_content({
      schema: 'SystemPromptTemplate',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SystemPromptTemplate');
    return response.data as ISystemPromptTemplate;
  },

  async deleteSystemPromptTemplate(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SystemPromptTemplate',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSystemPromptTemplate(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SystemPromptTemplate',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSystemPromptTemplate(id: string, locked: boolean = true): Promise<ISystemPromptTemplate> {
    const response = await lock_content({
      schema: 'SystemPromptTemplate',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SystemPromptTemplate');
    return response.data as ISystemPromptTemplate;
  },

  async findSystemPromptTemplateDto(id: string): Promise<ISystemPromptTemplate> {
    const response = await query<ISystemPromptTemplate>(FIND_SYSTEMPROMPTTEMPLATE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SystemPromptTemplate');
    return response.data;
  },
  async querySystemPromptTemplatesDto(filter?: GeneralCollectionFilter): Promise<ISystemPromptTemplateListResponse> {
    return await queryList<ISystemPromptTemplate>(
      QUERY_SYSTEMPROMPTTEMPLATES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default systemPromptTemplateService;
