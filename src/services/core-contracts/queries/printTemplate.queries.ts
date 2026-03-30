import { gql } from 'graphql-tag';

/**
 * Find PrintTemplate DTO with typed data
 */
export const FIND_PRINTTEMPLATE_DTO = gql`
  query FindPrintTemplateDto($_id: String!, $custominput: Dictionary) {
    response: find_PrintTemplate_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        html
        css
        is_library
        category
        dsId
        target_schema
        page_setup {
          size {
            name
            widthMm
            heightMm
          }
          orientation
          margins {
            topMm
            bottomMm
            leftMm
            rightMm
          }
        }
      }
    }
  }
`;

/**
 * Query PrintTemplates DTO list
 */
export const QUERY_PRINTTEMPLATES_DTO = gql`
  query QueryPrintTemplatesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PrintTemplates_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        html
        css
        is_library
        category
        dsId
        target_schema
        page_setup {
          size {
            name
            widthMm
            heightMm
          }
          orientation
          margins {
            topMm
            bottomMm
            leftMm
            rightMm
          }
        }
      }
    }
  }
`;
