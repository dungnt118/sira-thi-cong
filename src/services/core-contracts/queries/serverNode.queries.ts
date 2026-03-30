import { gql } from 'graphql-tag';

/**
 * Find ServerNode DTO with typed data
 */
export const FIND_SERVERNODE_DTO = gql`
  query FindServerNodeDto($_id: String!, $custominput: Dictionary) {
    response: find_ServerNode_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        alias
        code
        mode
        ipDomain
        domain
        description
        privateKey
        publicKey
      }
    }
  }
`;

/**
 * Query ServerNodes DTO list
 */
export const QUERY_SERVERNODES_DTO = gql`
  query QueryServerNodesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ServerNodes_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        alias
        code
        mode
        ipDomain
        domain
        description
        privateKey
        publicKey
      }
    }
  }
`;
