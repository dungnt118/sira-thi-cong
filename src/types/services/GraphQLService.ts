import { DocumentNode } from 'graphql';

/**
 * Basic response interface for Elsaga services.
 * This is equivalent to ApiResponse but used in legacy code.
 */
export interface ElsagaResponse<T = any> {
    data: T | null;
    code: number;
    message?: string;
    [key: string]: any;
}

/**
 * Options for GraphQL queries.
 */
export interface QueryOptions {
    query: DocumentNode;
    variables?: { [key: string]: any };
    fetchPolicy?: string;
    context?: any;
    [key: string]: any;
}

/**
 * Options for updating or removing fragments in Apollo cache.
 */
export interface FragmentOption {
    fragment: DocumentNode;
    fragmentName?: string;
    [key: string]: any;
}

/**
 * Options for updating cache after a mutation.
 * Usually corresponds to QueryOptions passed to readQuery/writeQuery.
 */
export interface CacheUpdateOption {
    query: DocumentNode;
    variables?: { [key: string]: any };
    [key: string]: any;
}
