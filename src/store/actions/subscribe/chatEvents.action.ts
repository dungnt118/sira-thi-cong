import { ChatContact } from 'types/subscribe.types';

export const SET_CHATTING_CONTACTS = '[CHAT EVENT] SET CHATTING CONTACT';

interface SetChattingContactsAction {
    type: typeof SET_CHATTING_CONTACTS;
    data: ChatContact[];
}

export type ChatEventsActionTypes = SetChattingContactsAction;

export function setChattingContacts(data: ChatContact[]): SetChattingContactsAction {
    console.log("===> chat handle data: ", data);
    return {
        type: SET_CHATTING_CONTACTS,
        data: data
    };
}
