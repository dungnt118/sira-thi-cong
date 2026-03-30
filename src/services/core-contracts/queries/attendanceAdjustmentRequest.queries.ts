import { gql } from 'graphql-tag';

/**
 * Find AttendanceAdjustmentRequest DTO with typed data
 */
export const FIND_ATTENDANCEADJUSTMENTREQUEST_DTO = gql`
  query FindAttendanceAdjustmentRequestDto($_id: String!, $custominput: Dictionary) {
    response: find_AttendanceAdjustmentRequest_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        attendanceId
        employeeId
        issueType
        reason
        status
        approvedBy
        approvedAt {
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
        approvalNote
        name
      }
    }
  }
`;

/**
 * Query AttendanceAdjustmentRequests DTO list
 */
export const QUERY_ATTENDANCEADJUSTMENTREQUESTS_DTO = gql`
  query QueryAttendanceAdjustmentRequestsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AttendanceAdjustmentRequests_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        attendanceId
        employeeId
        issueType
        reason
        status
        approvedBy
        approvedAt {
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
        approvalNote
        name
      }
    }
  }
`;
