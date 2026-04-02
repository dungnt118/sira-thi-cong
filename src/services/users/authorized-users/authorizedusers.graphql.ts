/**
 * GraphQL Queries and Mutations for AuthorizedUsers Module
 */

import gql from 'graphql-tag';

// ============ QUERIES ============

export const SEARCH_AUTHORIZED_USERS = gql`
  query search_authorized_users(
    $keyword: String
    $isActive: Boolean
    $globalUserId: String
    $clientId: String
    $page: Int
    $pageSize: Int
  ) {
    response: search_authorized_users(
      keyword: $keyword
      isActive: $isActive
      globalUserId: $globalUserId
      clientId: $clientId
      page: $page
      pageSize: $pageSize
    ) {
      code
      message
      data
      page
      records
      pages
      hasMore
    }
  }
`;

export const GET_AUTHORIZED_USER = gql`
  query get_authorized_user($userId: String!) {
    response: get_authorized_user(userId: $userId) {
      code
      message
      data
    }
  }
`;

export const GET_AUTHORIZED_USER_STATS = gql`
  query get_authorized_user_stats {
    response: get_authorized_user_stats {
      code
      message
      data
    }
  }
`;

export const LIST_AUTHORIZED_USERS_BY_ROLE = gql`
  query list_authorized_users_by_role($role: String!, $page: Int, $pageSize: Int) {
    response: list_authorized_users_by_role(role: $role, page: $page, pageSize: $pageSize) {
      code
      message
      data
      page
      records
      pages
      hasMore
    }
  }
`;

export const LIST_AUTHORIZED_USERS_BY_GLOBAL_USER = gql`
  query list_authorized_users_by_global_user($globalUserId: String!, $page: Int, $pageSize: Int) {
    response: list_authorized_users_by_global_user(globalUserId: $globalUserId, page: $page, pageSize: $pageSize) {
      code
      message
      data
      page
      records
      pages
      hasMore
    }
  }
`;

// ============ MUTATIONS ============

// ============ DIRECT CREATION (ADMIN/ROOT — SKIPS INVITATION) ============

export const CREATE_AUTHORIZED_USER = gql`
  mutation create_authorized_user(
    $globalUserId: String!
    $clientId: String!
    $roles: [String]
    $role: String
    $subjectId: String
    $externalRef: String
  ) {
    response: create_authorized_user(
      globalUserId: $globalUserId
      clientId: $clientId
      roles: $roles
      role: $role
      subjectId: $subjectId
      externalRef: $externalRef
    ) {
      code
      message
      data
    }
  }
`;

// ============ AUTHORIZED USER INVITATION (FLOW A) ============

export const CREATE_AUTHORIZED_USER_INVITATION = gql`
  mutation create_authorized_user_invitation(
    $clientId: String!
    $email: String!
    $roles: [String]
    $subjectId: String
    $externalRef: String
  ) {
    response: create_authorized_user_invitation(
      client_id: $clientId
      email: $email
      roles: $roles
      subjectId: $subjectId
      externalRef: $externalRef
    ) {
      code
      message
      data
    }
  }
`;

export const SEARCH_AUTHORIZED_USER_INVITATIONS = gql`
  query search_authorized_user_invitations(
    $clientId: String
    $email: String
    $isUsed: Boolean
    $externalRef: String
    $skip: Int
    $limit: Int
  ) {
    response: search_authorized_user_invitations(
      client_id: $clientId
      email: $email
      isUsed: $isUsed
      externalRef: $externalRef
      skip: $skip
      limit: $limit
    ) {
      code
      message
      data
      page
      records
      pages
      hasMore
    }
  }
`;

export const GET_AUTHORIZED_USER_INVITATION = gql`
  query get_authorized_user_invitation($invitationId: String!) {
    response: get_authorized_user_invitation(invitationId: $invitationId) {
      code
      message
      data
    }
  }
`;

export const REVOKE_AUTHORIZED_USER_INVITATION = gql`
  mutation revoke_authorized_user_invitation($invitationId: String!) {
    response: revoke_authorized_user_invitation(invitationId: $invitationId) {
      code
      message
      data
    }
  }
`;

export const RESEND_AUTHORIZED_USER_INVITATION = gql`
  mutation resend_authorized_user_invitation($invitationId: String!) {
    response: resend_authorized_user_invitation(invitationId: $invitationId) {
      code
      message
      data
    }
  }
`;

export const RECREATE_AUTHORIZED_USER_INVITATION = gql`
  mutation recreate_authorized_user_invitation($invitationId: String!) {
    response: recreate_authorized_user_invitation(invitationId: $invitationId) {
      code
      message
      data
    }
  }
`;

// ============ ROLE MANAGEMENT (Admin-GQL-04) ============

export const ASSIGN_ROLES = gql`
  mutation assign_roles($userId: String!, $roles: [String!]!) {
    response: assign_roles(userId: $userId, roles: $roles) {
      code
      message
      data
    }
  }
`;

export const REMOVE_ROLES = gql`
  mutation remove_roles($userId: String!, $roles: [String!]!) {
    response: remove_roles(userId: $userId, roles: $roles) {
      code
      message
      data
    }
  }
`;

export const SET_DEFAULT_ROLE = gql`
  mutation set_default_role($userId: String!, $role: String!) {
    response: set_default_role(userId: $userId, role: $role) {
      code
      message
      data
    }
  }
`;

export const DELETE_AUTHORIZED_USER = gql`
  mutation delete_authorized_user($userId: String!) {
    response: delete_authorized_user(userId: $userId) {
      code
      message
      data
    }
  }
`;

export const ACTIVATE_AUTHORIZED_USER = gql`
  mutation activate_authorized_user($userId: String!) {
    response: activate_authorized_user(userId: $userId) {
      code
      message
      data
    }
  }
`;

export const DEACTIVATE_AUTHORIZED_USER = gql`
  mutation deactivate_authorized_user($userId: String!) {
    response: deactivate_authorized_user(userId: $userId) {
      code
      message
      data
    }
  }
`;

export const BULK_ACTIVATE_AUTHORIZED_USERS = gql`
  mutation bulk_activate_authorized_users($userIds: [String!]!) {
    response: bulk_activate_authorized_users(userIds: $userIds) {
      code
      message
      data
    }
  }
`;

export const BULK_DEACTIVATE_AUTHORIZED_USERS = gql`
  mutation bulk_deactivate_authorized_users($userIds: [String!]!) {
    response: bulk_deactivate_authorized_users(userIds: $userIds) {
      code
      message
      data
    }
  }
`;

export const BULK_ASSIGN_ROLES = gql`
  mutation bulk_assign_roles($userIds: [String!]!, $roles: [String!]!) {
    response: bulk_assign_roles(userIds: $userIds, roles: $roles) {
      code
      message
      data
    }
  }
`;

// ============ IDENTITY CONTEXTS (V3.1) ============

export const LIST_IDENTITY_CONTEXTS = gql`
  query list_identity_contexts($userId: String!) {
    response: list_identity_contexts(userId: $userId) {
      code
      message
      data
    }
  }
`;

export const ADD_IDENTITY_CONTEXT = gql`
  mutation add_identity_context(
    $userId: String!
    $clientId: String!
    $roles: [String!]!
    $defaultRole: String,
    $subjectSchema: String,
    $subjectId: String,
    $metadata: Dictionary
  ) {
    response: add_identity_context(
      userId: $userId
      clientId: $clientId
      roles: $roles
      defaultRole: $defaultRole,
      subjectSchema: $subjectSchema,
      subjectId: $subjectId,
      metadata: $metadata
    ) {
      code
      message
      data
    }
  }
`;

export const REMOVE_IDENTITY_CONTEXT = gql`
  mutation remove_identity_context($userId: String!, $clientId: String!) {
    response: remove_identity_context(userId: $userId, clientId: $clientId) {
      code
      message
      data
    }
  }
`;

export const UPDATE_IDENTITY_CONTEXT = gql`
  mutation update_identity_context(
    $userId: String!
    $clientId: String!
    $roles: [String!]!
    $defaultRole: String,
    $subjectSchema: String,
    $subjectId: String,
    $metadata: Dictionary
  ) {
    response: update_identity_context(
      userId: $userId
      clientId: $clientId
      roles: $roles
      defaultRole: $defaultRole,
      subjectSchema: $subjectSchema,
      subjectId: $subjectId,
      metadata: $metadata
    ) {
      code
      message
      data
    }
  }
`;

// ============ UI HELPERS (V3.1 P2-UI-01) ============

export const GET_AVAILABLE_CLIENT_APPLICATIONS = gql`
  query get_available_client_applications {
    response: get_available_client_applications {
      code
      message
      data 
      page
      records
      pages
      hasMore
    }
  }
`;

export const GET_FULL_CLIENT_APPLICATIONS = gql`
  query get_full_client_applications {
    response: get_full_client_applications {
      code
      message
      data
      page
      records
      pages
      hasMore
    }
  }
`;

export const GET_CLIENT_ROLES = gql`
  query get_client_roles($clientId: String!) {
    response: get_client_roles(clientId: $clientId) {
      code
      message
      data 
      page
      records
      pages
      hasMore
    }
  }
`;

export const GET_USER_IDENTITY_CONTEXTS_FOR_SWITCHER = gql`
  query get_user_identity_contexts_for_switcher {
    response: get_user_identity_contexts_for_switcher {
      code
      message
      data
      page
      records
      pages
      hasMore
    }
  }
`;

export const GET_CURRENT_IDENTITY_PERMISSIONS = gql`
  query get_current_identity_permissions {
    response: get_current_identity_permissions {
      code
      message
      data
    }
  }
`;

// ============ GLOBAL USER (PUBLIC) ============

export const SEARCH_GLOBAL_USERS = gql`
  query search_global_users(
    $text: String
    $page: Int
    $pageSize: Int
  ) {
    response: search_global_users(
      text: $text
      page: $page
      page_size: $pageSize
    ) {
      code
      message
      data
      page
      records
      pages
      hasMore
    }
  }
`;

export const GET_GLOBAL_USER_DETAIL = gql`
  query get_global_user_detail($userId: String!) {
    response: get_global_user_detail(userId: $userId) {
      code
      message
      data
    }
  }
`;
