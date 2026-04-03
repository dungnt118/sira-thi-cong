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

import { FIND_ASSETMAINTENANCETICKET_DTO, QUERY_ASSETMAINTENANCETICKETS_DTO } from '../queries/assetMaintenanceTicket.queries';
import {
  IAssetMaintenanceTicket,
  ICreateAssetMaintenanceTicketInput,
  IAssetMaintenanceTicketListResponse
} from '../types/assetMaintenanceTicket.types';

export const assetMaintenanceTicketService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'AssetMaintenanceTicket', _id: id });
    if (!response.data) throw new Error('Không tìm thấy AssetMaintenanceTicket');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IAssetMaintenanceTicketListResponse> {
    return await query_content<IAssetMaintenanceTicket>({ schema: 'AssetMaintenanceTicket', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'AssetMaintenanceTicket', filter });
    return response?.data || 0;
  },

  async createAssetMaintenanceTicket(input: ICreateAssetMaintenanceTicketInput): Promise<IAssetMaintenanceTicket> {
    const response = await save_content({
      schema: 'AssetMaintenanceTicket',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo AssetMaintenanceTicket');
    return response.data as IAssetMaintenanceTicket;
  },

  async updateAssetMaintenanceTicket(id: string, input: Partial<ICreateAssetMaintenanceTicketInput>): Promise<IAssetMaintenanceTicket> {
    const response = await update_partial_content({
      schema: 'AssetMaintenanceTicket',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật AssetMaintenanceTicket');
    return response.data as IAssetMaintenanceTicket;
  },

  async deleteAssetMaintenanceTicket(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'AssetMaintenanceTicket',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiAssetMaintenanceTicket(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'AssetMaintenanceTicket',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockAssetMaintenanceTicket(id: string, locked: boolean = true): Promise<IAssetMaintenanceTicket> {
    const response = await lock_content({
      schema: 'AssetMaintenanceTicket',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa AssetMaintenanceTicket');
    return response.data as IAssetMaintenanceTicket;
  },

  async findAssetMaintenanceTicketDto(id: string): Promise<IAssetMaintenanceTicket> {
    const response = await query<IAssetMaintenanceTicket>(FIND_ASSETMAINTENANCETICKET_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy AssetMaintenanceTicket');
    return response.data;
  },
  async queryAssetMaintenanceTicketsDto(filter?: GeneralCollectionFilter): Promise<IAssetMaintenanceTicketListResponse> {
    return await queryList<IAssetMaintenanceTicket>(
      QUERY_ASSETMAINTENANCETICKETS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default assetMaintenanceTicketService;
