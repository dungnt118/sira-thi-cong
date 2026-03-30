import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * GuestAccount interface
 * Auto-generated from Schema: GuestAccount
 */
export interface IGuestAccount {
  _id: string;
  passwordHash?: string;
  password?: string;
  audience?: GuestAccountAudienceEnum;
  avatar?: string;
  fullName?: string;
  type?: string;
  email?: string;
  phoneNumber?: string;
  title?: string;
  tenantId?: string;
}

export interface ICreateGuestAccountInput {
  passwordHash?: string;
  password?: string;
  audience?: GuestAccountAudienceEnum2;
  avatar?: string;
  fullName?: string;
  type?: string;
  email?: string;
  phoneNumber?: string;
  title?: string;
  tenantId?: string;
}

export type IGuestAccountListResponse = ApiListResponse<IGuestAccount>

// Union types generated from value_options
export type GuestAccountAudienceEnum = 'guess' | 'host' | 'staff' | 'partner' | 'supplier';
export type GuestAccountAudienceEnum2 = 'guess' | 'host' | 'staff' | 'partner' | 'supplier';
