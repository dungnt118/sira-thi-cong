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

import { FIND_IMPORTTEMPLATE_DTO, QUERY_IMPORTTEMPLATES_DTO } from '../queries/importTemplate.queries';
import {
  IImportTemplate,
  ICreateImportTemplateInput,
  IImportTemplateListResponse
} from '../types/importTemplate.types';

export const importTemplateService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ImportTemplate', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ImportTemplate');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IImportTemplateListResponse> {
    return await query_content<IImportTemplate>({ schema: 'ImportTemplate', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ImportTemplate', filter });
    return response?.data || 0;
  },

  async createImportTemplate(input: ICreateImportTemplateInput): Promise<IImportTemplate> {
    const response = await save_content({
      schema: 'ImportTemplate',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ImportTemplate');
    return response.data as IImportTemplate;
  },

  async updateImportTemplate(id: string, input: Partial<ICreateImportTemplateInput>): Promise<IImportTemplate> {
    const response = await update_partial_content({
      schema: 'ImportTemplate',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ImportTemplate');
    return response.data as IImportTemplate;
  },

  async deleteImportTemplate(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ImportTemplate',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiImportTemplate(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ImportTemplate',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockImportTemplate(id: string, locked: boolean = true): Promise<IImportTemplate> {
    const response = await lock_content({
      schema: 'ImportTemplate',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ImportTemplate');
    return response.data as IImportTemplate;
  },

  async findImportTemplateDto(id: string): Promise<IImportTemplate> {
    const response = await query<IImportTemplate>(FIND_IMPORTTEMPLATE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ImportTemplate');
    return response.data;
  },
  async queryImportTemplatesDto(filter?: GeneralCollectionFilter): Promise<IImportTemplateListResponse> {
    return await queryList<IImportTemplate>(
      QUERY_IMPORTTEMPLATES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default importTemplateService;
