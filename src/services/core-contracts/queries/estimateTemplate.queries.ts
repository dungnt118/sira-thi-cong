import { gql } from 'graphql-tag';

/**
 * Find EstimateTemplate DTO with typed data
 */
export const FIND_ESTIMATETEMPLATE_DTO = gql`
  query FindEstimateTemplateDto($_id: String!, $custominput: Dictionary) {
    response: find_EstimateTemplate_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        name
        unit
      }
    }
  }
`;

/**
 * Query EstimateTemplates DTO list
 */
export const QUERY_ESTIMATETEMPLATES_DTO = gql`
  query QueryEstimateTemplatesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_EstimateTemplates_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        name
        unit
      }
    }
  }
`;
