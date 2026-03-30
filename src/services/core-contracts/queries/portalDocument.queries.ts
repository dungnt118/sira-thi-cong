import { gql } from 'graphql-tag';

/**
 * Find PortalDocument DTO with typed data
 */
export const FIND_PORTALDOCUMENT_DTO = gql`
  query FindPortalDocumentDto($_id: String!, $custominput: Dictionary) {
    response: find_PortalDocument_dto(_id: $_id, custominput: $custominput) {
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
        journey_id
        journey_step_code
        journey_code
        context_type
        published_context
        file_name
        file_type
        files
        thumbnail_url
        published_at
        sort_order
        is_visible
      }
    }
  }
`;

/**
 * Query PortalDocuments DTO list
 */
export const QUERY_PORTALDOCUMENTS_DTO = gql`
  query QueryPortalDocumentsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PortalDocuments_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        journey_code
        context_type
        published_context
        file_name
        file_type
        files
        thumbnail_url
        published_at
        sort_order
        is_visible
      }
    }
  }
`;
