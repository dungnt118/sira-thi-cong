import { gql } from 'graphql-tag';

/**
 * Find LeaveRequest DTO with typed data
 */
export const FIND_LEAVEREQUEST_DTO = gql`
  query FindLeaveRequestDto($_id: String!, $custominput: Dictionary) {
    response: find_LeaveRequest_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        employeeId
        leaveTypeId
        fromDate
        toDate
        totalDays
        reason
        status
        attachments
        dayRequests {
          workDate
          requestedScope
          countedDays
        }
        approverId
        approvalDate {
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
        rejectionReason
        name
      }
    }
  }
`;

/**
 * Query LeaveRequests DTO list
 */
export const QUERY_LEAVEREQUESTS_DTO = gql`
  query QueryLeaveRequestsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_LeaveRequests_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        employeeId
        leaveTypeId
        fromDate
        toDate
        totalDays
        reason
        status
        attachments
        dayRequests {
          workDate
          requestedScope
          countedDays
        }
        approverId
        approvalDate {
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
        rejectionReason
        name
      }
    }
  }
`;
