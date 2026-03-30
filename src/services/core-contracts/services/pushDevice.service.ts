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

import { FIND_PUSHDEVICE_DTO, QUERY_PUSHDEVICES_DTO } from '../queries/pushDevice.queries';
import {
  IPushDevice,
  ICreatePushDeviceInput,
  IPushDeviceListResponse
} from '../types/pushDevice.types';

export const pushDeviceService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'PushDevice', _id: id });
    if (!response.data) throw new Error('Không tìm thấy PushDevice');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IPushDeviceListResponse> {
    return await query_content<IPushDevice>({ schema: 'PushDevice', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'PushDevice', filter });
    return response?.data || 0;
  },

  async createPushDevice(input: ICreatePushDeviceInput): Promise<IPushDevice> {
    const response = await save_content({
      schema: 'PushDevice',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo PushDevice');
    return response.data as IPushDevice;
  },

  async updatePushDevice(id: string, input: Partial<ICreatePushDeviceInput>): Promise<IPushDevice> {
    const response = await update_partial_content({
      schema: 'PushDevice',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật PushDevice');
    return response.data as IPushDevice;
  },

  async deletePushDevice(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'PushDevice',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiPushDevice(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'PushDevice',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockPushDevice(id: string, locked: boolean = true): Promise<IPushDevice> {
    const response = await lock_content({
      schema: 'PushDevice',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa PushDevice');
    return response.data as IPushDevice;
  },

  async findPushDeviceDto(id: string): Promise<IPushDevice> {
    const response = await query<IPushDevice>(FIND_PUSHDEVICE_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy PushDevice');
    return response.data;
  },
  async queryPushDevicesDto(filter?: GeneralCollectionFilter): Promise<IPushDeviceListResponse> {
    return await queryList<IPushDevice>(
      QUERY_PUSHDEVICES_DTO,
      { filter, custominput: {} }
    );
  },
};
export default pushDeviceService;
