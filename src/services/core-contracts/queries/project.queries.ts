import { gql } from 'graphql-tag';

/**
 * Find Project DTO with typed data
 */
export const FIND_PROJECT_DTO = gql`
  query FindProjectDto($_id: String!, $custominput: Dictionary) {
    response: find_Project_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        name
        service_request_id
        idx_service_request_id
        service_request_id
        journey_id
        idx_journey_id
        journey_id
        contract_id
        idx_contract_id
        contract_id
        customer_id
        idx_customer_id
        customer_id
        site_address
        pm_user
        supervisor_user
        status
        planned_start_date
        planned_end_date
        note
        latest_project_settlement_id
        idx_latest_project_settlement_id
        latest_project_settlement_id
        latest_closeout_package_id
        idx_latest_closeout_package_id
        latest_closeout_package_id
      }
    }
  }
`;

/**
 * Query Projects DTO list
 */
export const QUERY_PROJECTS_DTO = gql`
  query QueryProjectsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Projects_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        service_request_id
        idx_service_request_id
        service_request_id
        journey_id
        idx_journey_id
        journey_id
        contract_id
        idx_contract_id
        contract_id
        customer_id
        idx_customer_id
        customer_id
        site_address
        pm_user
        supervisor_user
        status
        planned_start_date
        planned_end_date
        note
        latest_project_settlement_id
        idx_latest_project_settlement_id
        latest_project_settlement_id
        latest_closeout_package_id
        idx_latest_closeout_package_id
        latest_closeout_package_id
      }
    }
  }
`;
