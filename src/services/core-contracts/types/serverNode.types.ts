import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ServerNode interface
 * Auto-generated from Schema: ServerNode
 */
export interface IServerNode {
  _id: string;
  alias?: string;
  code?: string;
  mode?: ServerNodeModeEnum;
  ipDomain?: string;
  domain?: string;
  description?: string;
  privateKey?: string;
  publicKey?: string;
}

export interface ICreateServerNodeInput {
  alias?: string;
  code?: string;
  mode?: ServerNodeModeEnum2;
  ipDomain?: string;
  domain?: string;
  description?: string;
  privateKey?: string;
  publicKey?: string;
}

export type IServerNodeListResponse = ApiListResponse<IServerNode>

// Union types generated from value_options
export type ServerNodeModeEnum = 'Sandbox' | 'Master' | 'Slave';
export type ServerNodeModeEnum2 = 'Sandbox' | 'Master' | 'Slave';
