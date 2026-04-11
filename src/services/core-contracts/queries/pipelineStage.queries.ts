import { gql } from 'graphql-tag';

/**
 * Find PipelineStage DTO with typed data
 */
export const FIND_PIPELINESTAGE_DTO = gql`
  query FindPipelineStageDto($_id: String!, $custominput: Dictionary) {
    response: find_PipelineStage_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        pipeline_id
        idx_pipeline_id
        order
        color
        journey_step_code
      }
    }
  }
`;

/**
 * Query PipelineStages DTO list
 */
export const QUERY_PIPELINESTAGES_DTO = gql`
  query QueryPipelineStagesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PipelineStages_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        pipeline_id
        idx_pipeline_id
        order
        color
        journey_step_code
      }
    }
  }
`;
