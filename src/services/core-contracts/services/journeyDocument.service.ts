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

import { FIND_JOURNEYDOCUMENT_DTO, QUERY_JOURNEYDOCUMENTS_DTO } from '../queries/journeyDocument.queries';
import {
  IJourneyDocument,
  ICreateJourneyDocumentInput,
  IJourneyDocumentListResponse
} from '../types/journeyDocument.types';

export const journeyDocumentService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'JourneyDocument', _id: id });
    if (!response.data) throw new Error('Không tìm thấy JourneyDocument');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IJourneyDocumentListResponse> {
    return await query_content<IJourneyDocument>({ schema: 'JourneyDocument', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'JourneyDocument', filter });
    return response?.data || 0;
  },

  async createJourneyDocument(input: ICreateJourneyDocumentInput): Promise<IJourneyDocument> {
    const response = await save_content({
      schema: 'JourneyDocument',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo JourneyDocument');
    return response.data as IJourneyDocument;
  },

  async updateJourneyDocument(id: string, input: Partial<ICreateJourneyDocumentInput>): Promise<IJourneyDocument> {
    const response = await update_partial_content({
      schema: 'JourneyDocument',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật JourneyDocument');
    return response.data as IJourneyDocument;
  },

  async deleteJourneyDocument(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'JourneyDocument',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiJourneyDocument(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'JourneyDocument',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockJourneyDocument(id: string, locked: boolean = true): Promise<IJourneyDocument> {
    const response = await lock_content({
      schema: 'JourneyDocument',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa JourneyDocument');
    return response.data as IJourneyDocument;
  },

  async findJourneyDocumentDto(id: string): Promise<IJourneyDocument> {
    const response = await query<IJourneyDocument>(FIND_JOURNEYDOCUMENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy JourneyDocument');
    return response.data;
  },
  async queryJourneyDocumentsDto(filter?: GeneralCollectionFilter): Promise<IJourneyDocumentListResponse> {
    return await queryList<IJourneyDocument>(
      QUERY_JOURNEYDOCUMENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default journeyDocumentService;
