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
        worktaskId
        idx_worktaskId
        worktaskId
        journey_step_code
        title
        content
        progress_pct
        medias
        issue_summary
        next_action
        createdAt
        createdBy
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
        worktaskId
        idx_worktaskId
        worktaskId
        journey_step_code
        title
        content
        progress_pct
        medias
        issue_summary
        next_action
        createdAt
        createdBy
      }
    }
  }
`;
