import { gql } from '@apollo/client';

export const GET_CB_THREAD_HIERARCHY = gql`
  query GetCbThreadHierarchy(
    $schemaName: String!
    $contentId: String!
    $includeExternal: Boolean
  ) {
    response: get_cb_thread_hierarchy(
      schemaName: $schemaName
      contentId: $contentId
      includeExternal: $includeExternal
    ) {
      code
      message
      data
    }
  }
`;

export const QUERY_CB_BY_THREAD = gql`
  query QueryCbByThread(
    $thread_id: String!
    $key: String
    $createdBy: String
    $skip: Int
    $limit: Int
    $message_type: ChatboxMessageType
    $change_type: SystemChangeType
    $from: DateTime
    $to: DateTime
  ) {
    response: query_cb_by_thread(
      thread_id: $thread_id
      key: $key
      createdBy: $createdBy
      skip: $skip
      limit: $limit
      message_type: $message_type
      change_type: $change_type
      from: $from
      to: $to
    ) {
      code
      message
      records
      data
    }
  }
`;

export const SEND_CB_MESSAGE = gql`
  mutation SendCbMessage(
    $threadId: String!
    $content: String!
    $messageType: ChatboxMessageType!
    $payload: MessagePayloadInput
  ) {
    response: send_cb_message(
      threadId: $threadId
      content: $content
      messageType: $messageType
      payload: $payload
    ) {
      code
      message
      data
    }
  }
`;

export const CREATE_CB_SUB_THREAD = gql`
  mutation CreateCbSubThread($parentThreadId: String!, $input: CreateSubThreadInputInput!) {
    response: create_cb_sub_thread(parentThreadId: $parentThreadId, input: $input) {
      code
      message
      data
    }
  }
`;

export const INVITE_CB_THREAD_USERS = gql`
  mutation InviteCbThreadUsers($threadId: String!, $usernames: [String]!) {
    response: invite_cb_thread_users(threadId: $threadId, usernames: $usernames) {
      code
      message
      data
    }
  }
`;
