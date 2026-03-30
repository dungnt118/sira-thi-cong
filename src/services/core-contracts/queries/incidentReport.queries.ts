import { gql } from 'graphql-tag';

/**
 * Find IncidentReport DTO with typed data
 */
export const FIND_INCIDENTREPORT_DTO = gql`
  query FindIncidentReportDto($_id: String!, $custominput: Dictionary) {
    response: find_IncidentReport_dto(_id: $_id, custominput: $custominput) {
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
        journey_id
        journey_step_code
        type
        description
        severity
        reported_by
        images
        pm_reply
        is_resolved
        resolved_at
        project_id
        idx_project_id
        project_id
        title
        priority
        status
        assigned_to
      }
    }
  }
`;

/**
 * Query IncidentReports DTO list
 */
export const QUERY_INCIDENTREPORTS_DTO = gql`
  query QueryIncidentReportsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_IncidentReports_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        type
        description
        severity
        reported_by
        images
        pm_reply
        is_resolved
        resolved_at
        project_id
        idx_project_id
        project_id
        title
        priority
        status
        assigned_to
      }
    }
  }
`;
