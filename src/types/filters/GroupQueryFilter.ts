export enum AND_OR {
    AND = 'AND',
    OR = 'OR'
}
export enum FilterOperation {
    EQUAL = "==",
    EQUAL2 = "eq",
    SIMILAR = "~",
    SIMILAR_IGNORE_CASE = "~i",
    NOT_SIMILAR = "!~",
    GREATER_THAN = ">",
    GREATER_THAN_EQUAL = ">=",
    LEASTER_THAN = "<",
    LEASTER_THAN_EQUAL = "<=",
    IN = "in",
    NOT_IN = "nin",
    NOT_EQUAL = "!=",
    NOT_EQUAL2 = "ne",
    ELEMENT_MATCH = "elemmatch",
    BETWEEN = "between",
    NOT_BETWEEN = "not_between",
    START_WITH = "start_with",
    END_WITH = "end_with",
    IS_EMPTY = "is_empty",
    IS_NOT_EMPTY = "is_set",       // Backend value for "is not empty"
    IS_SET = "is_not_empty",       // Alias for "is not empty"
    CUSTOMQUERY = "custom",        // Client tự định nghĩa string truy vấn
    IGNORE = "ignore"
}

export enum ConditionPropType {
    PROPTYPE_OBJECTID = "OBJECTID",
    PROPTYPE_NUMBER = "NUMBER",
    PROPTYPE_BOOLEAN = "BOOLEAN",
    PROPTYPE_DATE = "DATETIME",
    PROPTYPE_TEXT = "TEXT"
}
///cấu trúc này chỉ để mượn như 1 abstract class, thực tế nó không cần phải tồn tại mà gộp luôn vào GroupQueryFilter cũng được.
///do vậy tôi sẽ bỏ export để đỡ bị lẫn lộn
export interface QueryCondition {
    id?: string;
    value?: any;
    operation?: FilterOperation | string;
    propType?: ConditionPropType;
}

/**
 * Định nghĩa cấu trúc của filter chuẩn khi search dữ liệu
 * - Nếu children.length > 0: đây là group node
 * - Nếu children.length = 0: đây là leaf node (condition)
 * - Backend tự động convert operation null/empty thành "==" hoặc "eq"
 */
export interface GroupQueryFilter extends QueryCondition {
    children: Array<GroupQueryFilter>;
    op?: AND_OR | 'AND' | 'OR'| 'EXISTS';
}

