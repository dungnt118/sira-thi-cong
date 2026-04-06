import type { IChatboxSettings } from '../chatbox/ChatboxShared';
import { PropDefinition } from "./PropDefinition";

/**
 * Interface definition for a schema.
 */
export interface SchemaDefinition {
    _id: string;
    name: string;
    label?: string;
    collection?: string;
    description?: string;
    properties: PropDefinition[];
    flatten_props?: PropDefinition[];
    attributes?: any[];
    enable_log?: boolean;
    is_version?: boolean;
    is_draft?: boolean;
    is_tenant?: boolean;
    approval?: {
        enabled: boolean;
        [key: string]: any;
    };
    chatboxSetting?: IChatboxSettings;
    graph_query_string?: string;
    graph_find_string?: string;
    graph_find_reference_string?: string;
    graph_search_reference_string?: string;
    graph_save_string?: string;
    graph_lock_string?: string;
    [key: string]: any;
}

/**
 * Extended schema definition for specialized use cases.
 */
export interface SchemaDefinitionExtend extends SchemaDefinition {
    [key: string]: any;
}

/**
 * Utils for schema normalization and manipulation.
 */
export const SchemaNormalizationUtils = {
    /**
     * Normalizes a schema object to ensure it has all required properties.
     */
    normalizeSchema: (schema: any): SchemaDefinition => {
        if (!schema) return {} as SchemaDefinition;
        
        return {
            ...schema,
            properties: Array.isArray(schema.properties) ? schema.properties : [],
            flatten_props: Array.isArray(schema.flatten_props) ? schema.flatten_props : undefined,
            attributes: Array.isArray(schema.attributes) ? schema.attributes : undefined,
        };
    }
};
