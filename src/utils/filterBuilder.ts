import { FilterOperation, GroupQueryFilter } from '@/types/filters/GroupQueryFilter';
import { GeneralCollectionFilter } from '@/types/filters/GeneralCollectionFilter';

/**
 * Wave 3.5 — helper để build GeneralCollectionFilter đúng shape backend hiểu.
 *
 * Shape sai (dùng nhầm trong Wave 2/3): `{ fields: [...], sortFields: [...], pageNumber, pageSize }`
 *   → backend trả lỗi "Unable to convert List<Object> to scalar type String".
 *
 * Shape đúng (theo `GeneralCollectionFilter` + `GroupQueryFilter`):
 *   {
 *     group: { id, operation, value, children: [] }                       // single leaf
 *     // hoặc
 *     group: { op: 'AND'|'OR', children: [{ id, operation, value, children: [] }, ...] }  // nhiều điều kiện
 *     sorted: [{ id, desc }],
 *     skip, limit, text
 *   }
 *
 * Usage:
 *   buildFilter({ where: { id: 'journey_id', value: jId } })
 *   buildFilter({ where: [{ id: 'a', value: 1 }, { id: 'b', value: 2 }], op: 'AND' })
 *   buildFilter({ where: [...], sortBy: [{ id: 'createdAt', desc: true }], limit: 100 })
 */

export interface FilterCondition {
    id: string;
    /** Default: 'eq' */
    operation?: FilterOperation | string;
    value: any;
}

export interface FilterOptions {
    /** Single condition hoặc mảng nhiều điều kiện. */
    where?: FilterCondition | FilterCondition[];
    /** Combine operator cho mảng where. Default: 'AND'. */
    op?: 'AND' | 'OR';
    /** Sort. Default: rỗng. */
    sortBy?: Array<{ id: string; desc?: boolean }>;
    /** Pagination. */
    skip?: number;
    limit?: number;
    /** Full-text search. */
    text?: string;
}

const buildLeaf = (c: FilterCondition): GroupQueryFilter => ({
    id: c.id,
    operation: c.operation ?? 'eq',
    value: c.value,
    children: [],
});

export const buildFilter = (opts: FilterOptions = {}): GeneralCollectionFilter => {
    const filter: GeneralCollectionFilter = {};

    if (opts.where) {
        const conditions = Array.isArray(opts.where) ? opts.where : [opts.where];
        if (conditions.length === 1) {
            filter.group = buildLeaf(conditions[0]);
        } else if (conditions.length > 1) {
            filter.group = {
                op: opts.op ?? 'AND',
                children: conditions.map(buildLeaf),
            };
        }
    }

    if (opts.sortBy && opts.sortBy.length > 0) {
        filter.sorted = opts.sortBy.map(s => ({ id: s.id, desc: s.desc ?? false }));
    }

    if (opts.skip !== undefined) filter.skip = opts.skip;
    if (opts.limit !== undefined) filter.limit = opts.limit;
    if (opts.text) filter.text = opts.text;

    return filter;
};

export default buildFilter;
