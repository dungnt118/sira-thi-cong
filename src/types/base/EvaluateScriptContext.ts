import { UserSessionContext } from 'types/auth/UserSessionContext';
import { GroupQueryFilter } from '../filters/GroupQueryFilter';
import { QueryOrder } from '../filters/QueryOrder';

/**
 * Interface định nghĩa context parameters cho evaluateScript function
 */
export interface EvaluateScriptContext {
    /** Filter object for queries */
    filterObject: any;
    
    /** Main data object */
    data: any;
    
    /** Input data object */
    inputData: any;
    
    /** User information */
    user: UserSessionContext;
    
    /** Query parameters */
    query: any;
    
    /** Text search query */
    text: string;
    
    /** Number of records to skip (pagination) */
    skip: number;
    
    /** Maximum number of records to return */
    limit: number;
    
    /** Sorting configuration */
    sorted: QueryOrder[];
    
    /** Group query filter - single object, not array */
    group: GroupQueryFilter;
    
    /** Application settings */
    setting: any;
    
    /** Additional properties */
    [key: string]: any;
} 