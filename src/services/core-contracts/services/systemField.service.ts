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

import { FIND_SYSTEMFIELD_DTO, QUERY_SYSTEMFIELDS_DTO } from '../queries/systemField.queries';
import {
  ISystemField,
  ICreateSystemFieldInput,
  ISystemFieldListResponse
} from '../types/systemField.types';

export const systemFieldService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SystemField', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SystemField');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISystemFieldListResponse> {
    return await query_content<ISystemField>({ schema: 'SystemField', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SystemField', filter });
    return response?.data || 0;
  },

  async createSystemField(input: ICreateSystemFieldInput): Promise<ISystemField> {
    const response = await save_content({
      schema: 'SystemField',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SystemField');
    return response.data as ISystemField;
  },

  async updateSystemField(id: string, input: Partial<ICreateSystemFieldInput>): Promise<ISystemField> {
    const response = await update_partial_content({
      schema: 'SystemField',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SystemField');
    return response.data as ISystemField;
  },

  async deleteSystemField(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SystemField',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSystemField(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SystemField',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSystemField(id: string, locked: boolean = true): Promise<ISystemField> {
    const response = await lock_content({
      schema: 'SystemField',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SystemField');
    return response.data as ISystemField;
  },

  async findSystemFieldDto(id: string): Promise<ISystemField> {
    const response = await query<ISystemField>(FIND_SYSTEMFIELD_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SystemField');
    return response.data;
  },
  async querySystemFieldsDto(filter?: GeneralCollectionFilter): Promise<ISystemFieldListResponse> {
    return await queryList<ISystemField>(
      QUERY_SYSTEMFIELDS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default systemFieldService;
