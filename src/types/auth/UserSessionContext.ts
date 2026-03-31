import { AuthorizedUser } from './Authorizedusers.types';
import type { NavigationItem } from 'app/store/types/fuse.types';
import type { UserType } from '../base/UserType';
import type { Department, Employee } from '../org/OrgEntities';
import type { AuthorizationPolicy } from './AuthorizationPolicy';

export interface BaseExpandoModelNoId {
	[key: string]: unknown;
}

export type Dictionary<T = unknown> = Record<string, T>;

export interface AccountExtend extends UserType {
	employeeName?: string;
	employeeCode?: string;
	roleNames?: string[];
	departmentName?: string;
	[key: string]: unknown;
}

export interface Role {
	_id?: string;
	name?: string;
	description?: string;
	permissions?: string[];
	[key: string]: unknown;
}

export interface TenantSummary {
	_id: string;
	name?: string;
	[key: string]: unknown;
}

export type UserSessionEventType =
	| 'CREATE'
	| 'READ'
	| 'UPDATE'
	| 'DELETE'
	| 'ACTION'
	| 'HOOK'
	| string;

export interface UserSessionContext extends BaseExpandoModelNoId {
	// ============ Canonical fields (match backend JSON) ============
	path?: string;
	client_id?: string;
	schema?: string;
	employee?: Employee | null;
	departments?: Department[] | null;
	lang?: string;
	token?: string;
	/** Some backend payloads use '@params' as the JSON key. */
	'@params'?: Dictionary;
	params?: Dictionary;
	activeRole?: string | null;
	user?: AuthorizedUser;
	policy?: AuthorizationPolicy;
	regcode?: string;
	host?: string;
	api?: string;
	ip?: string;
	cookies?: string;
	headers?: Dictionary;
	expireTime?: Date | string | null;
	sessionId?: string;

	// ============ Legacy/compat fields (older backend/client) ============
	/** @deprecated: backend moved to policy-based privilege; use `policy` */
	isSystem?: boolean;
	/** @deprecated: backend uses `regcode` */
	regCode?: string;
	/** @deprecated: use `client_id` */
	clientId?: string;
	/** @deprecated: use `tenantId` (if still provided) */
	deployementId?: string;
	registrationId?: string;
	tenantId?: string;
	type?: UserSessionEventType;
	roles?: Role[];
	role?: Role;
	allowAnonymous?: boolean;
	welcome_url?: string;
	shortcuts?: string[];
	settings?: Record<string, unknown>;
	info?: Record<string, unknown> | null;
	permissions?: string[];
	favourist_menus?: NavigationItem[];
	menuGraph?: NavigationItem[];
	tenants?: TenantSummary[];
}


export const createSystemContext = (regcode: string): UserSessionContext => ({
	regcode,
	policy: 'system',
	client_id: 'system',
	user: {
		username: 'system',
		isActive: true,
		_id: '',
	},
});
