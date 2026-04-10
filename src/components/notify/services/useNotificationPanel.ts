import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { notificationService } from './notification.service';
import { NotificationSummary, UserNotificationItem } from '../types/notification.types';
import { RootState } from 'app/store';

export function useNotificationPanel(isPanelOpen: boolean) {
    const [tab, setTab] = useState<'all' | 'unread' | 'read'>('all');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const LIMIT = 20;

    const [unreadCount, setUnreadCount] = useState(0);
    const [summary, setSummary] = useState<NotificationSummary | null>(null);
    const [notifications, setNotifications] = useState<UserNotificationItem[]>([]);
    const [records, setRecords] = useState(0);
    const [loading, setLoading] = useState(false);

    const user = useSelector((state: RootState) => state.auth?.user);
    const isLoginPage = typeof window !== 'undefined' && window.location?.pathname?.includes('/login');
    const hasUser = !!(user && user.data);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        if (!hasUser || isLoginPage) return;
        const res = await notificationService.getMyUnreadCount();
        if (res && typeof res.data === 'number') {
            setUnreadCount(res.data);
        }
    }, [hasUser, isLoginPage]);

    // Polling unread count every 60s
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    // Fetch Summary when panel opens
    const fetchSummary = useCallback(async () => {
        if (!hasUser || isLoginPage || !isPanelOpen) return;
        const res = await notificationService.getMyNotificationSummary();
        if (res && res.data) {
            setSummary(res.data);
        }
    }, [hasUser, isLoginPage, isPanelOpen]);

    useEffect(() => {
        if (isPanelOpen) {
            fetchSummary();
        }
    }, [isPanelOpen, fetchSummary]);

    // Fetch Notifications list
    const fetchNotifications = useCallback(async () => {
        if (!hasUser || isLoginPage || !isPanelOpen) return;
        setLoading(true);
        const isRead = tab === 'all' ? undefined : (tab === 'read' ? true : false);
        const res = await notificationService.getMyNotifications({
            isRead,
            categoryId: categoryId || undefined,
            keyword: keyword || undefined,
            skip: (page - 1) * LIMIT,
            limit: LIMIT
        });
        if (res && res.data) {
            setNotifications(res.data);
            setRecords(res.records || 0);
        } else {
            setNotifications([]);
            setRecords(0);
        }
        setLoading(false);
    }, [hasUser, isLoginPage, isPanelOpen, tab, categoryId, keyword, page]);

    useEffect(() => {
        if (isPanelOpen) {
            fetchNotifications();
        }
    }, [fetchNotifications, isPanelOpen]);

    // Handlers
    const handleMarkRead = async (id: string) => {
        await notificationService.markNotificationRead(id);
        // Refresh silently
        fetchUnreadCount();
        fetchSummary();

        // Optimistic update for notifications list
        setNotifications(prev => prev.map(item => item._id === id ? { ...item, isRead: true } : item));
    };

    const handleMarkAllRead = async () => {
        await notificationService.markAllNotificationsRead(categoryId || undefined);
        fetchUnreadCount();
        fetchSummary();
        fetchNotifications();
    };

    return {
        unreadCount,
        setUnreadCount,
        summary,
        notifications,
        records,
        totalPages: Math.ceil(records / LIMIT),
        tab, setTab,
        categoryId, setCategoryId,
        keyword, setKeyword,
        page, setPage,
        loading,
        handleMarkRead,
        handleMarkAllRead,
        fetchUnreadCount,
        fetchNotifications
    };
}
