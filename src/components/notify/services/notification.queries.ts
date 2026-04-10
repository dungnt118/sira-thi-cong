import gql from 'graphql-tag';

export const GET_MY_UNREAD_COUNT = gql`
  query GetMyUnreadCount {
    response: get_my_unread_count {
      code
      data
    }
  }
`;

export const GET_MY_NOTIFICATION_SUMMARY = gql`
  query GetMyNotificationSummary {
    response: get_my_notification_summary {
      code
      message
      data
    }
  }
`;

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications(
    $isRead: Boolean
    $categoryId: String
    $keyword: String
    $skip: Int
    $limit: Int
  ) {
    response: get_my_notifications(
      isRead: $isRead
      categoryId: $categoryId
      keyword: $keyword
      skip: $skip
      limit: $limit
    ) {
      code
      message
      records
      data 
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: String!) {
    response: mark_notification_read(_id: $id) {
      code
      message
      data
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead($categoryId: String) {
    response: mark_all_notifications_read(categoryId: $categoryId) {
      code
      message
      data
    }
  }
`;

export const DELETE_MY_NOTIFICATION = gql`
  mutation DeleteMyNotification($id: String!) {
    response: delete_my_notification(_id: $id) {
      code
      message
      data
    }
  }
`;

export const DELETE_ALL_MY_NOTIFICATIONS = gql`
  mutation DeleteAllMyNotifications($categoryId: String) {
    response: delete_all_my_notifications(categoryId: $categoryId) {
      code
      data
    }
  }
`;
