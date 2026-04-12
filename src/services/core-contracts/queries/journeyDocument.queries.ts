import { gql } from 'graphql-tag';

/**
 * Find JourneyDocument DTO with typed data
 */
export const FIND_JOURNEYDOCUMENT_DTO = gql`
  query FindJourneyDocumentDto($_id: String!, $custominput: Dictionary) {
    response: find_JourneyDocument_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        journey_id
        idx_journey_id
        journey_step_code
        worktaskId
        idx_worktaskId
        description
        files
        published_at
        is_published
        createdAt
        createdBy
        title
        doc_type
      }
    }
  }
`;

/**
 * Query JourneyDocuments DTO list
 */
export const QUERY_JOURNEYDOCUMENTS_DTO = gql`
  query QueryJourneyDocumentsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_JourneyDocuments_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        journey_step_code
        worktaskId
        idx_worktaskId
        description
        files
        published_at
        is_published
        createdAt
        createdBy
        title
        doc_type
      }
    }
  }
`;
