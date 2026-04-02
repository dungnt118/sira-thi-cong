/**
 * Global User Manager – Type Definitions
 * Based on GlobalUser GraphQL schema
 */

// ─── Enums ──────────────────────────────────────────────────────────

export type IdentityUserRole = 'user' | 'admin';

// ─── Core entity ────────────────────────────────────────────────────

export interface IGlobalUser {

    // Identity fields
    id?: string;
    username?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;

    // Auth / security
    role?: IdentityUserRole;
    emailConfirmed?: boolean;
    isActive?: boolean;
    failedLoginAttempts?: number;
    lockoutEnd?: string;
    isLockedOut?: boolean;

    // System
    createdAt?: string;
    externalIdentities?: Record<string, unknown>[];
}

// ─── List / Filter ──────────────────────────────────────────────────

export interface IGlobalUserListFilter {
    keyword?: string;
    isActive?: boolean | null;
    emailConfirmed?: boolean | null;
    page?: number;
    pageSize?: number;
}

export interface IGlobalUserListResponse {
    success: boolean;
    data: IGlobalUser[];
    total: number;
    page: number;
    pageSize: number;
}

// ─── Create payload ─────────────────────────────────────────────────

export interface ICreateGlobalUserPayload {
    login: string;
    password: string;
    profile: {
        displayName?: string;
        phone?: string;
        email?: string;
    };
}

// ─── Update payload ─────────────────────────────────────────────────

export interface IUpdateGlobalUserPayload {
    userId: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
}

// ─── UI helpers ─────────────────────────────────────────────────────

export const USER_STATUS_OPTIONS = [
    { label: 'Tất cả', value: '' },
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
];

export const EMAIL_CONFIRMED_OPTIONS = [
    { label: 'Tất cả', value: '' },
    { label: 'Đã xác nhận', value: 'confirmed' },
    { label: 'Chưa xác nhận', value: 'unconfirmed' },
];

export const ROLE_COLOR_MAP: Record<string, string> = {
    admin: 'gold',
    user: 'blue',
};

export const STATUS_CONFIG = {
    active: { color: 'green', label: 'Hoạt động' },
    inactive: { color: 'red', label: 'Không hoạt động' },
    locked: { color: 'orange', label: 'Đã khóa' },
} as const;
