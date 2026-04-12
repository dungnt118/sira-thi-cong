import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { journeyEstimateService } from '../services/core-contracts/services/journeyEstimate.service';
import { IJourneyEstimate, IStandardizedBucketsItem } from '../services/core-contracts/types/journeyEstimate.types';
import { IJourney } from '../services/core-contracts/types/journey.types';
import journeyService from '../services/core-contracts/services/journey.service';

const DEFAULT_BUCKETS: IStandardizedBucketsItem[] = [
    { bucket_code: '01_materials', bucket_name: 'Vật tư', rate_pct: 0, amount: 0, sort_order: 1 },
    { bucket_code: '02_labor_total', bucket_name: 'Nhân công', rate_pct: 0, amount: 0, sort_order: 2 },
    { bucket_code: '03_warranty_maintenance', bucket_name: 'Bảo hành & Bảo trì', rate_pct: 5, amount: 0, sort_order: 3 },
    { bucket_code: '04_risk', bucket_name: 'Dự phòng rủi ro', rate_pct: 3, amount: 0, sort_order: 4 },
    { bucket_code: '05_corporate_tax', bucket_name: 'Thuế TNDN', rate_pct: 2, amount: 0, sort_order: 5 },
    { bucket_code: '09_profit', bucket_name: 'Lợi nhuận mục tiêu', rate_pct: 15, amount: 0, sort_order: 6 },
];

export const useJourneyEstimateFlow = (journeyId: string) => {
    const [estimate, setEstimate] = useState<IJourneyEstimate | null>(null);
    const [journey, setJourney] = useState<IJourney | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        if (!journeyId) return;
        setLoading(true);
        try {
            // 1. Fetch Journey
            const j = await journeyService.findJourneyDto(journeyId);
            setJourney(j);

            // 2. Fetch or Create Estimate
            const res = await journeyEstimateService.queryJourneyEstimatesDto({
                group: { id: 'journey_id', operation: '==', value: journeyId }
            } as any);

            if (res.data && res.data.length > 0) {
                setEstimate(res.data[0]);
            } else {
                // Initialize new estimate with snapshot from journey
                const newEstimate = await journeyEstimateService.createJourneyEstimate({
                    journey_id: journeyId,
                    status: 'draft',
                    version_no: 1,
                    journey_input_snapshot: {
                        service_type_id: j.serviceTypeId,
                        area_m2: j.area_m2 || 0,
                        execution_days: j.execution_days || 0,
                        project_complexity_factor: j.complexity_level === 'standard' ? 1 : (j.complexity_level === 'difficult' ? 1.2 : 1.5)
                    },
                    standardized_buckets: DEFAULT_BUCKETS
                });
                setEstimate(newEstimate);
            }
        } catch (error) {
            console.error('Failed to load journey estimate:', error);
            message.error('Không thể tải dữ liệu dự toán');
        } finally {
            setLoading(false);
        }
    }, [journeyId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const updateBuckets = async (buckets: IStandardizedBucketsItem[]) => {
        if (!estimate) return;
        try {
            const updated = await journeyEstimateService.updateJourneyEstimate(estimate._id, {
                standardized_buckets: buckets
            });
            setEstimate(updated);
            message.success('Đã cập nhật các hạng mục dự toán');
        } catch (error) {
            message.error('Lỗi khi cập nhật hạng mục');
        }
    };

    const calculateQuickQuote = async () => {
        if (!estimate || !journey) return;
        // This will be expanded in Phase 3
        message.loading('Đang tính toán báo giá nhanh...');
        try {
            // logic to call backend or local calculation
            // For now, stub
        } catch (error) {
            message.error('Lỗi tính toán');
        }
    };

    return {
        estimate,
        journey,
        loading,
        refresh: loadData,
        updateBuckets,
        calculateQuickQuote
    };
};
