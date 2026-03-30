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

import { FIND_REPORTDASHBOARD_DTO, QUERY_REPORTDASHBOARDS_DTO } from '../queries/reportDashboard.queries';
import {
  IReportDashboard,
  ICreateReportDashboardInput,
  IReportDashboardListResponse
} from '../types/reportDashboard.types';

export const reportDashboardService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ReportDashboard', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ReportDashboard');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IReportDashboardListResponse> {
    return await query_content<IReportDashboard>({ schema: 'ReportDashboard', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ReportDashboard', filter });
    return response?.data || 0;
  },

  async createReportDashboard(input: ICreateReportDashboardInput): Promise<IReportDashboard> {
    const response = await save_content({
      schema: 'ReportDashboard',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ReportDashboard');
    return response.data as IReportDashboard;
  },

  async updateReportDashboard(id: string, input: Partial<ICreateReportDashboardInput>): Promise<IReportDashboard> {
    const response = await update_partial_content({
      schema: 'ReportDashboard',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ReportDashboard');
    return response.data as IReportDashboard;
  },

  async deleteReportDashboard(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ReportDashboard',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiReportDashboard(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ReportDashboard',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockReportDashboard(id: string, locked: boolean = true): Promise<IReportDashboard> {
    const response = await lock_content({
      schema: 'ReportDashboard',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ReportDashboard');
    return response.data as IReportDashboard;
  },

  async findReportDashboardDto(id: string): Promise<IReportDashboard> {
    const response = await query<IReportDashboard>(FIND_REPORTDASHBOARD_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ReportDashboard');
    return response.data;
  },
  async queryReportDashboardsDto(filter?: GeneralCollectionFilter): Promise<IReportDashboardListResponse> {
    return await queryList<IReportDashboard>(
      QUERY_REPORTDASHBOARDS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default reportDashboardService;
