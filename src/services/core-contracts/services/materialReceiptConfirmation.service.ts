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

import { FIND_MATERIALRECEIPTCONFIRMATION_DTO, QUERY_MATERIALRECEIPTCONFIRMATIONS_DTO } from '../queries/materialReceiptConfirmation.queries';
import {
  IMaterialReceiptConfirmation,
  ICreateMaterialReceiptConfirmationInput,
  IMaterialReceiptConfirmationListResponse
} from '../types/materialReceiptConfirmation.types';

export const materialReceiptConfirmationService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'MaterialReceiptConfirmation', _id: id });
    if (!response.data) throw new Error('Không tìm thấy MaterialReceiptConfirmation');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMaterialReceiptConfirmationListResponse> {
    return await query_content<IMaterialReceiptConfirmation>({ schema: 'MaterialReceiptConfirmation', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'MaterialReceiptConfirmation', filter });
    return response?.data || 0;
  },

  async createMaterialReceiptConfirmation(input: ICreateMaterialReceiptConfirmationInput): Promise<IMaterialReceiptConfirmation> {
    const response = await save_content({
      schema: 'MaterialReceiptConfirmation',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo MaterialReceiptConfirmation');
    return response.data as IMaterialReceiptConfirmation;
  },

  async updateMaterialReceiptConfirmation(id: string, input: Partial<ICreateMaterialReceiptConfirmationInput>): Promise<IMaterialReceiptConfirmation> {
    const response = await update_partial_content({
      schema: 'MaterialReceiptConfirmation',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật MaterialReceiptConfirmation');
    return response.data as IMaterialReceiptConfirmation;
  },

  async deleteMaterialReceiptConfirmation(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'MaterialReceiptConfirmation',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMaterialReceiptConfirmation(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'MaterialReceiptConfirmation',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMaterialReceiptConfirmation(id: string, locked: boolean = true): Promise<IMaterialReceiptConfirmation> {
    const response = await lock_content({
      schema: 'MaterialReceiptConfirmation',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa MaterialReceiptConfirmation');
    return response.data as IMaterialReceiptConfirmation;
  },

  async findMaterialReceiptConfirmationDto(id: string): Promise<IMaterialReceiptConfirmation> {
    const response = await query<IMaterialReceiptConfirmation>(FIND_MATERIALRECEIPTCONFIRMATION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy MaterialReceiptConfirmation');
    return response.data;
  },
  async queryMaterialReceiptConfirmationsDto(filter?: GeneralCollectionFilter): Promise<IMaterialReceiptConfirmationListResponse> {
    return await queryList<IMaterialReceiptConfirmation>(
      QUERY_MATERIALRECEIPTCONFIRMATIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default materialReceiptConfirmationService;
