import { CallEventData } from 'types/subscribe.types';

export const SET_CALLEVENT_DATA = '[CALL EVENT] SET CALL EVENT DATA';
export const SET_SELECTED_CALL = '[CALL EVENT] SET SELECTED CALL';

interface SetCallEventDataAction {
    type: typeof SET_CALLEVENT_DATA;
    data: CallEventData;
}

interface SetSelectedCallAction {
    type: typeof SET_SELECTED_CALL;
    data: CallEventData | null;
}

export type CallEventsActionTypes = SetCallEventDataAction | SetSelectedCallAction;

export function setCallEventData(data: CallEventData): SetCallEventDataAction {
    return {
        type: SET_CALLEVENT_DATA,
        data: data
    };
}

export function setSelectedCall(data: CallEventData | null): SetSelectedCallAction {
    return {
        type: SET_SELECTED_CALL,
        data: data
    };
}
