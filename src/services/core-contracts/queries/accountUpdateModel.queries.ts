import { gql } from 'graphql-tag';

/**
 * Find AccountUpdateModel DTO with typed data
 */
export const FIND_ACCOUNTUPDATEMODEL_DTO = gql`
  query FindAccountUpdateModelDto($_id: String!, $custominput: Dictionary) {
    response: find_AccountUpdateModel_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        password
        globalUserId
        username
        isActive
        permVer
        isRoot
        identity_contexts {
          clientId
          subjectSchema
          policy
          subjectId
          roles
          defaultRole
          metadata
        }
        avatar
        fullName
        type
        email
        phoneNumber
        title
        tenantId
      }
    }
  }
`;

/**
 * Query AccountUpdateModels DTO list
 */
export const QUERY_ACCOUNTUPDATEMODELS_DTO = gql`
  query QueryAccountUpdateModelsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AccountUpdateModels_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        password
        globalUserId
        username
        isActive
        permVer
        isRoot
        identity_contexts {
          clientId
          subjectSchema
          policy
          subjectId
          roles
          defaultRole
          metadata
        }
        avatar
        fullName
        type
        email
        phoneNumber
        title
        tenantId
      }
    }
  }
`;
