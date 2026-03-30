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

import { FIND_PORTALMESSAGE_DTO, QUERY_PORTALMESSAGES_DTO } from '../queries/portalMessage.queries';
import {
  IPortalMessage,
  ICreatePortalMessageInput,
  IPortalMessageListResponse
} from '../types/portalMessage.types';

export const portalMessageService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PortalMessage', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PortalMessage');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPortalMessageListResponse> {
    return await query_content<IPortalMessage>({ schema: 'PortalMessage', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PortalMessage', filter });
    return response?.data || 0;
  },

  async createPortalMessage(input: ICreatePortalMessageInput): Promise<IPortalMessage> {
    const response = await save_content({
      schema: 'PortalMessage',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PortalMessage');
    return response.data as IPortalMessage;
  },

  async updatePortalMessage(id: string, input: Partial<ICreatePortalMessageInput>): Promise<IPortalMessage> {
    const response = await update_partial_content({
      schema: 'PortalMessage',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PortalMessage');
    return response.data as IPortalMessage;
  },

  async deletePortalMessage(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PortalMessage',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPortalMessage(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PortalMessage',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPortalMessage(id: string, locked: boolean = true): Promise<IPortalMessage> {
    const response = await lock_content({
      schema: 'PortalMessage',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PortalMessage');
    return response.data as IPortalMessage;
  },

  async findPortalMessageDto(id: string): Promise<IPortalMessage> {
    const response = await query<IPortalMessage>(FIND_PORTALMESSAGE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PortalMessage');
    return response.data;
  },
  async queryPortalMessagesDto(filter?: GeneralCollectionFilter): Promise<IPortalMessageListResponse> {
    return await queryList<IPortalMessage>(
      QUERY_PORTALMESSAGES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default portalMessageService;
