/**
 * Global User Manager – GraphQL Operations
 * Uses the `response: operation_name` alias pattern for consistency.
 */
import { gql } from '@apollo/client';

// ─── Fragment ────────────────────────────────────────────────────────

const GLOBAL_USER_FIELDS = `
    _id
    id
    username
    email
    fullName
    phoneNumber
    role
    emailConfirmed
    isActive
    failedLoginAttempts
    lockoutEnd
    isLockedOut
    createdAt
    externalIdentities
`;

// ─── Queries ────────────────────────────────────────────────────────

export const LIST_GLOBAL_USERS = gql`
    query ListGlobalUsers(
        $keyword: String
        $isActive: Boolean
        $emailConfirmed: Boolean
        $page: Int
        $pageSize: Int
    ) {
        response: list_global_users(
            keyword: $keyword
            isActive: $isActive
            emailConfirmed: $emailConfirmed
            page: $page
            pageSize: $pageSize
        ) {
            code
            message
            data
            records
            page
            pages
            
        }
    }
`;

export const GET_GLOBAL_USER_BY_ID = gql`
    query GetGlobalUserById($userId: String) {
        response: get_global_user_by_id(userId: $userId) {
            code
            message
            data
        }
    }
`;

// ─── Mutations ──────────────────────────────────────────────────────

export const CREATE_GLOBAL_USER = gql`
    mutation CreateGlobalUser(
        $login: String
        $password: String
        $profile: BasicUserProfileInput
    ) {
        response: create_global_user(
            login: $login
            password: $password
            profile: $profile
        ) {
            code
            message
            data
        }
    }
`;

export const UPDATE_GLOBAL_USER = gql`
    mutation UpdateGlobalUser(
        $userId: String
        $fullName: String
        $email: String
        $phoneNumber: String
    ) {
        response: update_global_user(
            userId: $userId
            fullName: $fullName
            email: $email
            phoneNumber: $phoneNumber
        ) {
            code
            message
            data
        }
    }
`;

export const ACTIVATE_GLOBAL_USER = gql`
    mutation ActivateGlobalUser($userId: String) {
        response: activate_global_user(userId: $userId) {
            code
            message
            data
        }
    }
`;

export const DEACTIVATE_GLOBAL_USER = gql`
    mutation DeactivateGlobalUser($userId: String) {
        response: deactivate_global_user(userId: $userId) {
            code
            message
            data
        }
    }
`;

export const DELETE_GLOBAL_USER = gql`
    mutation DeleteGlobalUser($userId: String) {
        response: delete_global_user(userId: $userId) {
            code
            message
            data
        }
    }
`;

export const RESET_GLOBAL_USER_PASSWORD = gql`
    mutation ResetGlobalUserPassword($userId: String, $newPassword: String) {
        response: reset_global_user_password(userId: $userId, newPassword: $newPassword) {
            code
            message
            data
        }
    }
`;

export const CONFIRM_GLOBAL_USER_EMAIL = gql`
    mutation ConfirmGlobalUserEmail($userId: String) {
        response: confirm_global_user_email(userId: $userId) {
            code
            message
            data
        }
    }
`;
