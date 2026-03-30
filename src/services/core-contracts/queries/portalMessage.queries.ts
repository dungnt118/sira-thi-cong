import { gql } from 'graphql-tag';

/**
 * Find PortalMessage DTO with typed data
 */
export const FIND_PORTALMESSAGE_DTO = gql`
  query FindPortalMessageDto($_id: String!, $custominput: Dictionary) {
    response: find_PortalMessage_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        thread_id
        idx_thread_id
        thread_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        sender
        sender_role
        message_body
        attachments
        official_response
        sent_at
      }
    }
  }
`;

/**
 * Query PortalMessages DTO list
 */
export const QUERY_PORTALMESSAGES_DTO = gql`
  query QueryPortalMessagesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PortalMessages_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        thread_id
        idx_thread_id
        thread_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        sender
        sender_role
        message_body
        attachments
        official_response
        sent_at
      }
    }
  }
`;
