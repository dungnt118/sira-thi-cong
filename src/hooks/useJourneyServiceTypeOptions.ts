import masterDataItemService from '@/services/core-contracts/services/masterDataItem.service';
import type { IMasterDataItem } from '@/services/core-contracts/types/masterDataItem.types';
import { AND_OR, ConditionPropType, FilterOperation } from '@/types/filters/GroupQueryFilter';
import { useEffect, useState } from 'react';

export interface JourneyServiceTypeOption {
  label: string;
  value: string;
  item: IMasterDataItem;
}

const SERVICE_TYPE_CATEGORY = 'service_type';

export const useJourneyServiceTypeOptions = () => {
  const [serviceTypeOptions, setServiceTypeOptions] = useState<JourneyServiceTypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const itemResponse = await masterDataItemService.queryContent({
          limit: 100,
          sorted: [{ id: 'sortOrder', desc: false }],
          group: {
            op: AND_OR.AND,
            children: [
              {
                id: 'category',
                operation: FilterOperation.EQUAL,
                value: SERVICE_TYPE_CATEGORY,
                propType: ConditionPropType.PROPTYPE_TEXT,
                children: [],
              },
              {
                id: 'isActive',
                operation: FilterOperation.EQUAL,
                value: true,
                propType: ConditionPropType.PROPTYPE_BOOLEAN,
                children: [],
              },
            ],
          },
        });

        if (!isMounted) return;

        setServiceTypeOptions((itemResponse.data || []).map((item) => ({
          value: item.value || item._id,
          label: item.label || item.shortLabel || item.value || item._id,
          item,
        })));
      } catch (error) {
        console.error('Failed to load Journey service type options', error);
        if (isMounted) setServiceTypeOptions([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { serviceTypeOptions, isLoading };
};
