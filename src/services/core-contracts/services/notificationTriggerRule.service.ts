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

import { FIND_NOTIFICATIONTRIGGERRULE_DTO, QUERY_NOTIFICATIONTRIGGERRULES_DTO } from '../queries/notificationTriggerRule.queries';
import {
  INotificationTriggerRule,
  ICreateNotificationTriggerRuleInput,
  INotificationTriggerRuleListResponse
} from '../types/notificationTriggerRule.types';

export const notificationTriggerRuleService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'NotificationTriggerRule', _id: id });
    if (!response.data) throw new Error('Không tìm thấy NotificationTriggerRule');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<INotificationTriggerRuleListResponse> {
    return await query_content<INotificationTriggerRule>({ schema: 'NotificationTriggerRule', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'NotificationTriggerRule', filter });
    return response?.data || 0;
  },

  async createNotificationTriggerRule(input: ICreateNotificationTriggerRuleInput): Promise<INotificationTriggerRule> {
    const response = await save_content({
      schema: 'NotificationTriggerRule',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo NotificationTriggerRule');
    return response.data as INotificationTriggerRule;
  },

  async updateNotificationTriggerRule(id: string, input: Partial<ICreateNotificationTriggerRuleInput>): Promise<INotificationTriggerRule> {
    const response = await update_partial_content({
      schema: 'NotificationTriggerRule',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật NotificationTriggerRule');
    return response.data as INotificationTriggerRule;
  },

  async deleteNotificationTriggerRule(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'NotificationTriggerRule',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiNotificationTriggerRule(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'NotificationTriggerRule',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockNotificationTriggerRule(id: string, locked: boolean = true): Promise<INotificationTriggerRule> {
    const response = await lock_content({
      schema: 'NotificationTriggerRule',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa NotificationTriggerRule');
    return response.data as INotificationTriggerRule;
  },

  async findNotificationTriggerRuleDto(id: string): Promise<INotificationTriggerRule> {
    const response = await query<INotificationTriggerRule>(FIND_NOTIFICATIONTRIGGERRULE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy NotificationTriggerRule');
    return response.data;
  },
  async queryNotificationTriggerRulesDto(filter?: GeneralCollectionFilter): Promise<INotificationTriggerRuleListResponse> {
    return await queryList<INotificationTriggerRule>(
      QUERY_NOTIFICATIONTRIGGERRULES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default notificationTriggerRuleService;
