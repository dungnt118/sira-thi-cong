import { gql } from 'graphql-tag';

/**
 * Find NotificationDeliveryLog DTO with typed data
 */
export const FIND_NOTIFICATIONDELIVERYLOG_DTO = gql`
  query FindNotificationDeliveryLogDto($_id: String!, $custominput: Dictionary) {
    response: find_NotificationDeliveryLog_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        messageId
        regCode
        recipientKey
        recipientType
        channel
        resolvedSubject
        resolvedBody
        status
        attempts
        sentAt {
          DateTime
          UtcDateTime
          LocalDateTime
          Date
          Day
          DayOfWeek
          DayOfYear
          Hour
          Millisecond
          Microsecond
          Nanosecond
          Minute
          Month
          Offset {
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
          TotalOffsetMinutes
          Second
          Ticks
          UtcTicks
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
        deliveredAt {
          DateTime
          UtcDateTime
          LocalDateTime
          Date
          Day
          DayOfWeek
          DayOfYear
          Hour
          Millisecond
          Microsecond
          Nanosecond
          Minute
          Month
          Offset {
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
          TotalOffsetMinutes
          Second
          Ticks
          UtcTicks
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
        errorMessage
        providerMessageId
        providerName
      }
    }
  }
`;

/**
 * Query NotificationDeliveryLogs DTO list
 */
export const QUERY_NOTIFICATIONDELIVERYLOGS_DTO = gql`
  query QueryNotificationDeliveryLogsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_NotificationDeliveryLogs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        messageId
        regCode
        recipientKey
        recipientType
        channel
        resolvedSubject
        resolvedBody
        status
        attempts
        sentAt {
          DateTime
          UtcDateTime
          LocalDateTime
          Date
          Day
          DayOfWeek
          DayOfYear
          Hour
          Millisecond
          Microsecond
          Nanosecond
          Minute
          Month
          Offset {
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
          TotalOffsetMinutes
          Second
          Ticks
          UtcTicks
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
        deliveredAt {
          DateTime
          UtcDateTime
          LocalDateTime
          Date
          Day
          DayOfWeek
          DayOfYear
          Hour
          Millisecond
          Microsecond
          Nanosecond
          Minute
          Month
          Offset {
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
          TotalOffsetMinutes
          Second
          Ticks
          UtcTicks
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
        errorMessage
        providerMessageId
        providerName
      }
    }
  }
`;
