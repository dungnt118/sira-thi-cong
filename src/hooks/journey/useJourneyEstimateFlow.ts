import { useState, useEffect, useCallback } from 'react';
import { journeyEstimateService } from 'services/core-contracts/services/journeyEstimate.service';
import { journeyService } from 'services/core-contracts/services/journey.service';
import { IJourney } from 'services/core-contracts/types/journey.types';
import { IJourneyEstimate, IStandardizedBucketsItem } from 'services/core-contracts/types/journeyEstimate.types';
import { message } from 'antd';

export const useJourneyEstimateFlow = (journeyId: string) => {
  const [journey, setJourney] = useState<IJourney | null>(null);
  const [estimate, setEstimate] = useState<IJourneyEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!journeyId) return;
    setLoading(true);
    try {
      // 1. Fetch Journey Data
      const jData = await journeyService.findContent(journeyId);
      setJourney(jData);

      // 2. Fetch Latest JourneyEstimate for this journey
      const eResponse = await journeyEstimateService.queryContent({
        group: {
          op: 'AND',
          children: [{ id: 'journey_id', operation: '==', value: journeyId, children: [] }]
        },
        sorted: [{ id: 'createdTime', desc: true }],
        limit: 1
      });

      if (eResponse.data && eResponse.data.length > 0) {
        setEstimate(eResponse.data[0]);
      } else {
        setEstimate(null);
      }
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
          status: 'draft'
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
    if (journey?.area_m2) score += 20;
    if (journey?.execution_days) score += 20;
    if (journey?.complexity_level) score += 20;
    if (estimate?.standardized_buckets && estimate.standardized_buckets.length > 0) score += 40;
    return score;
  };

  return {
    journey,
    estimate,
    loading,
    saveEstimate,
    refresh: fetchData,
    readinessScore: getReadinessScore()
  };
};
