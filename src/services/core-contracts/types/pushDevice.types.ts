import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * PushDevice interface
 * Auto-generated from Schema: PushDevice
 */
export interface IPushDevice {
  _id: string;
  tokenId?: string;
  deviceId?: string;
  username?: string;
  platform?: PushDevicePlatformEnum;
  appId?: string;
  p256dh?: string;
  auth?: string;
  last_ip?: string;
  device_info?: any;
  extra_info?: any;
  name?: string;
}

export interface ICreatePushDeviceInput {
  tokenId?: string;
  deviceId?: string;
  username?: string;
  platform?: PushDevicePlatformEnum2;
  appId?: string;
  p256dh?: string;
  auth?: string;
  last_ip?: string;
  device_info?: any;
  extra_info?: any;
  name?: string;
}

export type IPushDeviceListResponse = ApiListResponse<IPushDevice>

// Union types generated from value_options
export type PushDevicePlatformEnum = 'undefined' | 'android' | 'ios' | 'web';
export type PushDevicePlatformEnum2 = 'undefined' | 'android' | 'ios' | 'web';
