import { useEffect, useState } from 'react';
import { get, BASE_URL, REGCODE } from '@/services/storeService';

export interface JourneyServiceTypeOption {
  label: string;
  value: string;
  item: any;
}

export const useJourneyServiceTypeOptions = () => {
  const [serviceTypeOptions, setServiceTypeOptions] = useState<JourneyServiceTypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const baseUrl = get(BASE_URL);
        const resolvedBaseUrl = typeof baseUrl === 'string' && baseUrl ? baseUrl : window.location.origin;
        
        let url: URL;
        try {
            url = new URL('/api/apimodel/masterdata.get_service_types', resolvedBaseUrl);
        } catch {
            url = new URL('/api/apimodel/masterdata.get_service_types', window.location.origin);
        }
        
        const regCode = get(REGCODE);
        if (regCode) {
            url.searchParams.set('regCode', String(regCode));
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (!isMounted) return;

        if (result.code === 0 && Array.isArray(result.data)) {
            setServiceTypeOptions(result.data.map((item: any) => ({
              value: item.value,
              label: item.label,
              item: {
                  ...item,
                  _id: item.value // Mapping _id so CustomerPortalLanding gets it for serviceTypeId
              },
            })));
        } else {
             setServiceTypeOptions([]);
        }
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
