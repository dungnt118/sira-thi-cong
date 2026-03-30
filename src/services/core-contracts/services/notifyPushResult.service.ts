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

import { FIND_NOTIFYPUSHRESULT_DTO, QUERY_NOTIFYPUSHRESULTS_DTO } from '../queries/notifyPushResult.queries';
import {
  INotifyPushResult,
  ICreateNotifyPushResultInput,
  INotifyPushResultListResponse
} from '../types/notifyPushResult.types';

export const notifyPushResultService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'NotifyPushResult', _id: id });
    if (!response.data) throw new Error('Không tìm thấy NotifyPushResult');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<INotifyPushResultListResponse> {
    return await query_content<INotifyPushResult>({ schema: 'NotifyPushResult', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'NotifyPushResult', filter });
    return response?.data || 0;
  },

  async createNotifyPushResult(input: ICreateNotifyPushResultInput): Promise<INotifyPushResult> {
    const response = await save_content({
      schema: 'NotifyPushResult',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo NotifyPushResult');
    return response.data as INotifyPushResult;
  },

  async updateNotifyPushResult(id: string, input: Partial<ICreateNotifyPushResultInput>): Promise<INotifyPushResult> {
    const response = await update_partial_content({
      schema: 'NotifyPushResult',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật NotifyPushResult');
    return response.data as INotifyPushResult;
  },

  async deleteNotifyPushResult(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'NotifyPushResult',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiNotifyPushResult(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'NotifyPushResult',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockNotifyPushResult(id: string, locked: boolean = true): Promise<INotifyPushResult> {
    const response = await lock_content({
      schema: 'NotifyPushResult',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa NotifyPushResult');
    return response.data as INotifyPushResult;
  },

  async findNotifyPushResultDto(id: string): Promise<INotifyPushResult> {
    const response = await query<INotifyPushResult>(FIND_NOTIFYPUSHRESULT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy NotifyPushResult');
    return response.data;
  },
  async queryNotifyPushResultsDto(filter?: GeneralCollectionFilter): Promise<INotifyPushResultListResponse> {
    return await queryList<INotifyPushResult>(
      QUERY_NOTIFYPUSHRESULTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default notifyPushResultService;
