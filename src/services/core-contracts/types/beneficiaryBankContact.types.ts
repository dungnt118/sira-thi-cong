import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * BeneficiaryBankContact interface
 * Auto-generated from Schema: BeneficiaryBankContact
 */
export interface IBeneficiaryBankContact {
  _id: string;
  contact_type?: BeneficiaryBankContactContactTypeEnum;
  contact_name?: string;
  phone?: string;
  email?: string;
  linked_distributor_id?: string;
  idx_linked_distributor_id?: IndexedContentItem;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_name?: string;
  branch_name?: string;
  identity_no?: string;
  tax_code?: string;
  is_frequent?: boolean;
  status?: BeneficiaryBankContactStatusEnum;
  note?: string;
}

export interface ICreateBeneficiaryBankContactInput {
  contact_type?: BeneficiaryBankContactContactTypeEnum2;
  contact_name?: string;
  phone?: string;
  email?: string;
  linked_distributor_id?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_name?: string;
  branch_name?: string;
  identity_no?: string;
  tax_code?: string;
  is_frequent?: boolean;
  status?: BeneficiaryBankContactStatusEnum2;
  note?: string;
}

export type IBeneficiaryBankContactListResponse = ApiListResponse<IBeneficiaryBankContact>

// Union types generated from value_options
export type BeneficiaryBankContactContactTypeEnum = 'supplier' | 'partner' | 'employee' | 'customer' | 'other';
export type BeneficiaryBankContactStatusEnum = 'active' | 'inactive';
export type BeneficiaryBankContactContactTypeEnum2 = 'supplier' | 'partner' | 'employee' | 'customer' | 'other';
export type BeneficiaryBankContactStatusEnum2 = 'active' | 'inactive';
