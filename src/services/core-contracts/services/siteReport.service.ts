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

import { FIND_SITEREPORT_DTO, QUERY_SITEREPORTS_DTO } from '../queries/siteReport.queries';
import {
  ISiteReport,
  ICreateSiteReportInput,
  ISiteReportListResponse
} from '../types/siteReport.types';

export const siteReportService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'SiteReport', _id: id });
    if (!response.data) throw new Error('Không tìm thấy SiteReport');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<ISiteReportListResponse> {
    return await query_content<ISiteReport>({ schema: 'SiteReport', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'SiteReport', filter });
    return response?.data || 0;
  },

  async createSiteReport(input: ICreateSiteReportInput): Promise<ISiteReport> {
    const response = await save_content({
      schema: 'SiteReport',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo SiteReport');
    return response.data as ISiteReport;
  },

  async updateSiteReport(id: string, input: Partial<ICreateSiteReportInput>): Promise<ISiteReport> {
    const response = await update_partial_content({
      schema: 'SiteReport',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật SiteReport');
    return response.data as ISiteReport;
  },

  async deleteSiteReport(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'SiteReport',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiSiteReport(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'SiteReport',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockSiteReport(id: string, locked: boolean = true): Promise<ISiteReport> {
    const response = await lock_content({
      schema: 'SiteReport',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa SiteReport');
    return response.data as ISiteReport;
  },

  async findSiteReportDto(id: string): Promise<ISiteReport> {
    const response = await query<ISiteReport>(FIND_SITEREPORT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy SiteReport');
    return response.data;
  },
  async querySiteReportsDto(filter?: GeneralCollectionFilter): Promise<ISiteReportListResponse> {
    return await queryList<ISiteReport>(
      QUERY_SITEREPORTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default siteReportService;
