import { gql } from 'graphql-tag';

/**
 * Find SurveyRecord DTO with typed data
 */
export const FIND_SURVEYRECORD_DTO = gql`
  query FindSurveyRecordDto($_id: String!, $custominput: Dictionary) {
    response: find_SurveyRecord_dto(_id: $_id, custominput: $custominput) {
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
        appointment_id
        idx_appointment_id
        worktaskId
        idx_worktaskId
        scheduled_date
        survey_date
        survey_status
        surveyor_name
        customer_name
        site_address
        contact_name
        contact_phone
        condition_items {
          area_name
          condition_note
          measurement_note
          risk_note
        }
        proposed_items {
          item_name
          scope_note
          quantity_note
          technical_note
        }
        proposed_solution
        labor_need_note
        material_need_note
        review_status
        media_files
      }
    }
  }
`;

/**
 * Query SurveyRecords DTO list
 */
export const QUERY_SURVEYRECORDS_DTO = gql`
  query QuerySurveyRecordsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_SurveyRecords_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        journey_step_code
        appointment_id
        idx_appointment_id
        worktaskId
        idx_worktaskId
        scheduled_date
        survey_date
        survey_status
        surveyor_name
        customer_name
        site_address
        contact_name
        contact_phone
        condition_items {
          area_name
          condition_note
          measurement_note
          risk_note
        }
        proposed_items {
          item_name
          scope_note
          quantity_note
          technical_note
        }
        proposed_solution
        labor_need_note
        material_need_note
        review_status
        media_files
      }
    }
  }
`;
