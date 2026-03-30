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

import { FIND_SCHEMA_DTO, QUERY_SCHEMAS_DTO } from '../queries/schema.queries';
import {
  ISchema,
  ICreateSchemaInput,
  ISchemaListResponse
} from '../types/schema.types';

export const schemaService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Schema', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Schema');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISchemaListResponse> {
    return await query_content<ISchema>({ schema: 'Schema', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Schema', filter });
    return response?.data || 0;
  },

  async createSchema(input: ICreateSchemaInput): Promise<ISchema> {
    const response = await save_content({
      schema: 'Schema',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Schema');
    return response.data as ISchema;
  },

  async updateSchema(id: string, input: Partial<ICreateSchemaInput>): Promise<ISchema> {
    const response = await update_partial_content({
      schema: 'Schema',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Schema');
    return response.data as ISchema;
  },

  async deleteSchema(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Schema',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSchema(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Schema',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSchema(id: string, locked: boolean = true): Promise<ISchema> {
    const response = await lock_content({
      schema: 'Schema',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Schema');
    return response.data as ISchema;
  },

  async findSchemaDto(id: string): Promise<ISchema> {
    const response = await query<ISchema>(FIND_SCHEMA_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Schema');
    return response.data;
  },
  async querySchemasDto(filter?: GeneralCollectionFilter): Promise<ISchemaListResponse> {
    return await queryList<ISchema>(
      QUERY_SCHEMAS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default schemaService;
