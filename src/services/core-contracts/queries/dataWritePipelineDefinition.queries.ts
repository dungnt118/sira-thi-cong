import { gql } from 'graphql-tag';

/**
 * Find DataWritePipelineDefinition DTO with typed data
 */
export const FIND_DATAWRITEPIPELINEDEFINITION_DTO = gql`
  query FindDataWritePipelineDefinitionDto($_id: String!, $custominput: Dictionary) {
    response: find_DataWritePipelineDefinition_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        key
        label
        description
        writeTargets {
          schema
          role
          conditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          autoLink {
            mode
            allowAssignmentOverride
          }
          assignments {
            targetField
            source {
              kind
              field
              schema
              constValue
            }
          }
          match {
            logicalOperator
            conditions {
              targetField
              op
              source {
                kind
                field
                schema
                constValue
              }
              ignoreIfSourceMissing
            }
          }
          behavior {
            onMatch
            onNotMatch
            onError
          }
          autoMapUnmappedFields
        }
        inputFields {
          Chars
          Length
        }
        isActive
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
      }
    }
  }
`;

/**
 * Query DataWritePipelineDefinitions DTO list
 */
export const QUERY_DATAWRITEPIPELINEDEFINITIONS_DTO = gql`
  query QueryDataWritePipelineDefinitionsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_DataWritePipelineDefinitions_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        key
        label
        description
        writeTargets {
          schema
          role
          conditionExpression {
            path
            logical
            op
            value
            values
            children {
              path
              logical
              op
              value
              values
              children {
                path
                logical
                op
                value
                values
                children
              }
            }
          }
          autoLink {
            mode
            allowAssignmentOverride
          }
          assignments {
            targetField
            source {
              kind
              field
              schema
              constValue
            }
          }
          match {
            logicalOperator
            conditions {
              targetField
              op
              source {
                kind
                field
                schema
                constValue
              }
              ignoreIfSourceMissing
            }
          }
          behavior {
            onMatch
            onNotMatch
            onError
          }
          autoMapUnmappedFields
        }
        inputFields {
          Chars
          Length
        }
        isActive
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
      }
    }
  }
`;
