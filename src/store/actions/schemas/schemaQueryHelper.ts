import _ from 'lodash';
import { PropDefinition } from 'types/schemas/PropDefinition';
import { SchemaDefinition, SchemaDefinitionExtend } from 'types/schemas/SchemaDefinition';
import { ToAttribute } from 'utils/serialize-attributes/ToAttribute';
import { CONTENT_VERSION_FRAGMENT_STRUCTURE_STRING } from './query';

const RESERVED_GRAPHQL_NAMES = new Set(['null', 'true', 'false']);
const ignore_properties = ["UI", "RuntimeLoad", "RUNTIMELOAD", "RuntimeLookup", "RUNTIMELOOKUP", "RUNTIME_LOOKUP", "REFCUSTOMDATA", "REFLISTDATA", "REFTODATA", "RefCustomData", "RefListData", "RefToData"];

///generate biến flatten_prop hỗ trợ truy vấn sâu ở bảng đồng thời check và tạo ra các operations
///hàm hỗ trợ generate attribute tại đây để lúc loading trên bảng nhanh hơn
export function generateFlattenProps(schema: SchemaDefinition): void {
    if (!schema?.properties) {
        return;
    }

    schema.properties.forEach((p) => generateOperations(p));

    const flattenProps = getFlattenProp(schema);
    schema.flatten_props = flattenProps;
    schema.attributes = schema.properties
        .filter((p) => {
            const propType = p.propType ?? '';
            return !ignore_properties.includes(propType) && !p.isHiddenForm;
        })
        .map((p) => ToAttribute(p, schema.name));
}

export function getFlattenProp(schema: SchemaDefinition): PropDefinition[] {
    const flattenProps = _.flatMap(schema.properties, (property) => {
        const propType = property.propType?.toString();

        if ((propType === "Object" || propType === "Nested") && property.nested && property.nested.length > 0) {
            return [property, ...property.nested];
        }

        return [property];
    });

    return flattenProps;
}

//tạo ra các option toán tử cho props
function generateOperations(prop: PropDefinition): void {
    if (!prop) {
        return;
    }

    const propType = prop.propType?.toString();

    switch (propType) {
        case "Text":
        case "Lookup":
            prop.operations = [
                { value: '~i', label: 'Chứa từ khóa' },
                { value: '!~', label: 'Không chứa từ khóa' },
                { value: '==', label: 'Bằng' },
                { value: '!=', label: 'Không bằng' },
                { value: 'in', label: 'Thuộc danh sách' },
                { value: 'nin', label: 'Không thuộc danh sách' },
                { value: 'start_with', label: 'Bắt đầu bằng' },
                { value: 'end_with', label: 'Kết thúc bằng' },
                { value: 'is_empty', label: 'Rỗng' },
                { value: 'is_set', label: 'Khác rỗng' }
            ];
            return;
        case "Number":
            prop.operations = [
                { value: '==', label: 'Bằng' },
                { value: '!=', label: 'Không bằng' },
                { value: 'in', label: 'Thuộc danh sách' },
                { value: 'nin', label: 'Không thuộc danh sách' },
                { value: '>', label: 'Lớn hơn' },
                { value: '>=', label: 'Lớn hơn hoặc bằng' },
                { value: '<', label: 'Nhỏ hơn' },
                { value: '<=', label: 'Nhỏ hơn hoặc bằng' },
                { value: 'between', label: 'Nằm giữa' }
            ];
            return;
        case "Tags":
        case "Lookups":
            prop.operations = [
                { value: '==', label: 'Bằng' },
                { value: '!=', label: 'Không bằng' },
                { value: 'in', label: 'Thuộc danh sách' },
                { value: 'nin', label: 'Không thuộc danh sách' },
                { value: 'is_empty', label: 'Rỗng' },
                { value: 'is_set', label: 'Khác rỗng' }
            ];
            return;
        case "DateTime":
        case "TimeSpan":
            prop.operations = [
                { value: '==', label: 'Bằng' },
                { value: '!=', label: 'Không bằng' },
                { value: '>', label: 'Lớn hơn' },
                { value: '>=', label: 'Lớn hơn hoặc bằng' },
                { value: '<', label: 'Nhỏ hơn' },
                { value: '<=', label: 'Nhỏ hơn hoặc bằng' },
                { value: 'between', label: 'Nằm giữa' },
                { value: 'is_empty', label: 'Rỗng' },
                { value: 'is_set', label: 'Khác rỗng' }
            ];
            return;
        case "Reference":
        case "Boolean":
        case "ObjectId":
        case "ObjectIds":
        case "LookupLocalField":
            prop.operations = [
                { value: '==', label: 'Bằng' },
                { value: '!=', label: 'Không bằng' },
                { value: 'in', label: 'Thuộc danh sách' },
                { value: 'nin', label: 'Không thuộc danh sách' },
                { value: 'is_empty', label: 'Rỗng' },
                { value: 'is_set', label: 'Khác rỗng' }
            ];
            return;
        default:
            prop.operations = [
                { value: 'is_empty', label: 'Rỗng' },
                { value: 'is_set', label: 'Khác rỗng' }
            ];
    }
}

const OBJECT_ID_TYPES = new Set(["ObjectId", "ObjectIds"]);

function isObjectIdProp(prop: PropDefinition): boolean {
    const propType = prop.propType?.toString() ?? '';
    return OBJECT_ID_TYPES.has(propType) && Array.isArray(prop.refSchemas) && prop.refSchemas.length > 0;
}

//sử dụng để chi lấy ra cấu trúc custom query
export function get_custom_query_string(
    schema: SchemaDefinitionExtend,
    all_schemas: SchemaDefinitionExtend[] = [],
    maxLevel = 7,
    selectedFields: string[] = [],
    just_use_selectedFields = false,
    additional_query = ''
): string {
    const properties = schema.properties ?? [];
    const objectIdProps = properties.filter(isObjectIdProp);

    let innerQuery = `_id createdAt ${getInnerQuery(schema.properties, maxLevel, 0, selectedFields, just_use_selectedFields)} 
            ${getIdxForReferenceFieldQueryString(objectIdProps, all_schemas)}            
            ${additional_query || ''}    
    `;
    if (!just_use_selectedFields && schema.enable_log) {
        innerQuery += ' message_numb follower_numb ';
    }
    if (!just_use_selectedFields && (schema.is_version || schema.approval?.enabled)) {
        innerQuery += ` version_numb versionId lastVersion${CONTENT_VERSION_FRAGMENT_STRUCTURE_STRING}`;
    }

    if (schema.approval?.enabled || schema.is_draft) {
        innerQuery += ' isDraft';
    }
    if (schema.is_tenant) {
        innerQuery += ' tenantId';
    }
    return `query($filter:GeneralCollectionFilterInput){response:query_${schema.name}s_dto(filter:$filter){code message page pages records data{${innerQuery}}}}`;
}

export function get_custom_find_string(
    schema: SchemaDefinitionExtend,
    all_schemas: SchemaDefinitionExtend[] = [],
    maxLevel = 8,
    selectedFields: string[] = [],
    just_use_selectedFields = false,
    additional_query = ''
): string {
    const properties = schema.properties ?? [];
    const objectIdProps = properties.filter(isObjectIdProp);

    let innerQuery = `_id createdAt ${getInnerQuery(schema.properties, maxLevel, 0, selectedFields, just_use_selectedFields)} 
            ${getIdxForReferenceFieldQueryString(objectIdProps, all_schemas)}            
            ${additional_query || ''}    
    `;
    if (!just_use_selectedFields && schema.enable_log) {
        innerQuery += ' message_numb follower_numb ';
    }
    if (!just_use_selectedFields && (schema.is_version || schema.approval?.enabled)) {
        innerQuery += ` versionId version_numb lastVersion ${CONTENT_VERSION_FRAGMENT_STRUCTURE_STRING}`;
    }

    if (!just_use_selectedFields && (schema.approval?.enabled || schema.is_draft)) {
        innerQuery += ' isDraft';
    }
    if (!just_use_selectedFields && schema.is_tenant) {
        innerQuery += ' tenantId';
    }
    return `query get_custom_find_string($_id:String){response:find_${schema.name}_dto(_id:$_id){code message data{${innerQuery}}}}`;
}

///generate các query hỗ trợ truy vấn nhanh các schema (bỏ qua các trường là ref 1-n vì tốn dung lượng)
///additional query sẽ tự động được cộng thêm vd: ref_abc{def{ghi}} this_is  additional props_ac
export function generateSchemaQuery(
    schema: SchemaDefinitionExtend,
    all_schemas: SchemaDefinitionExtend[] = [],
    maxLevel = 7,
    selectedFields: string[] = [],
    just_use_selectedFields = false,
    additional_query = ''
): void {
    const properties = schema.properties ?? [];
    const objectIdProps = properties.filter(isObjectIdProp);

    const innerQuery = `_id createdAt tenantId isDraft lastVersion${CONTENT_VERSION_FRAGMENT_STRUCTURE_STRING} versionId message_numb follower_numb ${getInnerQuery(schema.properties, maxLevel, 0, selectedFields, just_use_selectedFields)} 
            ${getIdxForReferenceFieldQueryString(objectIdProps, all_schemas)}
            ${additional_query || ''}
    `;

    schema.graph_query_string = `query($filter:GeneralCollectionFilterInput){response:query_${schema.name}s_dto(filter:$filter){code message page pages records data{${innerQuery}}}}`;
    schema.graph_find_string = `query($_id:String!){response:find_${schema.name}_dto(_id:$_id){code message data{${innerQuery}}}}`;
    schema.graph_find_reference_string = `query($_id:String!){response:find_reference_${schema.name}_dto(_id:$_id){code message data}}`;
    schema.graph_search_reference_string = `query($key:String,$limit:Int,$withRecords:Boolean){response:search_reference_${schema.name}_dto(key:$key,limit:$limit,withRecords:$withRecords){code message records data}}`;
    schema.graph_save_string = `mutation($data:${schema.name}InputDto){response:save_${schema.name}_dto(data:$data){code message data{${innerQuery}}}}`;
    // schema.graph_lock_string = `mutation($_id:String,$locked:Boolean){response:lock_${schema.name}_dto(_id:$_id,locked:$locked){code message data{${innerQuery}}}}`;
}

//hàm hỗ trợ validate tên field chữ đầu tiên phải là chữ thường
export function getValidPropName(name?: string): string {
    if (!name) {
        return '';
    }

    const normalized = name.substring(0, 1).toLowerCase() + name.substring(1);

    if (RESERVED_GRAPHQL_NAMES.has(normalized)) {
        const original = name.substring(0, 1) + name.substring(1);
        if (!RESERVED_GRAPHQL_NAMES.has(original)) {
            return original;
        }

        return `_${normalized}`;
    }

    return normalized;
}
///hỗ trợ generate các trường bên trong data
export function getInnerQuery(
    props: PropDefinition[] | undefined,
    maxLevel: number,
    level: number,
    selectedFields: string[] = [],
    just_use_selectedFields = false
): string {
    if (!props || level >= maxLevel) {
        return '';
    }

    const fields: string[] = [];

    props.filter(Boolean).forEach((prop) => {
        const propType = prop.propType?.toString();
        const availableField = selectedFields.find((f) => f === prop.id);
        const propName = getValidPropName(prop.name);

        if ((propType === "Object" || propType === "Nested") && prop.nested && prop.nested.length > 0) {
            const subQuery = getInnerQuery(prop.nested, maxLevel, level + 1, selectedFields, false);
            if (propName && subQuery) {
                fields.push(`${propName}{${subQuery}}`);
            }
        } else if (just_use_selectedFields && !availableField) {
            return;
        } else if (propName) {
            fields.push(propName);
        }
    });

    return fields.join(' ');
}

/**
 * Generate index for reference ObjectID/LOOKUP/REFERENCE fields to optimize query performance.
 */
function getIdxForReferenceFieldQueryString(props: PropDefinition[] | undefined, allSchemas: SchemaDefinition[]): string {
    const fields = new Set<string>();

    props?.forEach((prop) => {
        if (prop?.name && Array.isArray(prop.refSchemas) && prop.refSchemas.length > 0) {
            fields.add(`idx_${prop.name}`);
            return;
        }

        prop.refSchemas?.forEach((refName: string) => {
            const refSchema = allSchemas.find(s => s.name == refName);
            if (refSchema && prop?.name) {
                fields.add(`idx_${prop.name}`);
            }
        });
    });

    return Array.from(fields).join(" ");
}
