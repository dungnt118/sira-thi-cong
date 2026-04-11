import { useState, useEffect } from 'react';
import { portalThreadService } from '../services/core-contracts/services/portalThread.service';
import { portalMessageService } from '../services/core-contracts/services/portalMessage.service';
import { IPortalThread } from '../services/core-contracts/types/portalThread.types';
import { IPortalMessage } from '../services/core-contracts/types/portalMessage.types';

export const usePortalThreads = (journeyId?: string) => {
    const [threads, setThreads] = useState<IPortalThread[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const refetch = async () => {
        if (!journeyId) {
            setThreads([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await portalThreadService.queryPortalThreadsDto({
                group: { id: 'journey_id', operation: 'eq', value: journeyId },
                limit: 100
            } as any);
            setThreads(response.data || []);
        } catch (err) {
            console.error('Portal threads fetch error:', err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refetch();
    }, [journeyId]);

    return { threads, isLoading, error, refetch };
};

export const usePortalThreadDetail = (threadId?: string) => {
    const [thread, setThread] = useState<IPortalThread | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const refetch = async () => {
        if (!threadId) {
            setThread(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await portalThreadService.findPortalThreadDto(threadId);
            setThread(response);
        } catch (err) {
            console.error('Portal thread detail fetch error:', err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refetch();
    }, [threadId]);

    return { thread, isLoading, error, refetch };
};

export const usePortalMessages = (threadId?: string) => {
    const [messages, setMessages] = useState<IPortalMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const refetch = async () => {
        if (!threadId) {
            setMessages([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await portalMessageService.queryPortalMessagesDto({
                group: { id: 'thread_id', operation: 'eq', value: threadId },
                limit: 100
            } as any);
            setMessages(response.data || []);
        } catch (err) {
            console.error('Portal messages fetch error:', err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refetch();
    }, [threadId]);

    return { messages, isLoading, error, refetch };
};
