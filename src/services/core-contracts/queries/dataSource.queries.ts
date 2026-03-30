import { gql } from 'graphql-tag';

/**
 * Find DataSource DTO with typed data
 */
export const FIND_DATASOURCE_DTO = gql`
  query FindDataSourceDto($_id: String!, $custominput: Dictionary) {
    response: find_DataSource_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        name
        target_schema
        graph {
          items {
            nodeId
            schemaId
            label
            name
            collection
            color
            x
            y
            unwind
            enableExtra
            extraPipeline
          }
          connectors {
            sourceId
            sourceField
            label
            function
            withParent
            connectToField
            targetId
            targetField
            key
            active
          }
          name
          id
        }
        basePipeline
        autoGeneratePipeline
        description
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
        outputFields {
          field
          alias
          label
          type
          schema
          description
          itemFields {
            field
            alias
            label
            type
            schema
            description
            itemFields {
              field
              alias
              label
              type
              schema
              description
              itemFields {
                field
                alias
                label
                type
                schema
                description
                itemFields
              }
            }
          }
        }
        outputTypes {
          key
          label
          type
          schema
          description
          nested {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
        }
        moduleIds
        structuredStages {
          op
          body
        }
      }
    }
  }
`;

/**
 * Query DataSources DTO list
 */
export const QUERY_DATASOURCES_DTO = gql`
  query QueryDataSourcesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_DataSources_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        name
        target_schema
        graph {
          items {
            nodeId
            schemaId
            label
            name
            collection
            color
            x
            y
            unwind
            enableExtra
            extraPipeline
          }
          connectors {
            sourceId
            sourceField
            label
            function
            withParent
            connectToField
            targetId
            targetField
            key
            active
          }
          name
          id
        }
        basePipeline
        autoGeneratePipeline
        description
        version {
          Major
          Minor
          Build
          Revision
          MajorRevision
          MinorRevision
        }
        outputFields {
          field
          alias
          label
          type
          schema
          description
          itemFields {
            field
            alias
            label
            type
            schema
            description
            itemFields {
              field
              alias
              label
              type
              schema
              description
              itemFields {
                field
                alias
                label
                type
                schema
                description
                itemFields
              }
            }
          }
        }
        outputTypes {
          key
          label
          type
          schema
          description
          nested {
            Length
            LongLength
            Rank
            SyncRoot
            IsReadOnly
            IsFixedSize
            IsSynchronized
          }
        }
        moduleIds
        structuredStages {
          op
          body
        }
      }
    }
  }
`;
