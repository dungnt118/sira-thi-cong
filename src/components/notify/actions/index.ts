import * as graphqlService from 'app/services/graphqlService';
import {
    GET_MY_TOTAL_UNREAD_NOTIFY,
    GET_MY_UNREAD_NOTIFY_STATE,
    LOAD_MY_NOTIFY_BY_TYPE,
    UPDATE_READ_STATUS,
} from './query';

// NOTE: We use `any` for dispatch to avoid coupling to Redux types in this module.
export function get_unread_notify_state(dispatch: any) {
    return graphqlService.mutate(GET_MY_UNREAD_NOTIFY_STATE, {}, dispatch);
}

export function get_total_unread_notify_state(dispatch: any) {
    return graphqlService.mutate(GET_MY_TOTAL_UNREAD_NOTIFY, {}, dispatch);
}

export function update_read_status(_id: string, dispatch: any) {
    return graphqlService.mutate(UPDATE_READ_STATUS, { _id }, dispatch);
}

export function load_my_notify_by_type(
    params: { typeId: string; skip: number; limit: number },
    dispatch: any,
) {
    const { typeId, skip, limit } = params;
    return graphqlService.mutate(LOAD_MY_NOTIFY_BY_TYPE, { typeId, skip, limit }, dispatch);
}