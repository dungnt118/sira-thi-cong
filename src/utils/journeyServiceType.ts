import type { IndexedContentItem } from '@/types/apis';

type IndexedContentLike = Partial<IndexedContentItem> & {
  label?: string;
  name?: string;
  primary_text?: string;
  value?: string;
};

export interface JourneyServiceLike {
  idx_serviceTypeId?: IndexedContentLike | null;
  requested_service?: string | null;
  service_type?: string | null;
}

export const getIndexedContentLabel = (item?: IndexedContentLike | null): string => {
  if (!item) return '';
  return item.title || item.display_name || item.primary_text || item.label || item.name || item.value || item.code || '';
};

export const getJourneyServiceLabel = (journey?: JourneyServiceLike | null, fallback: string = ''): string => {
  if (!journey) return fallback;
  return getIndexedContentLabel(journey.idx_serviceTypeId) || journey.service_type || journey.requested_service || fallback;
};
