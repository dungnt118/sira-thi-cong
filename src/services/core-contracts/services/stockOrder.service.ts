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

import { FIND_STOCKORDER_DTO, QUERY_STOCKORDERS_DTO } from '../queries/stockOrder.queries';
import {
  IStockOrder,
  ICreateStockOrderInput,
  IStockOrderListResponse
} from '../types/stockOrder.types';

export const stockOrderService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'StockOrder', _id: id });
    if (!response.data) throw new Error('Không tìm thấy StockOrder');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IStockOrderListResponse> {
    return await query_content<IStockOrder>({ schema: 'StockOrder', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'StockOrder', filter });
    return response?.data || 0;
  },

  async createStockOrder(input: ICreateStockOrderInput): Promise<IStockOrder> {
    const response = await save_content({
      schema: 'StockOrder',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo StockOrder');
    return response.data as IStockOrder;
  },

  async updateStockOrder(id: string, input: Partial<ICreateStockOrderInput>): Promise<IStockOrder> {
    const response = await update_partial_content({
      schema: 'StockOrder',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật StockOrder');
    return response.data as IStockOrder;
  },

  async deleteStockOrder(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'StockOrder',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiStockOrder(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'StockOrder',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockStockOrder(id: string, locked: boolean = true): Promise<IStockOrder> {
    const response = await lock_content({
      schema: 'StockOrder',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa StockOrder');
    return response.data as IStockOrder;
  },

  async findStockOrderDto(id: string): Promise<IStockOrder> {
    const response = await query<IStockOrder>(FIND_STOCKORDER_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy StockOrder');
    return response.data;
  },
  async queryStockOrdersDto(filter?: GeneralCollectionFilter): Promise<IStockOrderListResponse> {
    return await queryList<IStockOrder>(
      QUERY_STOCKORDERS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default stockOrderService;
