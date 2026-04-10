export interface NotificationAction {
    actionId: string;
    label: string;
    icon?: string;
    type: string; // OpenUrl | DeepLink | CallApi | Dismiss
    url?: string;
    deepLink?: string;
    apiEndpoint?: string;
    payload?: unknown;
}

export interface NotificationTemplateData {
    __fullContent?: string;
    [key: string]: unknown;
}

export interface NotificationCustomData {
    __fullContent?: string;
    fullContent?: string;
    templateData?: NotificationTemplateData;
    [key: string]: unknown;
}

export interface UserNotificationItem {
    _id: string;
    subject: string;
    body: string;
    imageUrl?: string;
    deepLink?: string;
    categoryId?: string;
    priority: number;
    workflowKey?: string;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
    actions?: NotificationAction[];
    customData?: NotificationCustomData;
    templateData?: NotificationTemplateData;
}

export interface NotificationCategorySummary {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    total: number;
    unread: number;
}

export interface NotificationSummary {
    total: number;
    unread: number;
    categories: NotificationCategorySummary[];
}
