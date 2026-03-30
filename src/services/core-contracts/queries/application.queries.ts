import { gql } from 'graphql-tag';

/**
 * Find Application DTO with typed data
 */
export const FIND_APPLICATION_DTO = gql`
  query FindApplicationDto($_id: String!, $custominput: Dictionary) {
    response: find_Application_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        configFolder
        code
        description
        logoId
        env_variables
        isWorkerService
        menus {
          name
          target_schema
          moduleIds
          panel_type
          url_type
          layoutId
          viewExtensionId
          requiredPermissions
          isDefault
          isHidden
          parentId
          type
          icon
          path
          absolutePath
          description
          level
          priority
          action_steps {
            subject
            type
            disabled
            setting
            is_skip_condition
            is_terminate_condition
            skip_condition
            show_confirm_message
            confirm_message
            confirm_type
            confirm_ok_label
            confirm_cancel_label
            show_finish_message
            finish_message
            finish_message_type
            terminate_condition
            show_loading
            loading_message
          }
          isRootScope
          showBadge
          badgeScript
          badgeType
          badgeColor
          id
        }
      }
    }
  }
`;

/**
 * Query Applications DTO list
 */
export const QUERY_APPLICATIONS_DTO = gql`
  query QueryApplicationsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_Applications_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        configFolder
        code
        description
        logoId
        env_variables
        isWorkerService
        menus {
          name
          target_schema
          moduleIds
          panel_type
          url_type
          layoutId
          viewExtensionId
          requiredPermissions
          isDefault
          isHidden
          parentId
          type
          icon
          path
          absolutePath
          description
          level
          priority
          action_steps {
            subject
            type
            disabled
            setting
            is_skip_condition
            is_terminate_condition
            skip_condition
            show_confirm_message
            confirm_message
            confirm_type
            confirm_ok_label
            confirm_cancel_label
            show_finish_message
            finish_message
            finish_message_type
            terminate_condition
            show_loading
            loading_message
          }
          isRootScope
          showBadge
          badgeScript
          badgeType
          badgeColor
          id
        }
      }
    }
  }
`;
