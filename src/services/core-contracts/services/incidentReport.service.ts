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

import { FIND_INCIDENTREPORT_DTO, QUERY_INCIDENTREPORTS_DTO } from '../queries/incidentReport.queries';
import {
  IIncidentReport,
  ICreateIncidentReportInput,
  IIncidentReportListResponse
} from '../types/incidentReport.types';

export const incidentReportService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'IncidentReport', _id: id });
    if (!response.data) throw new Error('Không tìm thấy IncidentReport');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IIncidentReportListResponse> {
    return await query_content<IIncidentReport>({ schema: 'IncidentReport', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'IncidentReport', filter });
    return response?.data || 0;
  },

  async createIncidentReport(input: ICreateIncidentReportInput): Promise<IIncidentReport> {
    const response = await save_content({
      schema: 'IncidentReport',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo IncidentReport');
    return response.data as IIncidentReport;
  },

  async updateIncidentReport(id: string, input: Partial<ICreateIncidentReportInput>): Promise<IIncidentReport> {
    const response = await update_partial_content({
      schema: 'IncidentReport',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật IncidentReport');
    return response.data as IIncidentReport;
  },

  async deleteIncidentReport(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'IncidentReport',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiIncidentReport(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'IncidentReport',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockIncidentReport(id: string, locked: boolean = true): Promise<IIncidentReport> {
    const response = await lock_content({
      schema: 'IncidentReport',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa IncidentReport');
    return response.data as IIncidentReport;
  },

  async findIncidentReportDto(id: string): Promise<IIncidentReport> {
    const response = await query<IIncidentReport>(FIND_INCIDENTREPORT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy IncidentReport');
    return response.data;
  },
  async queryIncidentReportsDto(filter?: GeneralCollectionFilter): Promise<IIncidentReportListResponse> {
    return await queryList<IIncidentReport>(
      QUERY_INCIDENTREPORTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default incidentReportService;
