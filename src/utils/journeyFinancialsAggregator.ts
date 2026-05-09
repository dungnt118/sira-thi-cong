/**
 * Wave 4 W4-01 + W4-02 — Journey Financials Aggregator
 *
 * Centralized helper to compute revenue, cost, P&L for a single journey
 * by aggregating from multiple existing schemas:
 *
 *   - REVENUE recognized = Σ PaymentReceipt.amount_received (where journey_id = X)
 *     ↳ "Đã thực thu" — đã có dòng tiền vào.
 *
 *   - REVENUE invoiced = Σ SalesInvoice.total_amount where invoice_status IN ('issued','sent')
 *     ↳ "Đã xuất hoá đơn" — chưa chắc đã thu.
 *
 *   - COST actual = StockOrder line items (where journey_id=X, status>='dispatched')
 *                 + PaymentRequest where journey_id=X (link via payment_milestone_id linked,
 *                                                    or via supporting reference_code)
 *                                          AND status='paid'
 *
 *   - COST planned = JourneyEstimate.total_estimate_cost (latest 'approved' version)
 *
 * Used by:
 *   - JourneyCostLedger (Phase 3) — shows planned vs actual breakdown
 *   - PnLTab (Phase 4) — shows revenue/cost/margin summary
 *   - KT Reports (Phase 5) — aggregates across many journeys
 */

import { paymentReceiptService } from '../services/core-contracts/services/paymentReceipt.service';
import { paymentRequestService } from '../services/core-contracts/services/paymentRequest.service';
import { paymentMilestoneService } from '../services/core-contracts/services/paymentMilestone.service';
import { salesInvoiceService } from '../services/core-contracts/services/salesInvoice.service';
import { stockOrderService } from '../services/core-contracts/services/stockOrder.service';
import { journeyEstimateService } from '../services/core-contracts/services/journeyEstimate.service';
import { quotationService } from '../services/core-contracts/services/quotation.service';
import { buildFilter } from './filterBuilder';

import { IPaymentReceipt } from '../services/core-contracts/types/paymentReceipt.types';
import { IPaymentRequest } from '../services/core-contracts/types/paymentRequest.types';
import { IPaymentMilestone } from '../services/core-contracts/types/paymentMilestone.types';
import { ISalesInvoice } from '../services/core-contracts/types/salesInvoice.types';
import { IStockOrder } from '../services/core-contracts/types/stockOrder.types';
import { IJourneyEstimate } from '../services/core-contracts/types/journeyEstimate.types';
import { IQuotation } from '../services/core-contracts/types/quotation.types';

export interface JourneyFinancialBreakdown {
    /** Tổng giá hợp đồng (Quotation status='approved' latest version). */
    contract_value: number;
    /** Tổng đợt thu đã setup (sum PaymentMilestone.amount). */
    total_milestones: number;
    /** Tổng đã thực thu (sum PaymentReceipt.amount_received). */
    revenue_received: number;
    /** Tổng đã xuất hoá đơn (sum SalesInvoice.total_amount where issued/sent). */
    revenue_invoiced: number;
    /** Tổng còn nợ = total_milestones - revenue_received (nếu > 0). */
    receivable_outstanding: number;

    /** Tổng chi phí kế hoạch (JourneyEstimate.total_estimate_cost latest approved). */
    cost_planned: number;
    /** Tổng chi phí vật tư thực tế (StockOrder items dispatched). */
    cost_material_actual: number;
    /** Tổng chi phí thanh toán đã chi (PaymentRequest paid with journey link). */
    cost_payment_paid: number;
    /** Tổng chi phí thực tế = material + payment. */
    cost_actual: number;

    /** Lãi gộp = revenue_received - cost_actual. */
    gross_margin: number;
    /** % lãi gộp = gross_margin / revenue_received. */
    gross_margin_pct: number;
    /** Variance vs plan = cost_actual - cost_planned. Dương = vượt ngân sách. */
    cost_variance: number;
    /** % variance = variance / cost_planned. */
    cost_variance_pct: number;

    /** Source records for drill-down (UI Cost Ledger / P&L tab uses these). */
    receipts: IPaymentReceipt[];
    invoices: ISalesInvoice[];
    requests: IPaymentRequest[];
    stockOrders: IStockOrder[];
    estimate: IJourneyEstimate | null;
    contract: IQuotation | null;
    milestones: IPaymentMilestone[];
}

const sumStockOrderActualCost = (orders: IStockOrder[]): number => {
    let total = 0;
    for (const o of orders) {
        if (o.status === 'cancelled') continue;
        // Wave 4 Phase 6: server-side trigger PostUpdate auto-tính total_value.
        // Ưu tiên đọc field này (fast path); fallback compute từ items nếu trigger chưa active.
        if (typeof (o as any).total_value === 'number' && (o as any).total_value > 0) {
            total += (o as any).total_value;
            continue;
        }
        if (!o.items || !Array.isArray(o.items)) continue;
        for (const item of o.items as any[]) {
            // Ưu tiên received_quantity (đã nhận) > issued_quantity (đã xuất) > requested_quantity > quantity.
            // Schema field tên `unit_cost`; FE types có thể có `unit_price` (legacy) — check cả 2.
            const qty = item.received_quantity ?? item.issued_quantity ?? item.requested_quantity ?? item.quantity ?? 0;
            const price = item.unit_cost ?? item.unit_price ?? 0;
            total += Number(qty) * Number(price);
        }
    }
    return total;
};

/**
 * Fetch ALL paid PaymentRequests once (for cross-journey reports).
 * Cache externally then pass via options.paidRequestsCache để tránh 100×500 queries
 * khi báo cáo tổng hợp scan nhiều journey.
 */
export async function fetchAllPaidPaymentRequests() {
    return paymentRequestService.queryPaymentRequestsDto(buildFilter({
        where: { id: 'status', value: 'paid' },
        sortBy: [{ id: 'paid_at', desc: true }],
        limit: 1000,
    })).catch(() => ({ data: [] } as any));
}

export interface AggregateOptions {
    /**
     * Pre-fetched paid PaymentRequests array — dùng khi caller (PnLReport, PMReports)
     * scan nhiều journey và muốn tránh duplicate global query.
     * Nếu undefined → aggregator tự fetch.
     */
    paidRequestsCache?: IPaymentRequest[];
}

/**
 * Fetch + aggregate tất cả tài chính của 1 journey.
 *
 * Performance: 7 query song song. Mỗi query giới hạn ≤200 records (đủ cho 1 journey).
 * Khi gọi cross-journey: truyền `options.paidRequestsCache` để skip global PaymentRequest fetch.
 */
export async function aggregateJourneyFinancials(
    journeyId: string,
    options: AggregateOptions = {},
): Promise<JourneyFinancialBreakdown> {
    const journeyFilter = buildFilter({
        where: { id: 'journey_id', value: journeyId },
        sortBy: [{ id: 'createdAt', desc: true }],
        limit: 200,
    });

    const paidRequestsPromise = options.paidRequestsCache
        ? Promise.resolve({ data: options.paidRequestsCache } as any)
        : fetchAllPaidPaymentRequests();

    const [
        receiptsRes,
        invoicesRes,
        requestsRes,
        stockOrdersRes,
        milestonesRes,
        estimatesRes,
        quotationsRes,
    ] = await Promise.all([
        paymentReceiptService.queryPaymentReceiptsDto(journeyFilter).catch(() => ({ data: [] } as any)),
        salesInvoiceService.querySalesInvoicesDto(journeyFilter).catch(() => ({ data: [] } as any)),
        // PaymentRequest có thể không link trực tiếp journey_id (nó link qua payment_milestone_id).
        // Filter ở step kế bằng cách check milestones.
        paidRequestsPromise,
        stockOrderService.queryStockOrdersDto(journeyFilter).catch(() => ({ data: [] } as any)),
        paymentMilestoneService.queryPaymentMilestonesDto(journeyFilter).catch(() => ({ data: [] } as any)),
        journeyEstimateService.queryJourneyEstimatesDto(buildFilter({
            where: [
                { id: 'journey_id', value: journeyId },
                { id: 'status', value: 'approved' },
            ],
            sortBy: [{ id: 'version_no', desc: true }],
            limit: 1,
        })).catch(() => ({ data: [] } as any)),
        quotationService.queryQuotationsDto(buildFilter({
            where: [
                { id: 'journey_id', value: journeyId },
                { id: 'status', value: 'approved' },
            ],
            sortBy: [{ id: 'version_no', desc: true }],
            limit: 1,
        })).catch(() => ({ data: [] } as any)),
    ]);

    const receipts: IPaymentReceipt[] = receiptsRes?.data ?? [];
    const invoices: ISalesInvoice[] = invoicesRes?.data ?? [];
    const allPaidRequests: IPaymentRequest[] = requestsRes?.data ?? [];
    const stockOrders: IStockOrder[] = stockOrdersRes?.data ?? [];
    const milestones: IPaymentMilestone[] = milestonesRes?.data ?? [];
    const estimate: IJourneyEstimate | null = estimatesRes?.data?.[0] ?? null;
    const contract: IQuotation | null = quotationsRes?.data?.[0] ?? null;

    // Filter PaymentRequest về journey: link qua payment_milestone_id ∈ milestones.
    const milestoneIds = new Set(milestones.map(m => m._id));
    const requests = allPaidRequests.filter(r =>
        r.payment_milestone_id && milestoneIds.has(r.payment_milestone_id)
    );

    /* ─── Aggregations ─────────────────────────────────────── */

    const contract_value = (contract?.total as number)
        ?? (contract?.subtotal as number)
        ?? 0;
    const total_milestones = milestones.reduce((s, m) => s + (m.amount ?? 0), 0);
    const revenue_received = receipts.reduce((s, r) => s + (r.amount_received ?? 0), 0);
    const revenue_invoiced = invoices
        .filter(inv => inv.invoice_status === 'issued' || inv.invoice_status === 'sent')
        .reduce((s, inv) => s + (inv.total_amount ?? 0), 0);
    const receivable_outstanding = Math.max(0, total_milestones - revenue_received);

    const cost_planned = estimate?.total_estimate_cost ?? 0;
    const cost_material_actual = sumStockOrderActualCost(stockOrders);
    const cost_payment_paid = requests.reduce((s, r) => s + (r.amount ?? 0), 0);
    const cost_actual = cost_material_actual + cost_payment_paid;

    const gross_margin = revenue_received - cost_actual;
    const gross_margin_pct = revenue_received > 0
        ? (gross_margin / revenue_received) * 100
        : 0;
    const cost_variance = cost_actual - cost_planned;
    const cost_variance_pct = cost_planned > 0
        ? (cost_variance / cost_planned) * 100
        : 0;

    return {
        contract_value,
        total_milestones,
        revenue_received,
        revenue_invoiced,
        receivable_outstanding,
        cost_planned,
        cost_material_actual,
        cost_payment_paid,
        cost_actual,
        gross_margin,
        gross_margin_pct,
        cost_variance,
        cost_variance_pct,
        receipts,
        invoices,
        requests,
        stockOrders,
        estimate,
        contract,
        milestones,
    };
}

/**
 * Format VND with thousand separators + currency suffix.
 */
export const fmtVND = (n: number | undefined | null): string =>
    `${(n ?? 0).toLocaleString('vi-VN')}đ`;

/**
 * Format percentage with one decimal point.
 */
export const fmtPct = (n: number | undefined | null): string =>
    `${(n ?? 0).toFixed(1)}%`;
