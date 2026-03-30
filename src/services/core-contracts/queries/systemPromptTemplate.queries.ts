import { gql } from 'graphql-tag';

/**
 * Find SystemPromptTemplate DTO with typed data
 */
export const FIND_SYSTEMPROMPTTEMPLATE_DTO = gql`
  query FindSystemPromptTemplateDto($_id: String!, $custominput: Dictionary) {
    response: find_SystemPromptTemplate_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        key
        tools {
          name
          type
          description
        }
        description
        promptTemplate
        purpose
        name
      }
    }
  }
`;

/**
 * Query SystemPromptTemplates DTO list
 */
export const QUERY_SYSTEMPROMPTTEMPLATES_DTO = gql`
  query QuerySystemPromptTemplatesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_SystemPromptTemplates_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        key
        tools {
          name
          type
          description
        }
        description
        promptTemplate
        purpose
        name
      }
    }
  }
`;
