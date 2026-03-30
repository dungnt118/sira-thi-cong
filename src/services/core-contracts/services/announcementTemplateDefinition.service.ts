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

import { FIND_ANNOUNCEMENTTEMPLATEDEFINITION_DTO, QUERY_ANNOUNCEMENTTEMPLATEDEFINITIONS_DTO } from '../queries/announcementTemplateDefinition.queries';
import {
  IAnnouncementTemplateDefinition,
  ICreateAnnouncementTemplateDefinitionInput,
  IAnnouncementTemplateDefinitionListResponse
} from '../types/announcementTemplateDefinition.types';

export const announcementTemplateDefinitionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AnnouncementTemplateDefinition', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AnnouncementTemplateDefinition');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAnnouncementTemplateDefinitionListResponse> {
    return await query_content<IAnnouncementTemplateDefinition>({ schema: 'AnnouncementTemplateDefinition', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AnnouncementTemplateDefinition', filter });
    return response?.data || 0;
  },

  async createAnnouncementTemplateDefinition(input: ICreateAnnouncementTemplateDefinitionInput): Promise<IAnnouncementTemplateDefinition> {
    const response = await save_content({
      schema: 'AnnouncementTemplateDefinition',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AnnouncementTemplateDefinition');
    return response.data as IAnnouncementTemplateDefinition;
  },

  async updateAnnouncementTemplateDefinition(id: string, input: Partial<ICreateAnnouncementTemplateDefinitionInput>): Promise<IAnnouncementTemplateDefinition> {
    const response = await update_partial_content({
      schema: 'AnnouncementTemplateDefinition',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AnnouncementTemplateDefinition');
    return response.data as IAnnouncementTemplateDefinition;
  },

  async deleteAnnouncementTemplateDefinition(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AnnouncementTemplateDefinition',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAnnouncementTemplateDefinition(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AnnouncementTemplateDefinition',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAnnouncementTemplateDefinition(id: string, locked: boolean = true): Promise<IAnnouncementTemplateDefinition> {
    const response = await lock_content({
      schema: 'AnnouncementTemplateDefinition',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AnnouncementTemplateDefinition');
    return response.data as IAnnouncementTemplateDefinition;
  },

  async findAnnouncementTemplateDefinitionDto(id: string): Promise<IAnnouncementTemplateDefinition> {
    const response = await query<IAnnouncementTemplateDefinition>(FIND_ANNOUNCEMENTTEMPLATEDEFINITION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AnnouncementTemplateDefinition');
    return response.data;
  },
  async queryAnnouncementTemplateDefinitionsDto(filter?: GeneralCollectionFilter): Promise<IAnnouncementTemplateDefinitionListResponse> {
    return await queryList<IAnnouncementTemplateDefinition>(
      QUERY_ANNOUNCEMENTTEMPLATEDEFINITIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default announcementTemplateDefinitionService;
