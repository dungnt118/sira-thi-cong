import { gql } from 'graphql-tag';

/**
 * Find WorkTask DTO with typed data
 */
export const FIND_WORKTASK_DTO = gql`
  query FindWorkTaskDto($_id: String!, $custominput: Dictionary) {
    response: find_WorkTask_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        journey_id
        idx_journey_id
        journey_step_code
        title
        description
        is_required
        sla_hours
        start_time
        due_time
        finish_time
        status
        verified
        verified_by
        verified_time
        note
        assignee_role
        documentId
        idx_documentId
        assignee
        actions {
          action_key
          action_type
          target_field
          expected_value
          doc_type
          min_count
          note
        }
        min_photos
        review_status
      }
    }
  }
`;

/**
 * Query WorkTasks DTO list
 */
export const QUERY_WORKTASKS_DTO = gql`
  query QueryWorkTasksDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WorkTasks_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        journey_step_code
        title
        description
        is_required
        sla_hours
        start_time
        due_time
        finish_time
        status
        verified
        verified_by
        verified_time
        note
        assignee_role
        documentId
        idx_documentId
        assignee
        actions {
          action_key
          action_type
          target_field
          expected_value
          doc_type
          min_count
          note
        }
        min_photos
        review_status
      }
    }
  }
`;
