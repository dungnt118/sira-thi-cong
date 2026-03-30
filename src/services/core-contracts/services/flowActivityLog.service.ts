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

import { FIND_FLOWACTIVITYLOG_DTO, QUERY_FLOWACTIVITYLOGS_DTO } from '../queries/flowActivityLog.queries';
import {
  IFlowActivityLog,
  ICreateFlowActivityLogInput,
  IFlowActivityLogListResponse
} from '../types/flowActivityLog.types';

export const flowActivityLogService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'FlowActivityLog', _id: id });
    if (!response.data) throw new Error('Không tìm thấy FlowActivityLog');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IFlowActivityLogListResponse> {
    return await query_content<IFlowActivityLog>({ schema: 'FlowActivityLog', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'FlowActivityLog', filter });
    return response?.data || 0;
  },

  async createFlowActivityLog(input: ICreateFlowActivityLogInput): Promise<IFlowActivityLog> {
    const response = await save_content({
      schema: 'FlowActivityLog',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo FlowActivityLog');
    return response.data as IFlowActivityLog;
  },

  async updateFlowActivityLog(id: string, input: Partial<ICreateFlowActivityLogInput>): Promise<IFlowActivityLog> {
    const response = await update_partial_content({
      schema: 'FlowActivityLog',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật FlowActivityLog');
    return response.data as IFlowActivityLog;
  },

  async deleteFlowActivityLog(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'FlowActivityLog',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiFlowActivityLog(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'FlowActivityLog',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockFlowActivityLog(id: string, locked: boolean = true): Promise<IFlowActivityLog> {
    const response = await lock_content({
      schema: 'FlowActivityLog',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa FlowActivityLog');
    return response.data as IFlowActivityLog;
  },

  async findFlowActivityLogDto(id: string): Promise<IFlowActivityLog> {
    const response = await query<IFlowActivityLog>(FIND_FLOWACTIVITYLOG_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy FlowActivityLog');
    return response.data;
  },
  async queryFlowActivityLogsDto(filter?: GeneralCollectionFilter): Promise<IFlowActivityLogListResponse> {
    return await queryList<IFlowActivityLog>(
      QUERY_FLOWACTIVITYLOGS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default flowActivityLogService;
