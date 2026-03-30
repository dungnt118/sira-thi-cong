import { gql } from 'graphql-tag';

/**
 * Find AuthorizedUser DTO with typed data
 */
export const FIND_AUTHORIZEDUSER_DTO = gql`
  query FindAuthorizedUserDto($_id: String!, $custominput: Dictionary) {
    response: find_AuthorizedUser_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
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
 * Query AuthorizedUsers DTO list
 */
export const QUERY_AUTHORIZEDUSERS_DTO = gql`
  query QueryAuthorizedUsersDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_AuthorizedUsers_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
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
