import { gql } from 'graphql-tag';

/**
 * Find TenantMembership DTO with typed data
 */
export const FIND_TENANTMEMBERSHIP_DTO = gql`
  query FindTenantMembershipDto($_id: String!, $custominput: Dictionary) {
    response: find_TenantMembership_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        globalUserId
        regCode
        tenantId
        isActive
        role
        username
        joinedAt
        expiresAt {
          Date
          Day
          DayOfWeek
          DayOfYear
          Hour
          Kind
          Millisecond
          Microsecond
          Nanosecond
          Minute
          Month
          Second
          Ticks
          TimeOfDay {
            Ticks
            Days
            Hours
            Milliseconds
            Microseconds
            Nanoseconds
            Minutes
            Seconds
            TotalDays
            TotalHours
            TotalMilliseconds
            TotalMicroseconds
            TotalNanoseconds
            TotalMinutes
            TotalSeconds
          }
          Year
        }
        addedBy
        metadata
      }
    }
  }
`;

/**
 * Query TenantMemberships DTO list
 */
export const QUERY_TENANTMEMBERSHIPS_DTO = gql`
  query QueryTenantMembershipsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_TenantMemberships_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        globalUserId
        regCode
        tenantId
        isActive
        role
        username
        joinedAt
        expiresAt {
          Date
          Day
          DayOfWeek
          DayOfYear
          Hour
          Kind
          Millisecond
          Microsecond
          Nanosecond
          Minute
          Month
          Second
          Ticks
          TimeOfDay {
            Ticks
            Days
            Hours
            Milliseconds
            Microseconds
            Nanoseconds
            Minutes
            Seconds
            TotalDays
            TotalHours
            TotalMilliseconds
            TotalMicroseconds
            TotalNanoseconds
            TotalMinutes
            TotalSeconds
          }
          Year
        }
        addedBy
        metadata
      }
    }
  }
`;
