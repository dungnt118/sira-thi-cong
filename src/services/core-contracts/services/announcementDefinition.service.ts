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

import { FIND_ANNOUNCEMENTDEFINITION_DTO, QUERY_ANNOUNCEMENTDEFINITIONS_DTO } from '../queries/announcementDefinition.queries';
import {
  IAnnouncementDefinition,
  ICreateAnnouncementDefinitionInput,
  IAnnouncementDefinitionListResponse
} from '../types/announcementDefinition.types';

export const announcementDefinitionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AnnouncementDefinition', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AnnouncementDefinition');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAnnouncementDefinitionListResponse> {
    return await query_content<IAnnouncementDefinition>({ schema: 'AnnouncementDefinition', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AnnouncementDefinition', filter });
    return response?.data || 0;
  },

  async createAnnouncementDefinition(input: ICreateAnnouncementDefinitionInput): Promise<IAnnouncementDefinition> {
    const response = await save_content({
      schema: 'AnnouncementDefinition',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AnnouncementDefinition');
    return response.data as IAnnouncementDefinition;
  },

  async updateAnnouncementDefinition(id: string, input: Partial<ICreateAnnouncementDefinitionInput>): Promise<IAnnouncementDefinition> {
    const response = await update_partial_content({
      schema: 'AnnouncementDefinition',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AnnouncementDefinition');
    return response.data as IAnnouncementDefinition;
  },

  async deleteAnnouncementDefinition(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AnnouncementDefinition',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAnnouncementDefinition(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AnnouncementDefinition',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAnnouncementDefinition(id: string, locked: boolean = true): Promise<IAnnouncementDefinition> {
    const response = await lock_content({
      schema: 'AnnouncementDefinition',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AnnouncementDefinition');
    return response.data as IAnnouncementDefinition;
  },

  async findAnnouncementDefinitionDto(id: string): Promise<IAnnouncementDefinition> {
    const response = await query<IAnnouncementDefinition>(FIND_ANNOUNCEMENTDEFINITION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AnnouncementDefinition');
    return response.data;
  },
  async queryAnnouncementDefinitionsDto(filter?: GeneralCollectionFilter): Promise<IAnnouncementDefinitionListResponse> {
    return await queryList<IAnnouncementDefinition>(
      QUERY_ANNOUNCEMENTDEFINITIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default announcementDefinitionService;
