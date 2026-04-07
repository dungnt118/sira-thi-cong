import { gql } from 'graphql-tag';

/**
 * Find LaborPriceConfig DTO with typed data
 */
export const FIND_LABORPRICECONFIG_DTO = gql`
  query FindLaborPriceConfigDto($_id: String!, $custominput: Dictionary) {
    response: find_LaborPriceConfig_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        levelCode
        name
        defaultPrice
        status
        note
      }
    }
  }
`;

/**
 * Query LaborPriceConfigs DTO list
 */
export const QUERY_LABORPRICECONFIGS_DTO = gql`
  query QueryLaborPriceConfigsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_LaborPriceConfigs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        levelCode
        name
        defaultPrice
        status
        note
      }
    }
  }
`;
