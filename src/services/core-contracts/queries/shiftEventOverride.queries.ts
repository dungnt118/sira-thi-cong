import { gql } from 'graphql-tag';

/**
 * Find ShiftEventOverride DTO with typed data
 */
export const FIND_SHIFTEVENTOVERRIDE_DTO = gql`
  query FindShiftEventOverrideDto($_id: String!, $custominput: Dictionary) {
    response: find_ShiftEventOverride_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        employeeId
        date
        overrideType
        shiftCode
        reason
        name
      }
    }
  }
`;

/**
 * Query ShiftEventOverrides DTO list
 */
export const QUERY_SHIFTEVENTOVERRIDES_DTO = gql`
  query QueryShiftEventOverridesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ShiftEventOverrides_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        employeeId
        date
        overrideType
        shiftCode
        reason
        name
      }
    }
  }
`;
