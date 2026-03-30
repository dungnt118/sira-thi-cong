import { gql } from 'graphql-tag';

/**
 * Find LeaveType DTO with typed data
 */
export const FIND_LEAVETYPE_DTO = gql`
  query FindLeaveTypeDto($_id: String!, $custominput: Dictionary) {
    response: find_LeaveType_dto(_id: $_id, custominput: $custominput) {
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
        description
        isPaid
        requiresApproval
        maxDaysPerYear
        isActive
      }
    }
  }
`;

/**
 * Query LeaveTypes DTO list
 */
export const QUERY_LEAVETYPES_DTO = gql`
  query QueryLeaveTypesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_LeaveTypes_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        description
        isPaid
        requiresApproval
        maxDaysPerYear
        isActive
      }
    }
  }
`;
