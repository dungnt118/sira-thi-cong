import { gql } from 'graphql-tag';

/**
 * Find NotificationOutbox DTO with typed data
 */
export const FIND_NOTIFICATIONOUTBOX_DTO = gql`
  query FindNotificationOutboxDto($_id: String!, $custominput: Dictionary) {
    response: find_NotificationOutbox_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        messageId
        scope
        regCode
        workflowKey
        correlationId
        subjectTemplate
        bodyTemplate
        templateData
        metadata {
          deepLink
          schemaName
          recordId
          actionKey
          categoryId
          actions {
            actionId
            label
            icon
            type
            url
            deepLink
            apiEndpoint
            payload
          }
          customData
        }
        recipients {
          userGroupIds {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          includes {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          excludes {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          explicitUsernames {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          explicitEmails {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          explicitGlobalUserIds {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
        }
        channels {
          Length
          LongLength
          Rank
          SyncRoot
          IsReadOnly
          IsFixedSize
          IsSynchronized
        }
        priority
        status
        scheduledAt {
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
        options
      }
    }
  }
`;

/**
 * Query NotificationOutboxs DTO list
 */
export const QUERY_NOTIFICATIONOUTBOXS_DTO = gql`
  query QueryNotificationOutboxsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_NotificationOutboxs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        messageId
        scope
        regCode
        workflowKey
        correlationId
        subjectTemplate
        bodyTemplate
        templateData
        metadata {
          deepLink
          schemaName
          recordId
          actionKey
          categoryId
          actions {
            actionId
            label
            icon
            type
            url
            deepLink
            apiEndpoint
            payload
          }
          customData
        }
        recipients {
          userGroupIds {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          includes {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          excludes {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          explicitUsernames {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          explicitEmails {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          explicitGlobalUserIds {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
        }
        channels {
          Length
          LongLength
          Rank
          SyncRoot
          IsReadOnly
          IsFixedSize
          IsSynchronized
        }
        priority
        status
        scheduledAt {
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
        options
      }
    }
  }
`;
