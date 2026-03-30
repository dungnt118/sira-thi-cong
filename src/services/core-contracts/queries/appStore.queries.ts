import { gql } from 'graphql-tag';

/**
 * Find AppStore DTO with typed data
 */
export const FIND_APPSTORE_DTO = gql`
  query FindAppStoreDto($_id: String!, $custominput: Dictionary) {
    response: find_AppStore_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        isPublished
        appID
        price
        description
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
        author
        tags
        rate
        downloadNumb
        shortDescription
        thumbnail
        extractedFolder
        fileId
        appId
        resources {
          sourceId
          description
          name
          label
          version {
            Major
            Minor
            Build
            Revision
            MajorRevision
            MinorRevision
          }
          type
          backupType
        }
        mode
        fileSize
        sourceType
        lastInstallState {
          date
          success
          message
        }
        isGitPush
        gitPushStatus
        gitCommitHash
        gitTagName
        gitPushTime {
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
        gitPushMessage
      }
    }
  }
`;

/**
 * Query AppStores DTO list
 */
export const QUERY_APPSTORES_DTO = gql`
  query QueryAppStoresDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AppStores_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        isPublished
        appID
        price
        description
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
        author
        tags
        rate
        downloadNumb
        shortDescription
        thumbnail
        extractedFolder
        fileId
        appId
        resources {
          sourceId
          description
          name
          label
          version {
            Major
            Minor
            Build
            Revision
            MajorRevision
            MinorRevision
          }
          type
          backupType
        }
        mode
        fileSize
        sourceType
        lastInstallState {
          date
          success
          message
        }
        isGitPush
        gitPushStatus
        gitCommitHash
        gitTagName
        gitPushTime {
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
        gitPushMessage
      }
    }
  }
`;
