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

import { FIND_REPORTPANEL_DTO, QUERY_REPORTPANELS_DTO } from '../queries/reportPanel.queries';
import {
  IReportPanel,
  ICreateReportPanelInput,
  IReportPanelListResponse
} from '../types/reportPanel.types';

export const reportPanelService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ReportPanel', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ReportPanel');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IReportPanelListResponse> {
    return await query_content<IReportPanel>({ schema: 'ReportPanel', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ReportPanel', filter });
    return response?.data || 0;
  },

  async createReportPanel(input: ICreateReportPanelInput): Promise<IReportPanel> {
    const response = await save_content({
      schema: 'ReportPanel',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ReportPanel');
    return response.data as IReportPanel;
  },

  async updateReportPanel(id: string, input: Partial<ICreateReportPanelInput>): Promise<IReportPanel> {
    const response = await update_partial_content({
      schema: 'ReportPanel',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ReportPanel');
    return response.data as IReportPanel;
  },

  async deleteReportPanel(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ReportPanel',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiReportPanel(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ReportPanel',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockReportPanel(id: string, locked: boolean = true): Promise<IReportPanel> {
    const response = await lock_content({
      schema: 'ReportPanel',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ReportPanel');
    return response.data as IReportPanel;
  },

  async findReportPanelDto(id: string): Promise<IReportPanel> {
    const response = await query<IReportPanel>(FIND_REPORTPANEL_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ReportPanel');
    return response.data;
  },
  async queryReportPanelsDto(filter?: GeneralCollectionFilter): Promise<IReportPanelListResponse> {
    return await queryList<IReportPanel>(
      QUERY_REPORTPANELS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default reportPanelService;
