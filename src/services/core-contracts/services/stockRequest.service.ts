/**
 * @deprecated Wave 2 — W2-01a (gap-analysis 2026-05-08).
 *
 * Backend đã chủ ý gộp `StockRequest` vào `StockOrder`. File này chỉ còn giữ
 * lại như alias để mã legacy chưa migrate vẫn compile. Mọi code mới phải
 * dùng `stockOrderService` trực tiếp.
 *
 * Mapping CRUD:
 *   stockRequestService.createStockRequest()        → stockOrderService.createStockOrder({...input, status: 'requested'})
 *   stockRequestService.updateStockRequest(id, ...) → stockOrderService.updateStockOrder(id, ...)
 *   stockRequestService.findStockRequestDto(id)     → stockOrderService.findStockOrderDto(id)
 *   stockRequestService.queryStockRequestsDto(f)    → stockOrderService.queryStockOrdersDto(f)
 *   stockRequestService.lockStockRequest(id, l)     → stockOrderService.lockStockOrder(id, l)
 *   stockRequestService.deleteStockRequest(id)      → stockOrderService.deleteStockOrder(id)
 */

import { stockOrderService } from './stockOrder.service';

/** @deprecated Use `stockOrderService` instead. */
export const stockRequestService = stockOrderService;

export default stockRequestService;
