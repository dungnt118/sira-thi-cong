import { gql } from 'graphql-tag';

/**
 * Find ContentChatboxMessage DTO with typed data
 */
export const FIND_CONTENTCHATBOXMESSAGE_DTO = gql`
  query FindContentChatboxMessageDto($_id: String!, $custominput: Dictionary) {
    response: find_ContentChatboxMessage_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        content
        message_type
        thread_id
        reply_to_id
        context {
          target_schema
          content_id
          content_title
        }
        payload {
          metadata
          attachments {
            file_id
            name
            mine_type
            size
            alt
            url
            file_type
            file_path
          }
          schedule {
            scheduled_at {
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
            timezone
            remind_before_minutes
            recurrence
          }
          mentions
        }
        system {
          change_type
          changes {
            id
            label
            ori
            current
          }
          oridata
        }
        date
      }
    }
  }
`;

/**
 * Query ContentChatboxMessages DTO list
 */
export const QUERY_CONTENTCHATBOXMESSAGES_DTO = gql`
  query QueryContentChatboxMessagesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ContentChatboxMessages_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        content
        message_type
        thread_id
        reply_to_id
        context {
          target_schema
          content_id
          content_title
        }
        payload {
          metadata
          attachments {
            file_id
            name
            mine_type
            size
            alt
            url
            file_type
            file_path
          }
          schedule {
            scheduled_at {
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
            timezone
            remind_before_minutes
            recurrence
          }
          mentions
        }
        system {
          change_type
          changes {
            id
            label
            ori
            current
          }
          oridata
        }
        date
      }
    }
  }
`;
