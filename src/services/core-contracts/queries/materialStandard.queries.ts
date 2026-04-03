import { gql } from 'graphql-tag';

/**
 * Find MaterialStandard DTO with typed data
 */
export const FIND_MATERIALSTANDARD_DTO = gql`
  query FindMaterialStandardDto($_id: String!, $custominput: Dictionary) {
    response: find_MaterialStandard_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        material_id
        idx_material_id
        material_name
        construction_type
        idx_construction_type
        usage_per_m2
        note
      }
    }
  }
`;

/**
 * Query MaterialStandards DTO list
 */
export const QUERY_MATERIALSTANDARDS_DTO = gql`
  query QueryMaterialStandardsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_MaterialStandards_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        material_id
        idx_material_id
        material_name
        construction_type
        idx_construction_type
        usage_per_m2
        note
      }
    }
  }
`;
