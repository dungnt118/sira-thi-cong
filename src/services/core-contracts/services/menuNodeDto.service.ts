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

import { FIND_MENUNODEDTO_DTO, QUERY_MENUNODEDTOS_DTO } from '../queries/menuNodeDto.queries';
import {
  IMenuNodeDto,
  ICreateMenuNodeDtoInput,
  IMenuNodeDtoListResponse
} from '../types/menuNodeDto.types';

export const menuNodeDtoService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'MenuNodeDto', _id: id });
    if (!response.data) throw new Error('Không tìm thấy MenuNodeDto');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMenuNodeDtoListResponse> {
    return await query_content<IMenuNodeDto>({ schema: 'MenuNodeDto', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'MenuNodeDto', filter });
    return response?.data || 0;
  },

  async createMenuNodeDto(input: ICreateMenuNodeDtoInput): Promise<IMenuNodeDto> {
    const response = await save_content({
      schema: 'MenuNodeDto',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo MenuNodeDto');
    return response.data as IMenuNodeDto;
  },

  async updateMenuNodeDto(id: string, input: Partial<ICreateMenuNodeDtoInput>): Promise<IMenuNodeDto> {
    const response = await update_partial_content({
      schema: 'MenuNodeDto',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật MenuNodeDto');
    return response.data as IMenuNodeDto;
  },

  async deleteMenuNodeDto(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'MenuNodeDto',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMenuNodeDto(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'MenuNodeDto',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMenuNodeDto(id: string, locked: boolean = true): Promise<IMenuNodeDto> {
    const response = await lock_content({
      schema: 'MenuNodeDto',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa MenuNodeDto');
    return response.data as IMenuNodeDto;
  },

  async findMenuNodeDtoDto(id: string): Promise<IMenuNodeDto> {
    const response = await query<IMenuNodeDto>(FIND_MENUNODEDTO_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy MenuNodeDto');
    return response.data;
  },
  async queryMenuNodeDtosDto(filter?: GeneralCollectionFilter): Promise<IMenuNodeDtoListResponse> {
    return await queryList<IMenuNodeDto>(
      QUERY_MENUNODEDTOS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default menuNodeDtoService;
