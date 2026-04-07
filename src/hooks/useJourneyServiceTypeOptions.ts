import masterDataCategoryService from '@/services/core-contracts/services/masterDataCategory.service';
import masterDataItemService from '@/services/core-contracts/services/masterDataItem.service';
import type { IMasterDataItem } from '@/services/core-contracts/types/masterDataItem.types';
import { AND_OR, ConditionPropType, FilterOperation } from '@/types/filters/GroupQueryFilter';
import { useEffect, useState } from 'react';

export interface JourneyServiceTypeOption {
  label: string;
  value: string;
  item: IMasterDataItem;
}

const SERVICE_TYPE_CATEGORY_CODE = 'service_type';

export const useJourneyServiceTypeOptions = () => {
  const [serviceTypeOptions, setServiceTypeOptions] = useState<JourneyServiceTypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const categoryResponse = await masterDataCategoryService.queryContent({
          limit: 1,
          group: {
            op: AND_OR.AND,
            children: [
              {
                id: 'code',
                operation: FilterOperation.EQUAL,
                value: SERVICE_TYPE_CATEGORY_CODE,
                propType: ConditionPropType.PROPTYPE_TEXT,
                children: []
              },
            ],
          },
        });

        const categoryId = categoryResponse.data?.[0]?._id;
        if (!categoryId) {
          if (isMounted) setServiceTypeOptions([]);
          return;
        }

        const itemResponse = await masterDataItemService.queryContent({
          limit: 100,
          sorted: [{ id: 'sortOrder', desc: false }],
          group: {
            op: AND_OR.AND,
            children: [
              {
                id: 'categoryId',
                operation: FilterOperation.EQUAL,
                value: categoryId,
                propType: ConditionPropType.PROPTYPE_OBJECTID,
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
          value: item._id,
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
