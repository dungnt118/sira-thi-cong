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

import { FIND_MENU_DTO, QUERY_MENUS_DTO } from '../queries/menu.queries';
import {
  IMenu,
  ICreateMenuInput,
  IMenuListResponse
} from '../types/menu.types';

export const menuService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Menu', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Menu');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IMenuListResponse> {
    return await query_content<IMenu>({ schema: 'Menu', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Menu', filter });
    return response?.data || 0;
  },

  async createMenu(input: ICreateMenuInput): Promise<IMenu> {
    const response = await save_content({
      schema: 'Menu',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Menu');
    return response.data as IMenu;
  },

  async updateMenu(id: string, input: Partial<ICreateMenuInput>): Promise<IMenu> {
    const response = await update_partial_content({
      schema: 'Menu',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Menu');
    return response.data as IMenu;
  },

  async deleteMenu(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Menu',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiMenu(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Menu',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockMenu(id: string, locked: boolean = true): Promise<IMenu> {
    const response = await lock_content({
      schema: 'Menu',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Menu');
    return response.data as IMenu;
  },

  async findMenuDto(id: string): Promise<IMenu> {
    const response = await query<IMenu>(FIND_MENU_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Menu');
    return response.data;
  },
  async queryMenusDto(filter?: GeneralCollectionFilter): Promise<IMenuListResponse> {
    return await queryList<IMenu>(
      QUERY_MENUS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default menuService;
