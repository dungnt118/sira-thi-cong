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

import { FIND_DEBTCONFIRMATION_DTO, QUERY_DEBTCONFIRMATIONS_DTO } from '../queries/debtConfirmation.queries';
import {
  IDebtConfirmation,
  ICreateDebtConfirmationInput,
  IDebtConfirmationListResponse
} from '../types/debtConfirmation.types';

export const debtConfirmationService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'DebtConfirmation', _id: id });
    if (!response.data) throw new Error('Không tìm thấy DebtConfirmation');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IDebtConfirmationListResponse> {
    return await query_content<IDebtConfirmation>({ schema: 'DebtConfirmation', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'DebtConfirmation', filter });
    return response?.data || 0;
  },

  async createDebtConfirmation(input: ICreateDebtConfirmationInput): Promise<IDebtConfirmation> {
    const response = await save_content({
      schema: 'DebtConfirmation',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo DebtConfirmation');
    return response.data as IDebtConfirmation;
  },

  async updateDebtConfirmation(id: string, input: Partial<ICreateDebtConfirmationInput>): Promise<IDebtConfirmation> {
    const response = await update_partial_content({
      schema: 'DebtConfirmation',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật DebtConfirmation');
    return response.data as IDebtConfirmation;
  },

  async deleteDebtConfirmation(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'DebtConfirmation',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiDebtConfirmation(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'DebtConfirmation',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockDebtConfirmation(id: string, locked: boolean = true): Promise<IDebtConfirmation> {
    const response = await lock_content({
      schema: 'DebtConfirmation',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa DebtConfirmation');
    return response.data as IDebtConfirmation;
  },

  async findDebtConfirmationDto(id: string): Promise<IDebtConfirmation> {
    const response = await query<IDebtConfirmation>(FIND_DEBTCONFIRMATION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy DebtConfirmation');
    return response.data;
  },
  async queryDebtConfirmationsDto(filter?: GeneralCollectionFilter): Promise<IDebtConfirmationListResponse> {
    return await queryList<IDebtConfirmation>(
      QUERY_DEBTCONFIRMATIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default debtConfirmationService;
