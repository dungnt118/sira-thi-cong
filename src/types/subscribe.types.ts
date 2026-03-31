/**
 * Subscribe Events Type Definitions
 * Shared interfaces for call events, chat events, and notification messages
 */

// ===== CALL EVENT TYPES =====
export interface CallEventData {
    phoneNumber: string;
    direction: 'inbound' | 'outbound';
    status?: string;
    duration?: number;
    timestamp?: string;
    [key: string]: any; // Allow additional properties
}

export interface CallEventsState {
    event: CallEventData | null;
    selectedCall: CallEventData | null;
    calls: CallEventData[];
}

// ===== CHAT EVENT TYPES =====
export interface ChatContact {
    id: string;
    name?: string;
    avatar?: string;
    lastMessage?: string;
    timestamp?: string;
    unreadCount?: number;
    [key: string]: any; // Allow additional properties
}

export interface ChatEventsState {
    chattingContacts: ChatContact[];
}


export interface NotifyMessageAction {
    label?: string; // Alias cho name
}

export interface NotificationMessage {
    data: any;
    at: string;
    subject: string;
    body: string;
    sender: string;
    messageType: string;
    registationCode: string;
    receiver: string;
    type: string; // 'error' | 'success' | 'info' | 'CHATNOTIFICATION'
    placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    actions?: NotifyMessageAction[];
}

// Federate subscription response type (from GraphQL)
export interface FederateNotificationResponse {
    data?: any;
    at?: string;
    subject?: string;
    body?: string;
    sender?: string;
    messageType?: string;
    registationCode?: string;
    receiver?: string;
    actions?: any;
    type?: string;
}

export interface NotifyEventsState {
    message: NotificationMessage | null;
}

// ===== COMBINED SUBSCRIBE STATE =====
export interface SubscribeState {
    call: CallEventsState;
    notify: NotifyEventsState;
    chat?: ChatEventsState;
}
