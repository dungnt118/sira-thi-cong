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

import { FIND_CONTENTCHATBOXMESSAGE_DTO, QUERY_CONTENTCHATBOXMESSAGES_DTO } from '../queries/contentChatboxMessage.queries';
import {
  IContentChatboxMessage,
  ICreateContentChatboxMessageInput,
  IContentChatboxMessageListResponse
} from '../types/contentChatboxMessage.types';

export const contentChatboxMessageService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ContentChatboxMessage', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ContentChatboxMessage');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IContentChatboxMessageListResponse> {
    return await query_content<IContentChatboxMessage>({ schema: 'ContentChatboxMessage', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ContentChatboxMessage', filter });
    return response?.data || 0;
  },

  async createContentChatboxMessage(input: ICreateContentChatboxMessageInput): Promise<IContentChatboxMessage> {
    const response = await save_content({
      schema: 'ContentChatboxMessage',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ContentChatboxMessage');
    return response.data as IContentChatboxMessage;
  },

  async updateContentChatboxMessage(id: string, input: Partial<ICreateContentChatboxMessageInput>): Promise<IContentChatboxMessage> {
    const response = await update_partial_content({
      schema: 'ContentChatboxMessage',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ContentChatboxMessage');
    return response.data as IContentChatboxMessage;
  },

  async deleteContentChatboxMessage(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ContentChatboxMessage',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiContentChatboxMessage(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ContentChatboxMessage',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockContentChatboxMessage(id: string, locked: boolean = true): Promise<IContentChatboxMessage> {
    const response = await lock_content({
      schema: 'ContentChatboxMessage',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ContentChatboxMessage');
    return response.data as IContentChatboxMessage;
  },

  async findContentChatboxMessageDto(id: string): Promise<IContentChatboxMessage> {
    const response = await query<IContentChatboxMessage>(FIND_CONTENTCHATBOXMESSAGE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ContentChatboxMessage');
    return response.data;
  },
  async queryContentChatboxMessagesDto(filter?: GeneralCollectionFilter): Promise<IContentChatboxMessageListResponse> {
    return await queryList<IContentChatboxMessage>(
      QUERY_CONTENTCHATBOXMESSAGES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default contentChatboxMessageService;
