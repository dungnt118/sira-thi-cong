export interface QueryFilter {
    id?: string;
    value?: any;
    propType?: string;
    toUpercaseFirstChar?: boolean;
    namespace?: string;
    operation?: string;
    customQuery?: string;
}

// Constants for QueryFilter operations
export const QueryFilterOperations = {
    EQUAL: '==',
    EQUAL2: 'eq',
    SIMILAR: '~',
    SIMILAR_IGNORE_CASE: '~i',
    NOT_SIMILAR: '!~',
    GREATER_THAN: '>',
    GREATER_THAN_EQUAL: '>=',
    LEASTER_THAN: '<',
    LEASTER_THAN_EQUAL: '<=',
    IN: 'in',
    NOT_IN: 'nin',
    NOT_EQUAL: '!=',
    NOT_EQUAL2: 'ne',
    ELEMENT_MATCH: 'elemmatch',
    BETWEEN: 'between',
    NOT_BETWEEN: 'not_between',
    START_WITH: 'start_with',
    END_WITH: 'end_with',
    IS_EMPTY: 'is_empty',
    IS_NOT_EMPTY: 'is_set',
    IS_SET: 'is_not_empty',
    CUSTOMQUERY: 'custom',
    IGNORE: 'ignore',
    MONTH: 'month',
    YEAR: 'year',
    DAY: 'day',
    TIME_DAY: 'day',
    TIME_HOUR: 'hour',
    TIME_MINUTE: 'minute',
    TIME_MONTH: 'month',
    TIME_YEAR: 'year',
    TIME_WEEK: 'week',
    TIME_QUARTER: 'quarter',
    TIME_SECOND: 'second'
} as const;

export type QueryFilterOperationType = typeof QueryFilterOperations[keyof typeof QueryFilterOperations]; 