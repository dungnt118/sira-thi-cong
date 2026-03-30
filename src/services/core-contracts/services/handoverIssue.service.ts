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

import { FIND_HANDOVERISSUE_DTO, QUERY_HANDOVERISSUES_DTO } from '../queries/handoverIssue.queries';
import {
  IHandoverIssue,
  ICreateHandoverIssueInput,
  IHandoverIssueListResponse
} from '../types/handoverIssue.types';

export const handoverIssueService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'HandoverIssue', _id: id });
    if (!response.data) throw new Error('Không tìm thấy HandoverIssue');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IHandoverIssueListResponse> {
    return await query_content<IHandoverIssue>({ schema: 'HandoverIssue', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'HandoverIssue', filter });
    return response?.data || 0;
  },

  async createHandoverIssue(input: ICreateHandoverIssueInput): Promise<IHandoverIssue> {
    const response = await save_content({
      schema: 'HandoverIssue',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo HandoverIssue');
    return response.data as IHandoverIssue;
  },

  async updateHandoverIssue(id: string, input: Partial<ICreateHandoverIssueInput>): Promise<IHandoverIssue> {
    const response = await update_partial_content({
      schema: 'HandoverIssue',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật HandoverIssue');
    return response.data as IHandoverIssue;
  },

  async deleteHandoverIssue(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'HandoverIssue',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiHandoverIssue(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'HandoverIssue',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockHandoverIssue(id: string, locked: boolean = true): Promise<IHandoverIssue> {
    const response = await lock_content({
      schema: 'HandoverIssue',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa HandoverIssue');
    return response.data as IHandoverIssue;
  },

  async findHandoverIssueDto(id: string): Promise<IHandoverIssue> {
    const response = await query<IHandoverIssue>(FIND_HANDOVERISSUE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy HandoverIssue');
    return response.data;
  },
  async queryHandoverIssuesDto(filter?: GeneralCollectionFilter): Promise<IHandoverIssueListResponse> {
    return await queryList<IHandoverIssue>(
      QUERY_HANDOVERISSUES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default handoverIssueService;
