/**
 * Global User API Service
 * Handles all API calls for global user management
 */

import { mutate, query, queryList } from 'app/services/graphqlService';
import { ApiResponseCode } from 'types/apis/ApiResponse';
import type {
    ICreateGlobalUserPayload,
    IGlobalUser,
    IGlobalUserListFilter,
    IGlobalUserListResponse,
    IUpdateGlobalUserPayload
} from './global-user.types';
import {
    ACTIVATE_GLOBAL_USER,
    CONFIRM_GLOBAL_USER_EMAIL,
    CREATE_GLOBAL_USER,
    DEACTIVATE_GLOBAL_USER,
    DELETE_GLOBAL_USER,
    GET_GLOBAL_USER_BY_ID,
    LIST_GLOBAL_USERS,
    RESET_GLOBAL_USER_PASSWORD,
    UPDATE_GLOBAL_USER
} from './global-user.graphql';

/**
 * Global User API Service
 */
export const globalUserService = {

    // ─── Read operations ────────────────────────────────────────────

    /**
     * List global users with pagination and filters
     */
    async listUsers(filter?: IGlobalUserListFilter): Promise<IGlobalUserListResponse> {
        const page = filter?.page ?? 1;
        const pageSize = filter?.pageSize ?? 20;

        const variables: Record<string, unknown> = { page, pageSize };

        if (filter?.keyword) variables.keyword = filter.keyword;
        if (filter?.isActive !== undefined && filter?.isActive !== null) variables.isActive = filter.isActive;
        if (filter?.emailConfirmed !== undefined && filter?.emailConfirmed !== null) variables.emailConfirmed = filter.emailConfirmed;

        const response = await queryList<IGlobalUser>(LIST_GLOBAL_USERS, variables);

        return {
            success: response.code === ApiResponseCode.SUCCESS,
            data: response.data ?? [],
            total: response.records ?? 0,
            page,
            pageSize,
        };
    },

    /**
     * Get single global user detail
     */
    async getUserDetail(userId: string): Promise<IGlobalUser> {
        const response = await query<IGlobalUser>(GET_GLOBAL_USER_BY_ID, { userId });

        if (!response.data) {
            throw new Error('Không tìm thấy người dùng');
        }

        return response.data;
    },

    // ─── Write operations ───────────────────────────────────────────

    /**
     * Create a new global user
     */
    async createUser(payload: ICreateGlobalUserPayload): Promise<IGlobalUser> {
        const response = await mutate<IGlobalUser>(CREATE_GLOBAL_USER, {
            login: payload.login,
            password: payload.password,
            profile: payload.profile,
        });

        if (!response.data) {
            throw new Error(response.message || 'Tạo người dùng thất bại');
        }

        return response.data;
    },

    /**
     * Update an existing global user
     */
    async updateUser(payload: IUpdateGlobalUserPayload): Promise<boolean> {
        const response = await mutate<unknown>(UPDATE_GLOBAL_USER, payload);
        return response.code === ApiResponseCode.SUCCESS;
    },

    /**
     * Activate a global user
     */
    async activateUser(userId: string): Promise<boolean> {
        const response = await mutate<unknown>(ACTIVATE_GLOBAL_USER, { userId });
        return response.code === ApiResponseCode.SUCCESS;
    },

    /**
     * Deactivate a global user
     */
    async deactivateUser(userId: string): Promise<boolean> {
        const response = await mutate<unknown>(DEACTIVATE_GLOBAL_USER, { userId });
        return response.code === ApiResponseCode.SUCCESS;
    },

    /**
     * Delete a global user
     */
    async deleteUser(userId: string): Promise<boolean> {
        const response = await mutate<unknown>(DELETE_GLOBAL_USER, { userId });
        return response.code === ApiResponseCode.SUCCESS;
    },

    /**
     * Reset a global user's password
     */
    async resetPassword(userId: string, newPassword: string): Promise<boolean> {
        const response = await mutate<unknown>(RESET_GLOBAL_USER_PASSWORD, { userId, newPassword });
        return response.code === ApiResponseCode.SUCCESS;
    },

    /**
     * Confirm a global user's email
     */
    async confirmEmail(userId: string): Promise<boolean> {
        const response = await mutate<unknown>(CONFIRM_GLOBAL_USER_EMAIL, { userId });
        return response.code === ApiResponseCode.SUCCESS;
    },
};
