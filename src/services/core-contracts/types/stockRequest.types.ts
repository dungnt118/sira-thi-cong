/**
 * @deprecated Wave 2 — W2-01a (gap-analysis 2026-05-08).
 *
 * Backend đã chủ ý gộp `StockRequest` vào `StockOrder` (xem hint
 * `requested_by` của StockOrder: "thay thế tách schema StockRequest").
 *
 * File này giữ lại CHỈ làm re-export cho code legacy còn lỡ import — code mới
 * KHÔNG được dùng. Mọi thao tác đề-xuất / duyệt / xuất-nhập kho đều xoay quanh
 * StockOrder với status `draft → requested → approved → dispatched → received
 * → completed | discrepancy | cancelled`.
 *
 * Mapping status legacy:
 *   StockRequest.pending     → StockOrder.requested
 *   StockRequest.approved    → StockOrder.approved
 *   StockRequest.rejected    → StockOrder.cancelled (kèm review_note)
 *   StockRequest.converted   → bỏ — bản thân StockOrder là phiếu thực thi
 */

import type {
    IStockOrder,
    ICreateStockOrderInput,
    IStockOrderListResponse,
    StockOrderJourneyStepCodeEnum,
    StockOrderJourneyStepCodeEnum2,
    StockOrderTypeEnum,
    StockOrderTypeEnum2,
} from './stockOrder.types';

/** @deprecated Use `IStockOrder` instead. */
export type IStockRequest = IStockOrder;

/** @deprecated Use `ICreateStockOrderInput` instead. */
export type ICreateStockRequestInput = ICreateStockOrderInput;

/** @deprecated Use `IStockOrderListResponse` instead. */
export type IStockRequestListResponse = IStockOrderListResponse;

/** @deprecated Use `StockOrderTypeEnum` (`'in' | 'out'`) instead. The legacy values `'request_in' / 'request_out'` are no longer recognized by the backend. */
export type StockRequestTypeEnum = StockOrderTypeEnum;
/** @deprecated */
export type StockRequestTypeEnum2 = StockOrderTypeEnum2;

/** @deprecated Use `StockOrderJourneyStepCodeEnum` instead. */
export type StockRequestJourneyStepCodeEnum = StockOrderJourneyStepCodeEnum;
/** @deprecated */
export type StockRequestJourneyStepCodeEnum2 = StockOrderJourneyStepCodeEnum2;

/** @deprecated The 4-status enum is replaced by StockOrder's 8-status flow. */
export type StockRequestStatusEnum = 'pending' | 'approved' | 'rejected' | 'converted';
/** @deprecated */
export type StockRequestStatusEnum2 = 'pending' | 'approved' | 'rejected' | 'converted';
