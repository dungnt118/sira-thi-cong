import { gql } from 'graphql-tag';

/**
 * Find AttendanceException DTO with typed data
 */
export const FIND_ATTENDANCEEXCEPTION_DTO = gql`
  query FindAttendanceExceptionDto($_id: String!, $custominput: Dictionary) {
    response: find_AttendanceException_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        employeeId
        workDate
        type
        severity
        status
        message
        note
        reasonCode
        resolvedBy
        resolvedAt {
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
        name
      }
    }
  }
`;

/**
 * Query AttendanceExceptions DTO list
 */
export const QUERY_ATTENDANCEEXCEPTIONS_DTO = gql`
  query QueryAttendanceExceptionsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AttendanceExceptions_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        employeeId
        workDate
        type
        severity
        status
        message
        note
        reasonCode
        resolvedBy
        resolvedAt {
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
        name
      }
    }
  }
`;
