import { useState, useCallback, useEffect } from 'react';
import { quotationLineItemService } from '../services/core-contracts/services/quotationLineItem.service';
import { stockOrderService } from '../services/core-contracts/services/stockOrder.service';
import { workTaskService } from '../services/core-contracts/services/workTask.service';
import { AND_OR } from '../types/filters/GroupQueryFilter';

export interface SettlementSummary {
    totalRevenue: number;
    totalCost: number;
    marginAmount: number;
    marginPercent: number;
    items: SettlementItem[];
    laborTasks: SettlementLaborTask[];
}

export interface SettlementItem {
    id: string;
    name: string;
    unit: string;
    quotedQuantity: number;
    quotedPrice: number;
    actualQuantity: number;
    actualUnitCost: number;
    variance: number; // actual - quoted
}

export interface SettlementLaborTask {
    id: string;
    name: string;
    quotedAmount: number;
    actualAmount: number;
}

export const useJourneySettlement = (journeyId: string) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<SettlementSummary | null>(null);

    const fetchSettlementData = useCallback(async () => {
        if (!journeyId) return;
        setLoading(true);
        try {
            // 1. Fetch Quotation items (Approved/Final)
            const quoteRes = await quotationLineItemService.queryContent({
                group: {
                    op: AND_OR.AND,
                    children: [
                        { id: 'journey_id', operation: '==', value: journeyId, children: [] }
                    ]
                },
                limit: 100
            });

            // 2. Fetch Actual Consumption (StockOrder items)
            const stockRes = await stockOrderService.queryContent({
                group: {
                    op: AND_OR.AND,
                    children: [
                        { id: 'journey_id', operation: '==', value: journeyId, children: [] },
                        { id: 'status', operation: '==', value: 'completed', children: [] }
                    ]
                },
                limit: 100
            });

            // 3. Fetch Labor (WorkTask)
            const laborRes = await workTaskService.queryContent({
                group: {
                    op: AND_OR.AND,
                    children: [
                        { id: 'journey_id', operation: '==', value: journeyId, children: [] }
                    ]
                },
                limit: 100
            });

            const quoteItems = quoteRes.data || [];
            const stockOrders = stockRes.data || [];
            const laborTasksData = laborRes.data || [];

            // Aggregate costs
            let totalRevenue = 0;
            let totalCost = 0;
            const settlementItems: SettlementItem[] = [];

            // Map quote items first
            quoteItems.forEach((q: any) => {
                totalRevenue += (q.quantity || 0) * (q.unit_price || 0);
                settlementItems.push({
                    id: q._id,
                    name: q.name || q.item_name,
                    unit: q.unit,
                    quotedQuantity: q.quantity || 0,
                    quotedPrice: q.unit_price || 0,
                    actualQuantity: 0,
                    actualUnitCost: 0,
                    variance: 0
                });
            });

            // Aggregate actuals from stock
            stockOrders.forEach((order: any) => {
                (order.items || []).forEach((item: any) => {
                    const cost = (item.issued_quantity || 0) * (item.unit_cost || 0);
                    totalCost += cost;

                    // Match with quote item if possible (simplified by name/material_id)
                    const existing = settlementItems.find(si => si.name === item.material_name);
                    if (existing) {
                        existing.actualQuantity += item.issued_quantity || 0;
                        existing.actualUnitCost = item.unit_cost || 0; 
                    } else {
                        // Unquoted item (Budget over)
                        settlementItems.push({
                            id: item.material_id || Math.random().toString(),
                            name: item.material_name,
                            unit: item.unit,
                            quotedQuantity: 0,
                            quotedPrice: 0,
                            actualQuantity: item.issued_quantity || 0,
                            actualUnitCost: item.unit_cost || 0,
                            variance: item.issued_quantity || 0
                        });
                    }
                });
            });

            // Update variance for all items
            settlementItems.forEach(item => {
                item.variance = item.actualQuantity - item.quotedQuantity;
            });

            // Aggregate labor
            const laborTasks: SettlementLaborTask[] = laborTasksData.map((t: any) => {
                const actual = t.cost_amount || 0;
                totalCost += actual;
                return {
                    id: t._id,
                    name: t.name,
                    quotedAmount: 0,
                    actualAmount: actual
                };
            });

            const marginAmount = totalRevenue - totalCost;
            const marginPercent = totalRevenue > 0 ? (marginAmount / totalRevenue) * 100 : 0;

            setSummary({
                totalRevenue,
                totalCost,
                marginAmount,
                marginPercent,
                items: settlementItems,
                laborTasks
            });

        } catch (error) {
            console.error('Settlement fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [journeyId]);

    useEffect(() => {
        fetchSettlementData();
    }, [fetchSettlementData]);

    return {
        loading,
        summary,
        refresh: fetchSettlementData
    };
};
