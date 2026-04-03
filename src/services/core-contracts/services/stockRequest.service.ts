/**
 * @deprecated Nghiệp vụ yêu cầu kho đã gộp vào schema StockOrder (trạng thái + requested_by/review_*).
 * Giữ service để tương thích mã cũ và seed; bản ghi mới nên dùng stockOrderService.
 */
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

import { FIND_STOCKREQUEST_DTO, QUERY_STOCKREQUESTS_DTO } from '../queries/stockRequest.queries';
import {
  IStockRequest,
  ICreateStockRequestInput,
  IStockRequestListResponse
} from '../types/stockRequest.types';

export const stockRequestService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'StockRequest', _id: id });
    if (!response.data) throw new Error('Không tìm thấy StockRequest');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IStockRequestListResponse> {
    return await query_content<IStockRequest>({ schema: 'StockRequest', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'StockRequest', filter });
    return response?.data || 0;
  },

  async createStockRequest(input: ICreateStockRequestInput): Promise<IStockRequest> {
    const response = await save_content({
      schema: 'StockRequest',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo StockRequest');
    return response.data as IStockRequest;
  },

  async updateStockRequest(id: string, input: Partial<ICreateStockRequestInput>): Promise<IStockRequest> {
    const response = await update_partial_content({
      schema: 'StockRequest',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật StockRequest');
    return response.data as IStockRequest;
  },

  async deleteStockRequest(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'StockRequest',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiStockRequest(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'StockRequest',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockStockRequest(id: string, locked: boolean = true): Promise<IStockRequest> {
    const response = await lock_content({
      schema: 'StockRequest',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa StockRequest');
    return response.data as IStockRequest;
  },

  async findStockRequestDto(id: string): Promise<IStockRequest> {
    const response = await query<IStockRequest>(FIND_STOCKREQUEST_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy StockRequest');
    return response.data;
  },
  async queryStockRequestsDto(filter?: GeneralCollectionFilter): Promise<IStockRequestListResponse> {
    return await queryList<IStockRequest>(
      QUERY_STOCKREQUESTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default stockRequestService;
