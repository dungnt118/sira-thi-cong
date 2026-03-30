import { gql } from 'graphql-tag';

/**
 * Find NotificationTriggerRule DTO with typed data
 */
export const FIND_NOTIFICATIONTRIGGERRULE_DTO = gql`
  query FindNotificationTriggerRuleDto($_id: String!, $custominput: Dictionary) {
    response: find_NotificationTriggerRule_dto(_id: $_id, custominput: $custominput) {
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
        isActive
        categoryId
        triggerSchema
        events
        triggerCondition {
          op
          children {
            id
            operation
            value
            propType
            op
            children {
              id
              operation
              value
              propType
              op
              children {
                id
                operation
                value
                propType
                op
                children
              }
            }
          }
        }
        watchedFields
        actions {
          recipients {
            type
            value
            fieldPath
          }
          channels
          titleTemplate
          shortMessageTemplate
          fullContentTemplate
          metadataOverride
        }
        priority
      }
    }
  }
`;

/**
 * Query NotificationTriggerRules DTO list
 */
export const QUERY_NOTIFICATIONTRIGGERRULES_DTO = gql`
  query QueryNotificationTriggerRulesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_NotificationTriggerRules_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        description
        isActive
        categoryId
        triggerSchema
        events
        triggerCondition {
          op
          children {
            id
            operation
            value
            propType
            op
            children {
              id
              operation
              value
              propType
              op
              children {
                id
                operation
                value
                propType
                op
                children
              }
            }
          }
        }
        watchedFields
        actions {
          recipients {
            type
            value
            fieldPath
          }
          channels
          titleTemplate
          shortMessageTemplate
          fullContentTemplate
          metadataOverride
        }
        priority
      }
    }
  }
`;
