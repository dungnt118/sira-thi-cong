/**
 * @deprecated Wave 2 — W2-01a (gap-analysis 2026-05-08).
 *
 * `StockRequest` GraphQL operations no longer exist on the backend
 * (schema gộp vào `StockOrder`). Code mới phải dùng
 * `FIND_STOCKORDER_DTO` / `QUERY_STOCKORDERS_DTO` từ `stockOrder.queries`.
 */

import {
    FIND_STOCKORDER_DTO,
    QUERY_STOCKORDERS_DTO,
} from './stockOrder.queries';

/** @deprecated Use `FIND_STOCKORDER_DTO` instead. */
export const FIND_STOCKREQUEST_DTO = FIND_STOCKORDER_DTO;

/** @deprecated Use `QUERY_STOCKORDERS_DTO` instead. */
export const QUERY_STOCKREQUESTS_DTO = QUERY_STOCKORDERS_DTO;
