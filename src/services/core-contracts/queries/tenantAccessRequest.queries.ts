import { gql } from 'graphql-tag';

/**
 * Find TenantAccessRequest DTO with typed data
 */
export const FIND_TENANTACCESSREQUEST_DTO = gql`
  query FindTenantAccessRequestDto($_id: String!, $custominput: Dictionary) {
    response: find_TenantAccessRequest_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        globalUserId
        requester {
          username
          fullName
          email
          phone
        }
        regCode
        clientId
        message
        metadata
        status
        currentReviewStep
        resolvedReviewChain {
          stepIndex
          label
          reviewerType
          approvalMode
          resolvedReviewers {
            Username
            DisplayName
            Decision
            DecidedAt {
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
          }
          stepStatus
          skipReason
        }
        reviewHistory {
          stepIndex
          stepLabel
          reviewerType
          reviewerUsername
          reviewerDisplayName
          action
          comment
          actionAt
        }
        reviewedBy
        reviewerName
        reviewedAt {
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
        rejectReason
        assignedRoles
        membershipId
        provisionedAt {
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
        provisionError
        provisionResult {
          strategy
          authorizedUserId
          subjectId
          subjectSchema
          subjectAction
          scriptKey
          scriptParams
          pipelineKey
          pipelineAffectedDocuments {
            schema
            documentId
            action
          }
        }
      }
    }
  }
`;

/**
 * Query TenantAccessRequests DTO list
 */
export const QUERY_TENANTACCESSREQUESTS_DTO = gql`
  query QueryTenantAccessRequestsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_TenantAccessRequests_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        globalUserId
        requester {
          username
          fullName
          email
          phone
        }
        regCode
        clientId
        message
        metadata
        status
        currentReviewStep
        resolvedReviewChain {
          stepIndex
          label
          reviewerType
          approvalMode
          resolvedReviewers {
            Username
            DisplayName
            Decision
            DecidedAt {
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
          }
          stepStatus
          skipReason
        }
        reviewHistory {
          stepIndex
          stepLabel
          reviewerType
          reviewerUsername
          reviewerDisplayName
          action
          comment
          actionAt
        }
        reviewedBy
        reviewerName
        reviewedAt {
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
        rejectReason
        assignedRoles
        membershipId
        provisionedAt {
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
        provisionError
        provisionResult {
          strategy
          authorizedUserId
          subjectId
          subjectSchema
          subjectAction
          scriptKey
          scriptParams
          pipelineKey
          pipelineAffectedDocuments {
            schema
            documentId
            action
          }
        }
      }
    }
  }
`;
