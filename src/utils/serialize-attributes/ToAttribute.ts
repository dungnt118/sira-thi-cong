import { PropDefinition } from "types/schemas/PropDefinition";

/**
 * Utility function to convert a property definition to an attribute
 * suitable for display in tables, grids, and filters.
 */
export function ToAttribute(prop: PropDefinition, schemaName: string) {
    if (!prop) return null;
    
    return {
        ...prop, // spread first to allow specific overrides
        id: prop.id,
        name: prop.name,
        label: prop.label || prop.name,
        propType: prop.propType,
        type: prop.propType, // compatibility
        schemaName: schemaName,
        isHidden: prop.isHiddenForm || false,
        required: prop.required || false,
        readonly: prop.readonly || false,
        defaultValue: prop.defaultValue,
        placeholder: prop.placeholder,
        refSchemas: prop.refSchemas,
        operations: prop.operations,
        className: prop.className,
        style: prop.style
    };
}
