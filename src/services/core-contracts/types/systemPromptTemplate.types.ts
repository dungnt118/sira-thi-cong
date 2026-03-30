import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * SystemPromptTemplate interface
 * Auto-generated from Schema: SystemPromptTemplate
 */
export interface ISystemPromptTemplate {
  _id: string;
  key?: string;
  tools?: IToolsItem[];
  description?: string;
  promptTemplate?: string;
  purpose?: SystemPromptTemplatePurposeEnum;
  name?: string;
}

export interface IToolsItem {
  name?: string;
  type?: ToolsTypeEnum;
  description?: string;
}

export interface ICreateSystemPromptTemplateInput {
  key?: string;
  tools?: IToolsItem[];
  description?: string;
  promptTemplate?: string;
  purpose?: SystemPromptTemplatePurposeEnum2;
  name?: string;
}

export type ISystemPromptTemplateListResponse = ApiListResponse<ISystemPromptTemplate>

// Union types generated from value_options
export type SystemPromptTemplatePurposeEnum = 'Custom' | 'GenerateSchema' | 'RefactorSchema' | 'BusinessAnalyst' | 'DeveloperAssistant' | 'CriticAgent' | 'SystemCoordinator' | 'TestGenerator' | 'DataExplorer' | 'ReportSummarizer' | 'DocumentationAssistant' | 'ContentCreator' | 'PromptEngineer' | 'QueryBuilder' | 'WorkflowDesigner' | 'FormBuilder' | 'RequirementAuditor' | 'DiffComparer' | 'EntityRecognizer' | 'ConversationalAgent' | 'SelfAudit';
export type ToolsTypeEnum = 'Api' | 'System';
export type SystemPromptTemplatePurposeEnum2 = 'Custom' | 'GenerateSchema' | 'RefactorSchema' | 'BusinessAnalyst' | 'DeveloperAssistant' | 'CriticAgent' | 'SystemCoordinator' | 'TestGenerator' | 'DataExplorer' | 'ReportSummarizer' | 'DocumentationAssistant' | 'ContentCreator' | 'PromptEngineer' | 'QueryBuilder' | 'WorkflowDesigner' | 'FormBuilder' | 'RequirementAuditor' | 'DiffComparer' | 'EntityRecognizer' | 'ConversationalAgent' | 'SelfAudit';
