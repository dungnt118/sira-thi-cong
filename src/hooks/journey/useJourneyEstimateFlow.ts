import { useState, useEffect, useCallback } from 'react';
import { journeyEstimateService } from 'services/core-contracts/services/journeyEstimate.service';
import { journeyService } from 'services/core-contracts/services/journey.service';
import { IJourney } from 'services/core-contracts/types/journey.types';
import { IJourneyEstimate } from 'services/core-contracts/types/journeyEstimate.types';
import { message } from 'antd';

export const useJourneyEstimateFlow = (journeyId: string) => {
  const [journey, setJourney]   = useState<IJourney | null>(null);
  const [estimate, setEstimate] = useState<IJourneyEstimate | null>(null);
  const [loading, setLoading]   = useState(false);

  const fetchData = useCallback(async () => {
    if (!journeyId) return;
    setLoading(true);
    try {
      const jData = await journeyService.findContent(journeyId);
      setJourney(jData);

      // Use the DTO query so nested fields (labor_breakdown, direct_cost_groups,
      // components, etc.) are returned with their full typed shape instead of
      // the opaque Dictionary scalar returned by query_content.
      const eResponse = await journeyEstimateService.queryJourneyEstimatesDto({
        group: {
          op: 'AND',
          children: [{ id: 'journey_id', operation: '==', value: journeyId, children: [] }],
        },
        sorted: [{ id: 'createdTime', desc: true }],
        limit: 1,
      } as any);

      setEstimate(eResponse?.data?.[0] ?? null);
    } catch (error) {
      console.error('Error fetching journey estimate data:', error);
      message.error('Không thể tải dữ liệu dự toán');
    } finally {
      setLoading(false);
    }
  }, [journeyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveEstimate = async (data: Partial<IJourneyEstimate>) => {
    try {
      setLoading(true);
      if (estimate?._id) {
        const updated = await journeyEstimateService.updateJourneyEstimate(estimate._id, data);
        setEstimate(updated);
      } else {
        const created = await journeyEstimateService.createJourneyEstimate({
          ...data,
          journey_id: journeyId,
          status: 'draft',
        });
        setEstimate(created);
      }
      message.success('Đã lưu dữ liệu dự toán');
    } catch (error) {
      console.error('Error saving estimate:', error);
      message.error('Lỗi khi lưu dự toán');
    } finally {
      setLoading(false);
    }
  };

  const getReadinessScore = () => {
    let score = 0;
    if (journey?.area_m2)        score += 20;
    if (journey?.execution_days) score += 20;
    if (journey?.complexity_level) score += 20;
    if (estimate?.standardized_buckets?.length) score += 40;
    return score;
  };

  return {
    journey,
    estimate,
    loading,
    saveEstimate,
    refresh: fetchData,
    readinessScore: getReadinessScore(),
  };
};
