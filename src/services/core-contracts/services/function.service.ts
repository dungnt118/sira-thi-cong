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

import { FIND_FUNCTION_DTO, QUERY_FUNCTIONS_DTO } from '../queries/function.queries';
import {
  IFunction,
  ICreateFunctionInput,
  IFunctionListResponse
} from '../types/function.types';

export const functionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Function', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Function');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IFunctionListResponse> {
    return await query_content<IFunction>({ schema: 'Function', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Function', filter });
    return response?.data || 0;
  },

  async createFunction(input: ICreateFunctionInput): Promise<IFunction> {
    const response = await save_content({
      schema: 'Function',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Function');
    return response.data as IFunction;
  },

  async updateFunction(id: string, input: Partial<ICreateFunctionInput>): Promise<IFunction> {
    const response = await update_partial_content({
      schema: 'Function',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Function');
    return response.data as IFunction;
  },

  async deleteFunction(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Function',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiFunction(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Function',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockFunction(id: string, locked: boolean = true): Promise<IFunction> {
    const response = await lock_content({
      schema: 'Function',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Function');
    return response.data as IFunction;
  },

  async findFunctionDto(id: string): Promise<IFunction> {
    const response = await query<IFunction>(FIND_FUNCTION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Function');
    return response.data;
  },
  async queryFunctionsDto(filter?: GeneralCollectionFilter): Promise<IFunctionListResponse> {
    return await queryList<IFunction>(
      QUERY_FUNCTIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default functionService;
