import { gql } from 'graphql-tag';

/**
 * Find ChecklistTemplate DTO with typed data
 */
export const FIND_CHECKLISTTEMPLATE_DTO = gql`
  query FindChecklistTemplateDto($_id: String!, $custominput: Dictionary) {
    response: find_ChecklistTemplate_dto(_id: $_id, custominput: $custominput) {
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
        category
        idx_category
        category
        is_default
        steps {
          step_code
          step_order
          step_name
          description
          min_photos
          allow_video
          is_required
        }
      }
    }
  }
`;

/**
 * Query ChecklistTemplates DTO list
 */
export const QUERY_CHECKLISTTEMPLATES_DTO = gql`
  query QueryChecklistTemplatesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ChecklistTemplates_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        description
        category
        idx_category
        category
        is_default
        steps {
          step_code
          step_order
          step_name
          description
          min_photos
          allow_video
          is_required
        }
      }
    }
  }
`;
