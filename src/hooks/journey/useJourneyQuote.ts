import { useState, useCallback, useEffect } from 'react';
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
        const eResponse = await journeyEstimateService.queryContent({
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

        // Logic: Group components by their parent group if needed, or just list all unique material groups
        // Here we'll simplify: 1 group = 1 line item in quote
        const newItems: ICreateQuotationLineItemInput[] = ((estimate as any).groups || []).map((g: any) => {
            let total = 0;
            (g.components || []).forEach((c: any) => total += (c.quantity || 0) * (c.unitPrice || 0));
            
            return {
                item_name: g.name,
                unit: g.unit || 'Lô',
                quantity: g.quantity || 1,
                unit_price: Math.round(total / (g.quantity || 1)),
                line_total: total,
                note: g.notes
            };
        });

        setLineItems(newItems as any);
        message.info('Đã tổng hợp dữ liệu từ dự toán. Hãy kiểm tra lại đơn giá bán.');

    } catch (error) {
        console.error('Error syncing estimate:', error);
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
