import { gql } from 'graphql-tag';

/**
 * Find SurveyAppointment DTO with typed data
 */
export const FIND_SURVEYAPPOINTMENT_DTO = gql`
  query FindSurveyAppointmentDto($_id: String!, $custominput: Dictionary) {
    response: find_SurveyAppointment_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        journey_id
        idx_journey_id
        journey_step_code
        customer_id
        idx_customer_id
        scheduled_at
        appointment_status
        assigned_user
        confirmed_by_customer
        confirmed_at
        reschedule_reason
        note
      }
    }
  }
`;

/**
 * Query SurveyAppointments DTO list
 */
export const QUERY_SURVEYAPPOINTMENTS_DTO = gql`
  query QuerySurveyAppointmentsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_SurveyAppointments_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        journey_id
        idx_journey_id
        journey_step_code
        customer_id
        idx_customer_id
        scheduled_at
        appointment_status
        assigned_user
        confirmed_by_customer
        confirmed_at
        reschedule_reason
        note
      }
    }
  }
`;
