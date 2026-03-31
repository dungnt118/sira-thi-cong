import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * DataSource interface
 * Auto-generated from Schema: DataSource
 */
export interface IDataSource {
  _id: string;
  name?: string;
  target_schema?: string;
  graph?: IGraphItem[];
  basePipeline?: string;
  autoGeneratePipeline?: boolean;
  description?: string;
  version?: IVersionItem[];
  outputFields?: IOutputfieldsItem[];
  outputTypes?: IOutputtypesItem[];
  moduleIds?: any[];
  structuredStages?: IStructuredstagesItem[];
}

export interface IGraphItem {
  items?: IItemsItem[];
  connectors?: IConnectorsItem[];
  name?: string;
  id?: string;
}

export interface IItemsItem {
  nodeId?: string;
  schemaId?: string;
  label?: string;
  name?: string;
  collection?: string;
  color?: string;
  x?: number;
  y?: number;
  unwind?: boolean;
  enableExtra?: string;
  extraPipeline?: string;
}

export interface IConnectorsItem {
  sourceId?: string;
  sourceField?: string;
  label?: string;
  function?: ConnectorsFunctionEnum;
  withParent?: boolean;
  connectToField?: string;
  targetId?: string;
  targetField?: string;
  key?: string;
  active?: boolean;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface IOutputfieldsItem {
  field?: string;
  alias?: string;
  label?: string;
  type?: OutputfieldsTypeEnum;
  schema?: string;
  description?: string;
  itemFields?: IItemfieldsItem[];
}

export interface IItemfieldsItem {
  field?: string;
  alias?: string;
  label?: string;
  type?: ItemfieldsTypeEnum;
  schema?: string;
  description?: string;
  itemFields?: IItemfieldsItem[];
}

export interface IItemfieldsItem {
  field?: string;
  alias?: string;
  label?: string;
  type?: ItemfieldsTypeEnum2;
  schema?: string;
  description?: string;
  itemFields?: IItemfieldsItem[];
}

export interface IItemfieldsItem {
  field?: string;
  alias?: string;
  label?: string;
  type?: ItemfieldsTypeEnum3;
  schema?: string;
  description?: string;
  itemFields?: any;
}

export interface IOutputtypesItem {
  key?: string;
  label?: string;
  type?: OutputtypesTypeEnum;
  schema?: string;
  description?: string;
  nested?: INestedItem[];
}

export interface INestedItem {
  Length?: number;
  LongLength?: any;
  Rank?: number;
  SyncRoot?: any;
  IsReadOnly?: boolean;
  IsFixedSize?: boolean;
  IsSynchronized?: boolean;
}

export interface IStructuredstagesItem {
  op?: string;
  body?: any;
}

export interface ICreateDataSourceInput {
  name?: string;
  target_schema?: string;
  graph?: IGraphItem[];
  basePipeline?: string;
  autoGeneratePipeline?: boolean;
  description?: string;
  version?: IVersionItem[];
  outputFields?: IOutputfieldsItem[];
  outputTypes?: IOutputtypesItem[];
  moduleIds?: any[];
  structuredStages?: IStructuredstagesItem[];
}

export type IDataSourceListResponse = ApiListResponse<IDataSource>

// Union types generated from value_options
export type ConnectorsFunctionEnum = 'Lookup' | 'GraphLookup';
export type OutputfieldsTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type ItemfieldsTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type ItemfieldsTypeEnum2 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type ItemfieldsTypeEnum3 = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
export type OutputtypesTypeEnum = 'Text' | 'Boolean' | 'DateTime' | 'MultiDateTime' | 'TimeSpan' | 'Json' | 'Geolocation' | 'Assets' | 'Number' | 'ObjectId' | 'ObjectIds' | 'Lookup' | 'Lookups' | 'LookupLocalField' | 'Reference' | 'Nested' | 'Object' | 'Tags' | 'FileUploads' | 'CustomComponent' | 'UI' | 'HeadlessContent' | 'NestHeadlessContent' | 'HeadlessFieldValue' | 'HeadlessFieldPicker' | 'Selection' | 'RefListData' | 'RefCustomData' | 'RefToData' | 'SystemFieldPicker' | 'RuntimeLoad' | 'FormGroupTemplate' | 'FormGroupData' | 'FormGroupMapping' | 'ApprovalSnapshot' | 'DirectoryTreeRef' | 'DatasourceFilterRef' | 'UserGroupRefs' | 'LinkedAuthorizedUser' | 'AuthorizedUser' | 'AuthorizedUsers' | 'RuntimeLookup';
