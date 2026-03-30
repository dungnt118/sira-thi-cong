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

import { FIND_PRINTTEMPLATE_DTO, QUERY_PRINTTEMPLATES_DTO } from '../queries/printTemplate.queries';
import {
  IPrintTemplate,
  ICreatePrintTemplateInput,
  IPrintTemplateListResponse
} from '../types/printTemplate.types';

export const printTemplateService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PrintTemplate', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PrintTemplate');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPrintTemplateListResponse> {
    return await query_content<IPrintTemplate>({ schema: 'PrintTemplate', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PrintTemplate', filter });
    return response?.data || 0;
  },

  async createPrintTemplate(input: ICreatePrintTemplateInput): Promise<IPrintTemplate> {
    const response = await save_content({
      schema: 'PrintTemplate',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PrintTemplate');
    return response.data as IPrintTemplate;
  },

  async updatePrintTemplate(id: string, input: Partial<ICreatePrintTemplateInput>): Promise<IPrintTemplate> {
    const response = await update_partial_content({
      schema: 'PrintTemplate',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PrintTemplate');
    return response.data as IPrintTemplate;
  },

  async deletePrintTemplate(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PrintTemplate',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPrintTemplate(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PrintTemplate',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPrintTemplate(id: string, locked: boolean = true): Promise<IPrintTemplate> {
    const response = await lock_content({
      schema: 'PrintTemplate',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PrintTemplate');
    return response.data as IPrintTemplate;
  },

  async findPrintTemplateDto(id: string): Promise<IPrintTemplate> {
    const response = await query<IPrintTemplate>(FIND_PRINTTEMPLATE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PrintTemplate');
    return response.data;
  },
  async queryPrintTemplatesDto(filter?: GeneralCollectionFilter): Promise<IPrintTemplateListResponse> {
    return await queryList<IPrintTemplate>(
      QUERY_PRINTTEMPLATES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default printTemplateService;
