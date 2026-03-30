import { gql } from 'graphql-tag';

/**
 * Find TenantInfo DTO with typed data
 */
export const FIND_TENANTINFO_DTO = gql`
  query FindTenantInfoDto($_id: String!, $custominput: Dictionary) {
    response: find_TenantInfo_dto(_id: $_id, custominput: $custominput) {
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
        domain
        description
        logoId
        color
      }
    }
  }
`;

/**
 * Query TenantInfos DTO list
 */
export const QUERY_TENANTINFOS_DTO = gql`
  query QueryTenantInfosDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_TenantInfos_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        code
        domain
        description
        logoId
        color
      }
    }
  }
`;
