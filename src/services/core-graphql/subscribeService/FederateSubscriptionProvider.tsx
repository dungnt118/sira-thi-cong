import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import type { OnDataOptions } from '@apollo/client/react';
import { useSubscription } from '@apollo/client/react';
import { getMainDefinition } from '@apollo/client/utilities';
import { ACCESS_TOKEN, FEDERATE_SUBSCRIBE_HOST, IS_FEDERATE_SUBSCRIBE, get } from 'app/services/storeService';
import { add_notify_message } from 'app/store/actions/subscribe/notifyEvents.action';
import gql from 'graphql-tag';
import { ClientOptions, createClient } from 'graphql-ws';
import React from 'react';
import { useDispatch } from 'react-redux';
import { FederateNotificationResponse } from 'types/subscribe.types';

const SUBCRIBE = gql`
subscription FederateNotification($token:String){
    response:subscribe_federate_notification(token:$token){
      data
      at
      subject
      body
      sender
      messageType
      registationCode
      receiver
      actions
      type
    }
  }
`;

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'cache-and-network' as const,
        errorPolicy: 'ignore' as const,
    },
    query: {
        fetchPolicy: 'no-cache' as const, //'cache-first' | 'network-only':se van luu va update cache | 'cache-only' | 'no-cache' | 'standby'
        errorPolicy: 'ignore' as const,
    },
};

interface FederateSubscriptionProviderProps {
    children?: React.ReactNode;
}

interface SubscriptionData {
    response: FederateNotificationResponse;
}

export default function FederateSubscriptionProvider(props: FederateSubscriptionProviderProps) {
    const dispatch = useDispatch();

    const federateHost = get(FEDERATE_SUBSCRIBE_HOST) as string | undefined;
    const is_federate = get(IS_FEDERATE_SUBSCRIBE) as boolean | undefined;
    const access_token = get(ACCESS_TOKEN) as string | undefined;

    // Create WS client lazily only after login and when federate enabled
    const client = React.useMemo(() => {
        if (!(is_federate && federateHost?.startsWith('ws') && access_token)) return undefined;
        if (typeof window === 'undefined') {
            return undefined;
        }

        try {
            const clientOptions: ClientOptions = {
                url: federateHost,
                lazy: true,
                retryAttempts: Infinity,
                shouldRetry: () => true,
                connectionParams: () => ({
                    authorization: `Bearer ${get(ACCESS_TOKEN)}`
                })
            };

            const wsLink = new GraphQLWsLink(createClient(clientOptions));

            const link = split(
                ({ query }) => {
                    const definition = getMainDefinition(query);
                    return (
                        definition.kind === 'OperationDefinition' &&
                        definition.operation === 'subscription'
                    );
                },
                wsLink
            );

            return new ApolloClient({
                link,
                cache: new InMemoryCache({
                    typePolicies: {
                        Query: {
                            fields: {
                                // Có thể thêm field policies nếu cần
                            }
                        }
                    }
                }),
                defaultOptions,
            });
        } catch (error) {
            console.error('Federate WS init error:', error);
            return undefined;
        }
    }, [is_federate, federateHost, access_token]);

    const { data, loading } = useSubscription<SubscriptionData>(
        SUBCRIBE,
        {
            variables: { token: access_token },
            client,
            shouldResubscribe: true,
            skip: !(client && access_token),
            onData: ({ data: subscriptionResult }: OnDataOptions<SubscriptionData>) => {
                const payload = subscriptionResult?.data?.response;
                if (payload) {
                    dispatch(add_notify_message(payload as any));
                }
            }
        }
    );

    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    );
}
