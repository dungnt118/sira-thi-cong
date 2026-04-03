import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * CompanyBankAccount interface
 * Auto-generated from Schema: CompanyBankAccount
 */
export interface ICompanyBankAccount {
  _id: string;
  code?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  branch_name?: string;
  currency?: CompanyBankAccountCurrencyEnum;
  is_default?: boolean;
  status?: CompanyBankAccountStatusEnum;
  note?: string;
}

export interface ICreateCompanyBankAccountInput {
  code?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  branch_name?: string;
  currency?: CompanyBankAccountCurrencyEnum2;
  is_default?: boolean;
  status?: CompanyBankAccountStatusEnum2;
  note?: string;
}

export type ICompanyBankAccountListResponse = ApiListResponse<ICompanyBankAccount>

// Union types generated from value_options
export type CompanyBankAccountCurrencyEnum = 'vnd' | 'usd' | 'eur';
export type CompanyBankAccountStatusEnum = 'active' | 'inactive';
export type CompanyBankAccountCurrencyEnum2 = 'vnd' | 'usd' | 'eur';
export type CompanyBankAccountStatusEnum2 = 'active' | 'inactive';
