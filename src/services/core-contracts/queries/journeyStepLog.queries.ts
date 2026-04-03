import { gql } from 'graphql-tag';

/**
 * Find JourneyStepLog DTO with typed data
 */
export const FIND_JOURNEYSTEPLOG_DTO = gql`
  query FindJourneyStepLogDto($_id: String!, $custominput: Dictionary) {
    response: find_JourneyStepLog_dto(_id: $_id, custominput: $custominput) {
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
        step_code
        event_type
        event_time
        from_step_code
        to_step_code
        start_time
        end_time
        duration_minutes
        sla_hours_snapshot
        sla_status
        actor_user
        trigger_source
        worktask_id
        idx_worktask_id
        activity_event_id
        idx_activity_event_id
        note
        metadata {
          previous_status
          new_status
          breach_reason
          comment
        }
      }
    }
  }
`;

/**
 * Query JourneyStepLogs DTO list
 */
export const QUERY_JOURNEYSTEPLOGS_DTO = gql`
  query QueryJourneyStepLogsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_JourneyStepLogs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        step_code
        event_type
        event_time
        from_step_code
        to_step_code
        start_time
        end_time
        duration_minutes
        sla_hours_snapshot
        sla_status
        actor_user
        trigger_source
        worktask_id
        idx_worktask_id
        activity_event_id
        idx_activity_event_id
        note
        metadata {
          previous_status
          new_status
          breach_reason
          comment
        }
      }
    }
  }
`;
