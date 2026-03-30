import { gql } from 'graphql-tag';

/**
 * Find UserNotificationItem DTO with typed data
 */
export const FIND_USERNOTIFICATIONITEM_DTO = gql`
  query FindUserNotificationItemDto($_id: String!, $custominput: Dictionary) {
    response: find_UserNotificationItem_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        messageId
        recipientKey
        subject
        body
        imageUrl
        deepLink
        categoryId
        priority
        workflowKey
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
        isRead
        readAt {
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
    }
  }
`;

/**
 * Query UserNotificationItems DTO list
 */
export const QUERY_USERNOTIFICATIONITEMS_DTO = gql`
  query QueryUserNotificationItemsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_UserNotificationItems_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        messageId
        recipientKey
        subject
        body
        imageUrl
        deepLink
        categoryId
        priority
        workflowKey
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
        isRead
        readAt {
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
    }
  }
`;
