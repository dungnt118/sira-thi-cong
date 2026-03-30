import { gql } from 'graphql-tag';

/**
 * Find UserGroupDefinition DTO with typed data
 */
export const FIND_USERGROUPDEFINITION_DTO = gql`
  query FindUserGroupDefinitionDto($_id: String!, $custominput: Dictionary) {
    response: find_UserGroupDefinition_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        description
        includes {
          target
          values
          targetSchema
          conditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          resolveStrategy
          resolveField
          resolveRefSchema
          enableResolveCondition
          resolveConditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          dsFilterDefId
          dsCustomFilterId
          datasourceFilterNodeId
        }
        excludes {
          target
          values
          targetSchema
          conditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          resolveStrategy
          resolveField
          resolveRefSchema
          enableResolveCondition
          resolveConditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          dsFilterDefId
          dsCustomFilterId
          datasourceFilterNodeId
        }
        snapshot {
          accountIds
          employeeIds
          departmentIds
          totalUsers
          fingerprint
        }
        snapshotRefreshedAt {
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
        isActive
        tags
      }
    }
  }
`;

/**
 * Query UserGroupDefinitions DTO list
 */
export const QUERY_USERGROUPDEFINITIONS_DTO = gql`
  query QueryUserGroupDefinitionsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_UserGroupDefinitions_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        description
        includes {
          target
          values
          targetSchema
          conditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          resolveStrategy
          resolveField
          resolveRefSchema
          enableResolveCondition
          resolveConditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          dsFilterDefId
          dsCustomFilterId
          datasourceFilterNodeId
        }
        excludes {
          target
          values
          targetSchema
          conditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          resolveStrategy
          resolveField
          resolveRefSchema
          enableResolveCondition
          resolveConditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          dsFilterDefId
          dsCustomFilterId
          datasourceFilterNodeId
        }
        snapshot {
          accountIds
          employeeIds
          departmentIds
          totalUsers
          fingerprint
        }
        snapshotRefreshedAt {
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
        isActive
        tags
      }
    }
  }
`;
