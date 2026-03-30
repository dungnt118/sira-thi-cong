import { gql } from 'graphql-tag';

/**
 * Find AnnouncementTemplateDefinition DTO with typed data
 */
export const FIND_ANNOUNCEMENTTEMPLATEDEFINITION_DTO = gql`
  query FindAnnouncementTemplateDefinitionDto($_id: String!, $custominput: Dictionary) {
    response: find_AnnouncementTemplateDefinition_dto(_id: $_id, custominput: $custominput) {
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
        subjectTemplate
        bodyTemplate
        channels {
          Length
          LongLength
          Rank
          SyncRoot
          IsReadOnly
          IsFixedSize
          IsSynchronized
        }
        categoryId
        defaultPriority
        isActive
        tags
        sortOrder
      }
    }
  }
`;

/**
 * Query AnnouncementTemplateDefinitions DTO list
 */
export const QUERY_ANNOUNCEMENTTEMPLATEDEFINITIONS_DTO = gql`
  query QueryAnnouncementTemplateDefinitionsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AnnouncementTemplateDefinitions_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        code
        description
        subjectTemplate
        bodyTemplate
        channels {
          Length
          LongLength
          Rank
          SyncRoot
          IsReadOnly
          IsFixedSize
          IsSynchronized
        }
        categoryId
        defaultPriority
        isActive
        tags
        sortOrder
      }
    }
  }
`;
