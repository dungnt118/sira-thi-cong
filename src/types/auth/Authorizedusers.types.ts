/**
 * TypeScript Type Definitions for AuthorizedUsers Module
 */

import type { Key } from 'react';
import type { AuthorizationPolicy } from 'types/auth/AuthorizationPolicy';

export type { AuthorizationPolicy } from 'types/auth/AuthorizationPolicy';

export interface IdentityContext {
  clientId: string;
  subjectSchema?: string | null;
  policy: AuthorizationPolicy;
  subjectId?: string | null;
  roles: string[];
  defaultRole?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface BaseUserInfo {
  avatarId?: string | null;
  fullName?: string | null;
  type?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  title?: string | null;
  tenantId?: string | null;
}

export interface AuthorizedUser extends BaseUserInfo {
  _id: string;
  globalUserId?: string | null;
  username?: string | null;
  isActive: boolean;
  permVer?: number;
  isRoot?: boolean;
  identity_contexts?: IdentityContext[] | null;
}

export interface ClientApplicationInfo {
  client_id: string;
  display_name: string;
  policy: AuthorizationPolicy;
  description?: string | null;
  subject_schema?: string | null;
  subjectSchema?: string | null;
  allowed_roles?: ClientAllowedRoleOption[] | null;
}

export interface ClientAllowedRoleOption {
  Value: string;
  Label: string;
  Pickable?: boolean | null;
}

export interface RoleOption {
  role_id: string;
  role_name: string;
  role_code?: string | null;
  description?: string | null;
  is_locked?: boolean | null;
}

export interface GlobalUserPublicInfo {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
}

export interface BulkOperationError {
  UserId: string;
  ErrorMessage: string;
}

export interface BulkOperationResult {
  TotalCount: number;
  SuccessCount: number;
  FailedCount: number;
  Errors: BulkOperationError[];
  IsSuccess: boolean;
}

// ============ UI TYPES ============

export interface AuthorizedUsersAdminProps {
  tenantId?: string;
}

export interface AuthorizedUsersTableProps {
  keyword: string;
  clientId?: string;
  globalUserId?: string;
  refreshKey: number;

  /** Map roleId -> label, dùng để hiển thị Vai trò (đặc biệt cho policy=staff) */
  staffRoleLabelById?: Record<string, string>;

  /** Map clientId -> display_name, dùng để hiển thị tên ứng dụng thay cho clientId thô */
  clientDisplayNameById?: Record<string, string>;

  selectedRowKeys?: Key[];
  onSelectedRowKeysChange?: (keys: Key[]) => void;
  onViewDetails: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  onActivate: (userId: string) => void;
  onDeactivate: (userId: string) => void;

  // Context menu: role management
  onAssignRoles?: (userId: string) => void;
  onRemoveRoles?: (userId: string) => void;
  onSetDefaultRole?: (userId: string) => void;

  // Context menu: identity contexts (V3.1)
  onAddIdentityContext?: (userId: string) => void;
  onUpdateIdentityContext?: (userId: string) => void;
  onRemoveIdentityContext?: (userId: string) => void;
}

export interface AuthorizedUserInvitationDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface AuthorizedUserEditDrawerProps {
  open: boolean;
  userId?: string;
  preferredClientId?: string;
  onClose: () => void;
  onUpdated?: () => void;
}

export interface CreateAuthorizedUserInvitationResult {
  invitationId: string;
  regcode: string;
  client_id: string;
  expiresAt: string;
}

export interface AuthorizedUserInvitation {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  regcode: string;
  /**
   * Public invitation landing link (without one-time code).
   * Used for UI/UX (copy/share) purposes.
   */
  inviteLink?: string | null;
  globalUserId?: string | null;
  client_id: string;
  roles?: string[] | null;
  subjectId?: string | null;
  email?: string | null;
  externalRef?: string | null;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string | null;
  codeHash?: string | null;
}

export interface AuthorizedUserInvitationFormValues {
  clientId: string;
  email: string;
  roles?: string[];
  subjectId?: string;
  externalRef?: string;
  expiresInDays?: number;
}

export interface IdentityContextEditorValues {
  clientId: string;
  roleIds: string[];
  defaultRoleId?: string;
}
