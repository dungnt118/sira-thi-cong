import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MailSystem interface
 * Auto-generated from Schema: MailSystem
 */
export interface IMailSystem {
  _id: string;
  username?: string;
  password?: string;
  send_from?: string;
  display_name?: string;
  smtp_address?: string;
  smtp_port?: number;
  is_ssl?: boolean;
  is_logo?: boolean;
  logo?: ILogoItem[];
  is_sign?: boolean;
  signature?: string;
}

export interface ILogoItem {
  file_id?: string;
  name?: string;
  mine_type?: string;
  size?: any[];
  alt?: string;
  url?: string;
  file_type?: string;
  file_path?: string;
}

export interface ICreateMailSystemInput {
  username?: string;
  password?: string;
  send_from?: string;
  display_name?: string;
  smtp_address?: string;
  smtp_port?: number;
  is_ssl?: boolean;
  is_logo?: boolean;
  logo?: ILogoItem[];
  is_sign?: boolean;
  signature?: string;
}

export type IMailSystemListResponse = ApiListResponse<IMailSystem>
