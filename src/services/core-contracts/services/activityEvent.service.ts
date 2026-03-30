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

import { FIND_ACTIVITYEVENT_DTO, QUERY_ACTIVITYEVENTS_DTO } from '../queries/activityEvent.queries';
import {
  IActivityEvent,
  ICreateActivityEventInput,
  IActivityEventListResponse
} from '../types/activityEvent.types';

export const activityEventService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ActivityEvent', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ActivityEvent');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IActivityEventListResponse> {
    return await query_content<IActivityEvent>({ schema: 'ActivityEvent', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ActivityEvent', filter });
    return response?.data || 0;
  },

  async createActivityEvent(input: ICreateActivityEventInput): Promise<IActivityEvent> {
    const response = await save_content({
      schema: 'ActivityEvent',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ActivityEvent');
    return response.data as IActivityEvent;
  },

  async updateActivityEvent(id: string, input: Partial<ICreateActivityEventInput>): Promise<IActivityEvent> {
    const response = await update_partial_content({
      schema: 'ActivityEvent',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ActivityEvent');
    return response.data as IActivityEvent;
  },

  async deleteActivityEvent(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ActivityEvent',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiActivityEvent(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ActivityEvent',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockActivityEvent(id: string, locked: boolean = true): Promise<IActivityEvent> {
    const response = await lock_content({
      schema: 'ActivityEvent',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ActivityEvent');
    return response.data as IActivityEvent;
  },

  async findActivityEventDto(id: string): Promise<IActivityEvent> {
    const response = await query<IActivityEvent>(FIND_ACTIVITYEVENT_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ActivityEvent');
    return response.data;
  },
  async queryActivityEventsDto(filter?: GeneralCollectionFilter): Promise<IActivityEventListResponse> {
    return await queryList<IActivityEvent>(
      QUERY_ACTIVITYEVENTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default activityEventService;
