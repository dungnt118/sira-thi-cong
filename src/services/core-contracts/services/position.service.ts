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

import { FIND_POSITION_DTO, QUERY_POSITIONS_DTO } from '../queries/position.queries';
import {
  IPosition,
  ICreatePositionInput,
  IPositionListResponse
} from '../types/position.types';

export const positionService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Position', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Position');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPositionListResponse> {
    return await query_content<IPosition>({ schema: 'Position', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Position', filter });
    return response?.data || 0;
  },

  async createPosition(input: ICreatePositionInput): Promise<IPosition> {
    const response = await save_content({
      schema: 'Position',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Position');
    return response.data as IPosition;
  },

  async updatePosition(id: string, input: Partial<ICreatePositionInput>): Promise<IPosition> {
    const response = await update_partial_content({
      schema: 'Position',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Position');
    return response.data as IPosition;
  },

  async deletePosition(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Position',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPosition(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Position',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPosition(id: string, locked: boolean = true): Promise<IPosition> {
    const response = await lock_content({
      schema: 'Position',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Position');
    return response.data as IPosition;
  },

  async findPositionDto(id: string): Promise<IPosition> {
    const response = await query<IPosition>(FIND_POSITION_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Position');
    return response.data;
  },
  async queryPositionsDto(filter?: GeneralCollectionFilter): Promise<IPositionListResponse> {
    return await queryList<IPosition>(
      QUERY_POSITIONS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default positionService;
