import { gql } from 'graphql-tag';

/**
 * Find ChartTemplate DTO with typed data
 */
export const FIND_CHARTTEMPLATE_DTO = gql`
  query FindChartTemplateDto($_id: String!, $custominput: Dictionary) {
    response: find_ChartTemplate_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        templateKey
        title
        description
        category
        tags
        faIcon
        chartType
        previewImage
        requiredFields {
          measureFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          dimensionFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          timeField {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          kpiDateFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          drilldownFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          sortFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
        }
        placeholders {
          Comparer {
            Chars
            Length
          }
          Count
          Capacity
          Keys {
            type
            jsonPath
            fieldType
            expectedPropType
            example
            description
            required
            title
          }
          Values {
            type
            jsonPath
            fieldType
            expectedPropType
            example
            description
            required
            title
          }
          Item {
            type
            jsonPath
            fieldType
            expectedPropType
            example
            description
            required
            title
          }
        }
        templateConfig
        isPublic
        isRecommended
        sortOrder
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
        name
      }
    }
  }
`;

/**
 * Query ChartTemplates DTO list
 */
export const QUERY_CHARTTEMPLATES_DTO = gql`
  query QueryChartTemplatesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ChartTemplates_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        templateKey
        title
        description
        category
        tags
        faIcon
        chartType
        previewImage
        requiredFields {
          measureFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          dimensionFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          timeField {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          kpiDateFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          drilldownFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
          sortFields {
            placeholderName
            jsonPath
            fieldType
            expectedPropType
            exampleValue
            description
            required
            title
          }
        }
        placeholders {
          Comparer {
            Chars
            Length
          }
          Count
          Capacity
          Keys {
            type
            jsonPath
            fieldType
            expectedPropType
            example
            description
            required
            title
          }
          Values {
            type
            jsonPath
            fieldType
            expectedPropType
            example
            description
            required
            title
          }
          Item {
            type
            jsonPath
            fieldType
            expectedPropType
            example
            description
            required
            title
          }
        }
        templateConfig
        isPublic
        isRecommended
        sortOrder
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
        name
      }
    }
  }
`;
