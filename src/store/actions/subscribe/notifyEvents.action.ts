import { NotificationMessage } from 'types/subscribe.types';

export const SET_NOTIFY_MESSAGE = '[NOTIFY EVENT] SET MESSAGE';

interface SetNotifyMessageAction {
    type: typeof SET_NOTIFY_MESSAGE;
    data: NotificationMessage | null;
}

export type NotifyEventsActionTypes = SetNotifyMessageAction;

export function add_notify_message(message: NotificationMessage | null): SetNotifyMessageAction {
    return {
        type: SET_NOTIFY_MESSAGE,
        data: message
    };
}
