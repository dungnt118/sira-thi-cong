import { useState, useEffect } from 'react';
import { portalDocumentService } from '../services/core-contracts/services/portalDocument.service';
import { IPortalDocument } from '../services/core-contracts/types/portalDocument.types';

export const usePortalDocuments = (journeyId?: string) => {
    const [documents, setDocuments] = useState<IPortalDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!journeyId) {
            setDocuments([]);
            return;
        }

        const fetchDocuments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await portalDocumentService.queryPortalDocumentsDto({
                    group: { id: 'journey_id', operation: 'eq', value: journeyId },
                    limit: 100
                    // sorted: [{ id: 'published_at', desc: true }] // Optional
                } as any);
                setDocuments(response.data || []);
            } catch (err) {
                console.error('Portal documents fetch error:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();
    }, [journeyId]);

    return { documents, isLoading, error };
};
