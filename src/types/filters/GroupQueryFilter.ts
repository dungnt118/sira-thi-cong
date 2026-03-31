/**
 * Interface definition for group query filter.
 */
export interface GroupQueryFilter {
    /** Group by field sequence */
    fields: string[];
    
    /** Filter conditions for grouping */
    conditions?: any;
    
    /** Aggregation logic */
    aggregations?: any[];
}
