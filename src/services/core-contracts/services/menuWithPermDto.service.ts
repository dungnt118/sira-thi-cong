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

import { FIND_MENUWITHPERMDTO_DTO, QUERY_MENUWITHPERMDTOS_DTO } from '../queries/menuWithPermDto.queries';
import {
  IMenuWithPermDto,
  ICreateMenuWithPermDtoInput,
  IMenuWithPermDtoListResponse
} from '../types/menuWithPermDto.types';

export const menuWithPermDtoService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'MenuWithPermDto', _id: id });
    if (!response.data) throw new Error('Không tìm thấy MenuWithPermDto');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMenuWithPermDtoListResponse> {
    return await query_content<IMenuWithPermDto>({ schema: 'MenuWithPermDto', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'MenuWithPermDto', filter });
    return response?.data || 0;
  },

  async createMenuWithPermDto(input: ICreateMenuWithPermDtoInput): Promise<IMenuWithPermDto> {
    const response = await save_content({
      schema: 'MenuWithPermDto',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo MenuWithPermDto');
    return response.data as IMenuWithPermDto;
  },

  async updateMenuWithPermDto(id: string, input: Partial<ICreateMenuWithPermDtoInput>): Promise<IMenuWithPermDto> {
    const response = await update_partial_content({
      schema: 'MenuWithPermDto',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật MenuWithPermDto');
    return response.data as IMenuWithPermDto;
  },

  async deleteMenuWithPermDto(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'MenuWithPermDto',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMenuWithPermDto(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'MenuWithPermDto',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMenuWithPermDto(id: string, locked: boolean = true): Promise<IMenuWithPermDto> {
    const response = await lock_content({
      schema: 'MenuWithPermDto',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa MenuWithPermDto');
    return response.data as IMenuWithPermDto;
  },

  async findMenuWithPermDtoDto(id: string): Promise<IMenuWithPermDto> {
    const response = await query<IMenuWithPermDto>(FIND_MENUWITHPERMDTO_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy MenuWithPermDto');
    return response.data;
  },
  async queryMenuWithPermDtosDto(filter?: GeneralCollectionFilter): Promise<IMenuWithPermDtoListResponse> {
    return await queryList<IMenuWithPermDto>(
      QUERY_MENUWITHPERMDTOS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default menuWithPermDtoService;
