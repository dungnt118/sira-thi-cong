/**
 * Authorized User API Service
 * Handles interactions with AuthorizedUsers and IdentityContexts
 */

import { mutate, query, queryList } from 'app/services/graphqlService';
import { ApiResponseCode } from 'types/apis/ApiResponse';
import {
    ADD_IDENTITY_CONTEXT,
    CREATE_AUTHORIZED_USER,
    DEACTIVATE_AUTHORIZED_USER,
    DELETE_AUTHORIZED_USER,
    GET_AUTHORIZED_USER,
    SEARCH_AUTHORIZED_USERS,
    UPDATE_IDENTITY_CONTEXT
} from './authorizedusers.graphql';
import type { AuthorizedUser, IdentityContext } from './authorizedusers.types';

export interface ISearchAuthorizedUsersFilter {
    keyword?: string;
    isActive?: boolean | null;
    globalUserId?: string;
    clientId?: string;
    page?: number;
    pageSize?: number;
}

export interface IAuthorizedUserListResponse {
    success: boolean;
    data: AuthorizedUser[];
    total: number;
    page: number;
    pages: number;
}

export const authorizedUserService = {
    /**
     * Search authorized users with filters
     */
    async searchUsers(filter: ISearchAuthorizedUsersFilter): Promise<IAuthorizedUserListResponse> {
        const response = await queryList<AuthorizedUser>(SEARCH_AUTHORIZED_USERS, {
            keyword: filter.keyword,
            isActive: filter.isActive,
            globalUserId: filter.globalUserId,
            clientId: filter.clientId,
            page: filter.page || 1,
            pageSize: filter.pageSize || 20,
        });

        return {
            success: response.code === ApiResponseCode.SUCCESS,
            data: response.data ?? [],
            total: response.records ?? 0,
            page: response.page ?? 1,
            pages: response.pages ?? 1,
        };
    },

    /**
     * Get authorized user detail
     */
    async getUserDetail(userId: string): Promise<AuthorizedUser | null> {
        const response = await query<AuthorizedUser>(GET_AUTHORIZED_USER, { userId });
        return response.data ?? null;
    },

    /**
     * Create / Assign authorized user (from GlobalUser)
     */
    async createAuthorizedUser(payload: {
        globalUserId: string;
        clientId: string;
        roles: string[];
        role?: string;
    }): Promise<AuthorizedUser | null> {
        const response = await mutate<AuthorizedUser>(CREATE_AUTHORIZED_USER, payload);
        return response.data ?? null;
    },

    /**
     * Add or Update Identity Context (Assign roles for a client)
     */
    async updateIdentityContext(payload: {
        userId: string;
        clientId: string;
        roles: string[];
        defaultRole?: string;
    }): Promise<boolean> {
        const response = await mutate<unknown>(UPDATE_IDENTITY_CONTEXT, payload);
        
        // If update fails, try add (standard behavior for some backends)
        if (response.code !== ApiResponseCode.SUCCESS) {
            const addResponse = await mutate<unknown>(ADD_IDENTITY_CONTEXT, payload);
            return addResponse.code === ApiResponseCode.SUCCESS;
        }

        return response.code === ApiResponseCode.SUCCESS;
    },

    /**
     * Deactivate authorized user
     */
    async deactivateUser(userId: string): Promise<boolean> {
        const response = await mutate<unknown>(DEACTIVATE_AUTHORIZED_USER, { userId });
        return response.code === ApiResponseCode.SUCCESS;
    },

    /**
     * Delete authorized user
     */
    async deleteUser(userId: string): Promise<boolean> {
        const response = await mutate<unknown>(DELETE_AUTHORIZED_USER, { userId });
        if (response.code !== ApiResponseCode.SUCCESS) {
            throw new Error(response.message || 'Không thể xóa AuthorizedUser.');
        }
        return response.code === ApiResponseCode.SUCCESS;
    },
};
