import { gql } from 'graphql-tag';

/**
 * Find ImportTemplate DTO with typed data
 */
export const FIND_IMPORTTEMPLATE_DTO = gql`
  query FindImportTemplateDto($_id: String!, $custominput: Dictionary) {
    response: find_ImportTemplate_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        schemaId
        idx_schemaId
        schemaId
        name
        nestedId
        mapping {
          prop_id
          label
          prop_type
          ref_schema
          colIndex
          required
          use_origin_formula
          hidden
          lookup_matches
          lookup_field_value
          lookup_measure
          col
          ref_id {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          formula
          format
        }
        keyMapping {
          col
          prop_type
          ref_id {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          formula
          format
        }
        defaultObjectValue
        sheet_name
        sheet_number
        pipelineKey
        start_row
        end_row
        tags
        description
      }
    }
  }
`;

/**
 * Query ImportTemplates DTO list
 */
export const QUERY_IMPORTTEMPLATES_DTO = gql`
  query QueryImportTemplatesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ImportTemplates_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        schemaId
        idx_schemaId
        schemaId
        name
        nestedId
        mapping {
          prop_id
          label
          prop_type
          ref_schema
          colIndex
          required
          use_origin_formula
          hidden
          lookup_matches
          lookup_field_value
          lookup_measure
          col
          ref_id {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          formula
          format
        }
        keyMapping {
          col
          prop_type
          ref_id {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
          formula
          format
        }
        defaultObjectValue
        sheet_name
        sheet_number
        pipelineKey
        start_row
        end_row
        tags
        description
      }
    }
  }
`;
