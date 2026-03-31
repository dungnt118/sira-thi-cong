/**
 * Interface definition for query sorting order.
 */
export interface QueryOrder {
    /** Property ID to sort by */
    id: string;
    
    /** Sort direction: true for descending, false for ascending */
    desc: boolean;
}
