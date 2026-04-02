import { GroupQueryFilter } from './GroupQueryFilter';
import { QueryOrder } from './QueryOrder';

export interface GeneralCollectionFilter {
    skip?: number;
    limit?: number;
    group?: GroupQueryFilter;
    withRecords?: boolean;
    text?: string | null | undefined;
    sorted?: Array<QueryOrder>;

} 