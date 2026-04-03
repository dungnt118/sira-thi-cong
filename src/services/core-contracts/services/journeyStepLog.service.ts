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

import { FIND_JOURNEYSTEPLOG_DTO, QUERY_JOURNEYSTEPLOGS_DTO } from '../queries/journeyStepLog.queries';
import {
  IJourneyStepLog,
  ICreateJourneyStepLogInput,
  IJourneyStepLogListResponse
} from '../types/journeyStepLog.types';

export const journeyStepLogService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'JourneyStepLog', _id: id });
    if (!response.data) throw new Error('Không tìm thấy JourneyStepLog');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IJourneyStepLogListResponse> {
    return await query_content<IJourneyStepLog>({ schema: 'JourneyStepLog', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'JourneyStepLog', filter });
    return response?.data || 0;
  },

  async createJourneyStepLog(input: ICreateJourneyStepLogInput): Promise<IJourneyStepLog> {
    const response = await save_content({
      schema: 'JourneyStepLog',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo JourneyStepLog');
    return response.data as IJourneyStepLog;
  },

  async updateJourneyStepLog(id: string, input: Partial<ICreateJourneyStepLogInput>): Promise<IJourneyStepLog> {
    const response = await update_partial_content({
      schema: 'JourneyStepLog',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật JourneyStepLog');
    return response.data as IJourneyStepLog;
  },

  async deleteJourneyStepLog(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'JourneyStepLog',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiJourneyStepLog(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'JourneyStepLog',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockJourneyStepLog(id: string, locked: boolean = true): Promise<IJourneyStepLog> {
    const response = await lock_content({
      schema: 'JourneyStepLog',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa JourneyStepLog');
    return response.data as IJourneyStepLog;
  },

  async findJourneyStepLogDto(id: string): Promise<IJourneyStepLog> {
    const response = await query<IJourneyStepLog>(FIND_JOURNEYSTEPLOG_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy JourneyStepLog');
    return response.data;
  },
  async queryJourneyStepLogsDto(filter?: GeneralCollectionFilter): Promise<IJourneyStepLogListResponse> {
    return await queryList<IJourneyStepLog>(
      QUERY_JOURNEYSTEPLOGS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default journeyStepLogService;
