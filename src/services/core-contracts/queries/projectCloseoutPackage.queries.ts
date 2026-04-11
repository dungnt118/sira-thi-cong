import { gql } from 'graphql-tag';

/**
 * Find ProjectCloseoutPackage DTO with typed data
 */
export const FIND_PROJECTCLOSEOUTPACKAGE_DTO = gql`
  query FindProjectCloseoutPackageDto($_id: String!, $custominput: Dictionary) {
    response: find_ProjectCloseoutPackage_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        closeout_date
        status
        journey_id
        idx_journey_id
        journey_step_code
        project_settlement_id
        idx_project_settlement_id
        customer_id
        idx_customer_id
        portal_thread_id
        idx_portal_thread_id
        published_at
        customer_confirmed_at
        closed_at
        published_document_ids
        idx_published_document_ids
        summary
        closing_note
        reopen_reason
      }
    }
  }
`;

/**
 * Query ProjectCloseoutPackages DTO list
 */
export const QUERY_PROJECTCLOSEOUTPACKAGES_DTO = gql`
  query QueryProjectCloseoutPackagesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ProjectCloseoutPackages_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        closeout_date
        status
        journey_id
        idx_journey_id
        journey_step_code
        project_settlement_id
        idx_project_settlement_id
        customer_id
        idx_customer_id
        portal_thread_id
        idx_portal_thread_id
        published_at
        customer_confirmed_at
        closed_at
        published_document_ids
        idx_published_document_ids
        summary
        closing_note
        reopen_reason
      }
    }
  }
`;
