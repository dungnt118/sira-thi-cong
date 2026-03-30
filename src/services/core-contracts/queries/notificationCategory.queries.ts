import { gql } from 'graphql-tag';

/**
 * Find NotificationCategory DTO with typed data
 */
export const FIND_NOTIFICATIONCATEGORY_DTO = gql`
  query FindNotificationCategoryDto($_id: String!, $custominput: Dictionary) {
    response: find_NotificationCategory_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        code
        description
        icon
        color
        defaultPriority
        sortOrder
        isActive
      }
    }
  }
`;

/**
 * Query NotificationCategorys DTO list
 */
export const QUERY_NOTIFICATIONCATEGORYS_DTO = gql`
  query QueryNotificationCategorysDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_NotificationCategorys_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        code
        description
        icon
        color
        defaultPriority
        sortOrder
        isActive
      }
    }
  }
`;
