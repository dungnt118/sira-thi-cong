import { gql } from 'graphql-tag';

/**
 * Find Worker DTO with typed data
 */
export const FIND_WORKER_DTO = gql`
  query FindWorkerDto($_id: String!, $custominput: Dictionary) {
    response: find_Worker_dto(_id: $_id, custominput: $custominput) {
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
        workerType
        employeeId
        idx_employeeId
        gender
        dob
        phone
        email
        status
        position
        priceConfigId
        idx_priceConfigId
        teamId
        idx_teamId
        rating
        skills
        city
        district
        ward
        address
        lat
        lng
        attachments
        note
        costPerDay
      }
    }
  }
`;

/**
 * Query Workers DTO list
 */
export const QUERY_WORKERS_DTO = gql`
  query QueryWorkersDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Workers_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        workerType
        employeeId
        idx_employeeId
        gender
        dob
        phone
        email
        status
        position
        priceConfigId
        idx_priceConfigId
        teamId
        idx_teamId
        rating
        skills
        city
        district
        ward
        address
        lat
        lng
        attachments
        note
        costPerDay
      }
    }
  }
`;
