import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * AssetMaintenanceTicket interface
 * Auto-generated from Schema: AssetMaintenanceTicket
 */
export interface IAssetMaintenanceTicket {
  _id: string;
  code?: string;
  asset_id?: string;
  idx_asset_id?: IndexedContentItem;
  status?: AssetMaintenanceTicketStatusEnum;
  maintenance_partner_id?: string;
  idx_maintenance_partner_id?: IndexedContentItem;
  responsible_user?: any;
  maintenance_date?: string | Date;
  completed_at?: string | Date;
  cost_amount?: number;
  journey_id?: string;
  idx_journey_id?: IndexedContentItem;
  notes?: string;
}

export interface ICreateAssetMaintenanceTicketInput {
  code?: string;
  asset_id?: string;
  status?: AssetMaintenanceTicketStatusEnum2;
  maintenance_partner_id?: string;
  responsible_user?: any;
  maintenance_date?: string | Date;
  completed_at?: string | Date;
  cost_amount?: number;
  journey_id?: string;
  notes?: string;
}

export type IAssetMaintenanceTicketListResponse = ApiListResponse<IAssetMaintenanceTicket>

// Union types generated from value_options
export type AssetMaintenanceTicketStatusEnum = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type AssetMaintenanceTicketStatusEnum2 = 'planned' | 'in_progress' | 'completed' | 'cancelled';
