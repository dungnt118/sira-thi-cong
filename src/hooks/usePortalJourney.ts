import { useState, useEffect } from 'react';
import { journeyService } from '../services/core-contracts/services/journey.service';
import { IJourney } from '../services/core-contracts/types/journey.types';

export const usePortalJourney = (portalKey?: string) => {
    const [journey, setJourney] = useState<IJourney | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!portalKey) {
            setJourney(null);
            return;
        }

        const fetchJourney = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch directly by ID using findJourneyDto
                const response = await journeyService.findJourneyDto(portalKey);
                if (response) {
                    setJourney(response);
                } else {
                    setJourney(null);
                }
            } catch (err) {
                console.error('Portal journey fetch error:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchJourney();
    }, [portalKey]);

    return { journey, isLoading, error };
};
