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

import { FIND_PORTALDOCUMENT_DTO, QUERY_PORTALDOCUMENTS_DTO } from '../queries/portalDocument.queries';
import {
  IPortalDocument,
  ICreatePortalDocumentInput,
  IPortalDocumentListResponse
} from '../types/portalDocument.types';

export const portalDocumentService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PortalDocument', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PortalDocument');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPortalDocumentListResponse> {
    return await query_content<IPortalDocument>({ schema: 'PortalDocument', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PortalDocument', filter });
    return response?.data || 0;
  },

  async createPortalDocument(input: ICreatePortalDocumentInput): Promise<IPortalDocument> {
    const response = await save_content({
      schema: 'PortalDocument',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PortalDocument');
    return response.data as IPortalDocument;
  },

  async updatePortalDocument(id: string, input: Partial<ICreatePortalDocumentInput>): Promise<IPortalDocument> {
    const response = await update_partial_content({
      schema: 'PortalDocument',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PortalDocument');
    return response.data as IPortalDocument;
  },

  async deletePortalDocument(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PortalDocument',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPortalDocument(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PortalDocument',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPortalDocument(id: string, locked: boolean = true): Promise<IPortalDocument> {
    const response = await lock_content({
      schema: 'PortalDocument',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PortalDocument');
    return response.data as IPortalDocument;
  },

  async findPortalDocumentDto(id: string): Promise<IPortalDocument> {
    const response = await query<IPortalDocument>(FIND_PORTALDOCUMENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PortalDocument');
    return response.data;
  },
  async queryPortalDocumentsDto(filter?: GeneralCollectionFilter): Promise<IPortalDocumentListResponse> {
    return await queryList<IPortalDocument>(
      QUERY_PORTALDOCUMENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default portalDocumentService;
