import { gql } from 'graphql-tag';

/**
 * Find LeaveBalance DTO with typed data
 */
export const FIND_LEAVEBALANCE_DTO = gql`
  query FindLeaveBalanceDto($_id: String!, $custominput: Dictionary) {
    response: find_LeaveBalance_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        employeeId
        year
        balances {
          leaveTypeId
          leaveTypeName
          totalEntitlement
          used
          pending
          remaining
        }
        name
      }
    }
  }
`;

/**
 * Query LeaveBalances DTO list
 */
export const QUERY_LEAVEBALANCES_DTO = gql`
  query QueryLeaveBalancesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_LeaveBalances_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        employeeId
        year
        balances {
          leaveTypeId
          leaveTypeName
          totalEntitlement
          used
          pending
          remaining
        }
        name
      }
    }
  }
`;
