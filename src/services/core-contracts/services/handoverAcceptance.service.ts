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

import { FIND_HANDOVERACCEPTANCE_DTO, QUERY_HANDOVERACCEPTANCES_DTO } from '../queries/handoverAcceptance.queries';
import {
  IHandoverAcceptance,
  ICreateHandoverAcceptanceInput,
  IHandoverAcceptanceListResponse
} from '../types/handoverAcceptance.types';

export const handoverAcceptanceService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'HandoverAcceptance', _id: id });
    if (!response.data) throw new Error('Không tìm thấy HandoverAcceptance');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IHandoverAcceptanceListResponse> {
    return await query_content<IHandoverAcceptance>({ schema: 'HandoverAcceptance', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'HandoverAcceptance', filter });
    return response?.data || 0;
  },

  async createHandoverAcceptance(input: ICreateHandoverAcceptanceInput): Promise<IHandoverAcceptance> {
    const response = await save_content({
      schema: 'HandoverAcceptance',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo HandoverAcceptance');
    return response.data as IHandoverAcceptance;
  },

  async updateHandoverAcceptance(id: string, input: Partial<ICreateHandoverAcceptanceInput>): Promise<IHandoverAcceptance> {
    const response = await update_partial_content({
      schema: 'HandoverAcceptance',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật HandoverAcceptance');
    return response.data as IHandoverAcceptance;
  },

  async deleteHandoverAcceptance(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'HandoverAcceptance',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiHandoverAcceptance(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'HandoverAcceptance',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockHandoverAcceptance(id: string, locked: boolean = true): Promise<IHandoverAcceptance> {
    const response = await lock_content({
      schema: 'HandoverAcceptance',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa HandoverAcceptance');
    return response.data as IHandoverAcceptance;
  },

  async findHandoverAcceptanceDto(id: string): Promise<IHandoverAcceptance> {
    const response = await query<IHandoverAcceptance>(FIND_HANDOVERACCEPTANCE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy HandoverAcceptance');
    return response.data;
  },
  async queryHandoverAcceptancesDto(filter?: GeneralCollectionFilter): Promise<IHandoverAcceptanceListResponse> {
    return await queryList<IHandoverAcceptance>(
      QUERY_HANDOVERACCEPTANCES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default handoverAcceptanceService;
