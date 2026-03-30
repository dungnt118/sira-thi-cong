import { gql } from 'graphql-tag';

/**
 * Find ServiceRequest DTO with typed data
 */
export const FIND_SERVICEREQUEST_DTO = gql`
  query FindServiceRequestDto($_id: String!, $custominput: Dictionary) {
    response: find_ServiceRequest_dto(_id: $_id, custominput: $custominput) {
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
        customer_id
        idx_customer_id
        customer_id
        customer_name
        contact_phone
        contact_email
        site_address
        requested_service
        pipeline_id
        idx_pipeline_id
        pipeline_id
        stage_id
        idx_stage_id
        stage_id
        status
        assigned_pm_id
        duplicate_customer_id
        idx_duplicate_customer_id
        duplicate_customer_id
        notes
        journey_id
        idx_journey_id
        journey_id
      }
    }
  }
`;

/**
 * Query ServiceRequests DTO list
 */
export const QUERY_SERVICEREQUESTS_DTO = gql`
  query QueryServiceRequestsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ServiceRequests_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        customer_id
        idx_customer_id
        customer_id
        customer_name
        contact_phone
        contact_email
        site_address
        requested_service
        pipeline_id
        idx_pipeline_id
        pipeline_id
        stage_id
        idx_stage_id
        stage_id
        status
        assigned_pm_id
        duplicate_customer_id
        idx_duplicate_customer_id
        duplicate_customer_id
        notes
        journey_id
        idx_journey_id
        journey_id
      }
    }
  }
`;
