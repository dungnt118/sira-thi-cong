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

import { FIND_CHECKLISTTEMPLATE_DTO, QUERY_CHECKLISTTEMPLATES_DTO } from '../queries/checklistTemplate.queries';
import {
  IChecklistTemplate,
  ICreateChecklistTemplateInput,
  IChecklistTemplateListResponse
} from '../types/checklistTemplate.types';

export const checklistTemplateService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ChecklistTemplate', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ChecklistTemplate');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IChecklistTemplateListResponse> {
    return await query_content<IChecklistTemplate>({ schema: 'ChecklistTemplate', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ChecklistTemplate', filter });
    return response?.data || 0;
  },

  async createChecklistTemplate(input: ICreateChecklistTemplateInput): Promise<IChecklistTemplate> {
    const response = await save_content({
      schema: 'ChecklistTemplate',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ChecklistTemplate');
    return response.data as IChecklistTemplate;
  },

  async updateChecklistTemplate(id: string, input: Partial<ICreateChecklistTemplateInput>): Promise<IChecklistTemplate> {
    const response = await update_partial_content({
      schema: 'ChecklistTemplate',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ChecklistTemplate');
    return response.data as IChecklistTemplate;
  },

  async deleteChecklistTemplate(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ChecklistTemplate',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiChecklistTemplate(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ChecklistTemplate',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockChecklistTemplate(id: string, locked: boolean = true): Promise<IChecklistTemplate> {
    const response = await lock_content({
      schema: 'ChecklistTemplate',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ChecklistTemplate');
    return response.data as IChecklistTemplate;
  },

  async findChecklistTemplateDto(id: string): Promise<IChecklistTemplate> {
    const response = await query<IChecklistTemplate>(FIND_CHECKLISTTEMPLATE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ChecklistTemplate');
    return response.data;
  },
  async queryChecklistTemplatesDto(filter?: GeneralCollectionFilter): Promise<IChecklistTemplateListResponse> {
    return await queryList<IChecklistTemplate>(
      QUERY_CHECKLISTTEMPLATES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default checklistTemplateService;
