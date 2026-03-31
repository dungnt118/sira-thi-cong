import { PropTypeEnum } from "./enums";

/**
 * Interface definition for schema property.
 */
export interface PropDefinition {
    id: string;
    name: string;
    label?: string;
    propType: string | PropTypeEnum;
    nested?: PropDefinition[];
    operations?: Array<{ value: string; label: string }>;
    refSchemas?: string[];
    isHiddenForm?: boolean;
    has_suggestion_script?: boolean;
    isMentions?: boolean;
    suggestion_dependencies?: string[];
    isDynamicRefSchemas?: boolean;
    dynamicRefSchemas?: string;
    description?: string;
    defaultValue?: any;
    placeholder?: string;
    required?: boolean;
    readonly?: boolean;
    className?: string;
    style?: any;
    [key: string]: any;
}
