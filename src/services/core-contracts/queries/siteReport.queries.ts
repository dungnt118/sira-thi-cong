import { gql } from 'graphql-tag';

/**
 * Find SiteReport DTO with typed data
 */
export const FIND_SITEREPORT_DTO = gql`
  query FindSiteReportDto($_id: String!, $custominput: Dictionary) {
    response: find_SiteReport_dto(_id: $_id, custominput: $custominput) {
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
        project_id
        idx_project_id
        project_id
        report_date
        supervisor_user
        title
        content
        progress_pct
        images
        weather_note
        issue_summary
        next_action
      }
    }
  }
`;

/**
 * Query SiteReports DTO list
 */
export const QUERY_SITEREPORTS_DTO = gql`
  query QuerySiteReportsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_SiteReports_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        project_id
        idx_project_id
        project_id
        report_date
        supervisor_user
        title
        content
        progress_pct
        images
        weather_note
        issue_summary
        next_action
      }
    }
  }
`;
