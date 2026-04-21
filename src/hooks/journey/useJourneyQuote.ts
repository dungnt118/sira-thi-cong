import { useState, useCallback, useEffect } from 'react';
import { masterDataItemService } from '../../services/core-contracts/services/masterDataItem.service';
import { message } from 'antd';
import { quotationService } from '../../services/core-contracts/services/quotation.service';
import { quotationLineItemService } from '../../services/core-contracts/services/quotationLineItem.service';
import { journeyEstimateService } from '../../services/core-contracts/services/journeyEstimate.service';
import { 
  IQuotation, 
  ICreateQuotationInput 
} from '../../services/core-contracts/types/quotation.types';
import { 
  IQuotationLineItem, 
  ICreateQuotationLineItemInput 
} from '../../services/core-contracts/types/quotationLineItem.types';
import { AND_OR } from '../../types/filters/GroupQueryFilter';

export const useJourneyQuote = (journeyId: string) => {
  const [quotation, setQuotation] = useState<IQuotation | null>(null);
  const [lineItems, setLineItems] = useState<IQuotationLineItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuoteData = useCallback(async () => {
    if (!journeyId) return;
    setLoading(true);
    try {
      // 1. Fetch Quotation
      const qResponse = await quotationService.queryContent({
        group: {
          op: AND_OR.AND,
          children: [{ id: 'journey_id', operation: '==', value: journeyId, children: [] }]
        },
        limit: 1
      });

      const q = qResponse.data?.[0] || null;
      setQuotation(q);

      if (q) {
        // 2. Fetch Line Items
        const lResponse = await quotationLineItemService.queryContent({
          group: {
            op: AND_OR.AND,
            children: [{ id: 'quotation_id', operation: '==', value: q._id, children: [] }]
          },
          limit: 100
        });
        setLineItems(lResponse.data || []);
      } else {
        setLineItems([]);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      message.error('Không thể tải dữ liệu báo giá');
    } finally {
      setLoading(false);
    }
  }, [journeyId]);

  useEffect(() => {
    fetchQuoteData();
  }, [fetchQuoteData]);

  const saveQuotationAndItems = async (qInput: Partial<ICreateQuotationInput>, items: ICreateQuotationLineItemInput[]) => {
    setLoading(true);
    try {
      let qId = quotation?._id;

      // 1. Create/Update Quotation
      if (qId) {
        await quotationService.updateQuotation(qId, qInput);
      } else {
        const newQ = await quotationService.createQuotation({
          ...qInput,
          journey_id: journeyId,
          status: 'draft'
        });
        qId = newQ._id;
      }

      // 2. Clear old items (for simplicity in this POC, or we could update existing)
      if (quotation?._id) {
         const oldItems = await quotationLineItemService.queryContent({
            group: {
                op: AND_OR.AND,
                children: [{ id: 'quotation_id', operation: '==', value: qId, children: [] }]
            }
         });
         if (oldItems.data?.length) {
            await quotationLineItemService.deleteMultiQuotationLineItem(oldItems.data.map(i => i._id));
         }
      }

      // 3. Create new items
      const itemsToSave = items.map(i => ({ ...i, quotation_id: qId }));
      await quotationLineItemService.saveManyQuotationLineItems(itemsToSave);

      message.success('Đã lưu báo giá thành công');
      await fetchQuoteData();
    } catch (error) {
      console.error('Error saving quote:', error);
      message.error('Lỗi khi lưu báo giá');
    } finally {
      setLoading(false);
    }
  };


  const syncFromEstimate = async () => {
    setLoading(true);
    try {
        // 1. Fetch the JourneyEstimate
        const eResponse = await journeyEstimateService.queryJourneyEstimatesDto({
            group: {
                op: AND_OR.AND,
                children: [{ id: 'journey_id', operation: '==', value: journeyId, children: [] }]
            },
            limit: 1
        });

        const estimate = eResponse.data?.[0];
        if (!estimate) {
            message.warning('Không tìm thấy dự toán kỹ thuật để tổng hợp');
            return;
        }

        const targetTotal = estimate.applied_quote_value || estimate.total_estimate_cost || 0;
        const groups = estimate.direct_cost_groups || [];
        
        // 2. Group components by quote_category_id and sum costs
        const categoryMap: Record<string, number> = {};
        let uncategorizedTotal = 0;

        groups.forEach((group: any) => {
            const components = group.components || [];
            components.forEach((comp: any) => {
                const cost = comp.line_total || 0;
                const catId = comp.quote_category_id;
                if (catId) {
                    categoryMap[catId] = (categoryMap[catId] || 0) + cost;
                } else {
                    uncategorizedTotal += cost;
                }
            });
        });

        const baseTotal = Object.values(categoryMap).reduce((a, b) => a + b, 0) + uncategorizedTotal;
        
        if (baseTotal === 0 && targetTotal > 0) {
             setLineItems([{
                item_name: 'Gói thầu thi công cải tạo (Tổng hợp)',
                unit: 'Gói',
                quantity: 1,
                unit_price: targetTotal,
                line_total: targetTotal,
                note: 'Tổng hợp từ dự toán kỹ thuật'
            }]);
            return;
        }

        if (baseTotal === 0) {
            message.warning('Dự toán chưa có dữ liệu chi phí chi tiết');
            return;
        }

        // 3. Fetch MasterDataItem details for categories
        const categoryIds = Object.keys(categoryMap);
        let categories: Record<string, string> = {};
        
        if (categoryIds.length > 0) {
            const catResponse = await masterDataItemService.queryContent({
                filter: {
                    group: {
                        op: AND_OR.AND,
                        children: [
                            { id: '_id', operation: 'in', value: categoryIds, children: [] }
                        ]
                    }
                }
            });
            catResponse.data?.forEach(item => {
                categories[item._id] = item.label;
            });
        }

        // 4. Calculate ratio and generate newItems
        const ratio = targetTotal / baseTotal;
        let newItems: any[] = [];

        // Add categorized items
        categoryIds.forEach(catId => {
            const allocatedTotal = Math.round(categoryMap[catId] * ratio);
            newItems.push({
                item_name: categories[catId] || 'Hạng mục không tên',
                unit: 'Lô',
                quantity: 1,
                unit_price: allocatedTotal,
                line_total: allocatedTotal,
                note: `Tổng hợp từ dự toán kỹ thuật - ${categories[catId] || catId}`
            });
        });

        // Add uncategorized item if exists
        if (uncategorizedTotal > 0) {
            const allocatedTotal = Math.round(uncategorizedTotal * ratio);
            newItems.push({
                item_name: 'Các hạng mục khác',
                unit: 'Lô',
                quantity: 1,
                unit_price: allocatedTotal,
                line_total: allocatedTotal,
                note: 'Các chi phí chưa được phân loại hạng mục báo giá'
            });
        }

        // 5. Handle rounding correction
        const currentSum = newItems.reduce((sum, item) => sum + (item.line_total || 0), 0);
        const diff = targetTotal - currentSum;
        if (diff !== 0 && newItems.length > 0) {
            newItems[newItems.length - 1].line_total += diff;
            newItems[newItems.length - 1].unit_price = newItems[newItems.length - 1].line_total;
        }

        setLineItems(newItems);
        message.info(`Đã tổng hợp ${newItems.length} hạng mục báo giá. Tổng: ${new Intl.NumberFormat('vi-VN').format(targetTotal)}đ`);

    } catch (error) {
        console.error('Error syncing estimate:', error);
        message.error('Lỗi khi đồng bộ từ dự toán');
    } finally {
        setLoading(false);
    }
  };

  return {
    quotation,
    lineItems,
    loading,
    saveQuotationAndItems,
    syncFromEstimate,
    refresh: fetchQuoteData
  };
};
