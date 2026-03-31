import { gql } from 'graphql-tag';

/**
 * Find WarrantyReminder DTO with typed data
 */
export const FIND_WARRANTYREMINDER_DTO = gql`
  query FindWarrantyReminderDto($_id: String!, $custominput: Dictionary) {
    response: find_WarrantyReminder_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        warranty_card_id
        idx_warranty_card_id
        warranty_card_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_name
        customer_name
        customer_phone
        channel
        scheduled_at
        sent_at
        status
        message
        journey_name
      }
    }
  }
`;

/**
 * Query WarrantyReminders DTO list
 */
export const QUERY_WARRANTYREMINDERS_DTO = gql`
  query QueryWarrantyRemindersDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WarrantyReminders_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        warranty_card_id
        idx_warranty_card_id
        warranty_card_id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_name
        customer_name
        customer_phone
        channel
        scheduled_at
        sent_at
        status
        message
        journey_name
      }
    }
  }
`;
