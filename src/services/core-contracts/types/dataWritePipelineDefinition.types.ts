import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * DataWritePipelineDefinition interface
 * Auto-generated from Schema: DataWritePipelineDefinition
 */
export interface IDataWritePipelineDefinition {
  _id: string;
  key?: string;
  label?: string;
  description?: string;
  writeTargets?: IWritetargetsItem[];
  inputFields?: IInputfieldsItem[];
  isActive?: boolean;
  version?: IVersionItem[];
}

export interface IWritetargetsItem {
  schema?: string;
  role?: any;
  conditionExpression?: IConditionexpressionItem[];
  autoLink?: IAutolinkItem[];
  assignments?: IAssignmentsItem[];
  match?: IMatchItem[];
  behavior?: IBehaviorItem[];
  autoMapUnmappedFields?: boolean;
}

export interface IConditionexpressionItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any[];
  op?: any[];
  value?: any;
  values?: any[];
  children?: IChildrenItem[];
}

export interface IChildrenItem {
  path?: string;
  logical?: any;
  op?: any;
  value?: any;
  values?: any;
  children?: any;
}

export interface IAutolinkItem {
  mode?: any;
  allowAssignmentOverride?: boolean;
}

export interface IAssignmentsItem {
  targetField?: string;
  source?: ISourceItem[];
}

export interface ISourceItem {
  kind?: any;
  field?: string;
  schema?: string;
  constValue?: any;
}

export interface IMatchItem {
  logicalOperator?: any;
  conditions?: IConditionsItem[];
}

export interface IConditionsItem {
  targetField?: string;
  op?: any;
  source?: ISourceItem[];
  ignoreIfSourceMissing?: boolean;
}

export interface ISourceItem {
  kind?: any;
  field?: string;
  schema?: string;
  constValue?: any;
}

export interface IBehaviorItem {
  onMatch?: any;
  onNotMatch?: any;
  onError?: any;
}

export interface IInputfieldsItem {
  Chars?: any;
  Length?: number;
}

export interface IVersionItem {
  Major?: number;
  Minor?: number;
  Build?: number;
  Revision?: number;
  MajorRevision?: any;
  MinorRevision?: any;
}

export interface ICreateDataWritePipelineDefinitionInput {
  key?: string;
  label?: string;
  description?: string;
  writeTargets?: IWritetargetsItem[];
  inputFields?: IInputfieldsItem[];
  isActive?: boolean;
  version?: IVersionItem[];
}

export type IDataWritePipelineDefinitionListResponse = ApiListResponse<IDataWritePipelineDefinition>
