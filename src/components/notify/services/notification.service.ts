import { query, queryList, mutate } from 'app/services/graphqlService';
import {
    GET_MY_UNREAD_COUNT,
    GET_MY_NOTIFICATION_SUMMARY,
    GET_MY_NOTIFICATIONS,
    MARK_NOTIFICATION_READ,
    MARK_ALL_NOTIFICATIONS_READ,
    DELETE_MY_NOTIFICATION,
    DELETE_ALL_MY_NOTIFICATIONS
} from './notification.queries';
import { NotificationSummary, UserNotificationItem } from '../types/notification.types';

export const notificationService = {
    getMyUnreadCount: async () => {
        return query<number>(GET_MY_UNREAD_COUNT);
    },

    getMyNotificationSummary: async () => {
        return query<NotificationSummary>(GET_MY_NOTIFICATION_SUMMARY);
    },

    getMyNotifications: async (params: {
        isRead?: boolean;
        categoryId?: string;
        keyword?: string;
        skip?: number;
        limit?: number;
    }) => {
        return queryList<UserNotificationItem>(GET_MY_NOTIFICATIONS, params);
    },

    markNotificationRead: async (id: string) => {
        return mutate<UserNotificationItem>(MARK_NOTIFICATION_READ, { id });
    },

    markAllNotificationsRead: async (categoryId?: string) => {
        return mutate<number>(MARK_ALL_NOTIFICATIONS_READ, { categoryId });
    },

    deleteMyNotification: async (id: string) => {
        return mutate<boolean>(DELETE_MY_NOTIFICATION, { id });
    },

    deleteAllMyNotifications: async (categoryId?: string) => {
        return mutate<number>(DELETE_ALL_MY_NOTIFICATIONS, { categoryId });
    }
};
