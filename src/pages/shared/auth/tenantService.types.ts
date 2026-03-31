import type { ApiResponse } from 'types/apis/ApiResponse';
import type { MongoIdentifiableWithTime } from 'types/base/MongoModel';

export interface AppDeploymentDto {
  tokenEndpoint: string;
  /** Optional: explicit backend auth base (exposes /auth/login, /auth/exchange). */
  authEndpoint?: string;
  apiEndpoint: string;
  issuer: string;
  redirect_uri: string;
}

export type TenantTier = 'Free' | 'Standard' | 'Premium' | 'Enterprise' | 0 | 1 | 2 | 3;

export interface TenantInfo extends MongoIdentifiableWithTime {
  name?: string;
  code?: string;
  domain?: string;
  description?: string;
  logoId?: string | null;
  color?: string;
}

export interface TenantRegistrationPublicDto {
  tenant?: TenantInfo | null;
  code?: string | null;
  tier?: TenantTier | null;
  expiredAt?: string | null;
  access_link?: string | null;
  deployment?: AppDeploymentDto | null;
  /** Backward compatibility (older backend) */
  _id?: string;
  /** Backward compatibility (older backend) */
  tenantId?: string;
}

export type TenantServiceResponse = ApiResponse<TenantRegistrationPublicDto> & {
  isPopup?: boolean;
  meta?: unknown;
};
