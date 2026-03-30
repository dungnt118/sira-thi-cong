import { useSubscription } from '@apollo/client/react';
import { ACCESS_TOKEN, get } from 'app/services/storeService';
import type { RootState } from 'app/store';
import { add_notify_message } from 'app/store/actions/subscribe/notifyEvents.action';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationMessage } from 'types/subscribe.types';

// Định nghĩa type cho subscription response
// Định nghĩa payload trả về từ subscription
interface NotificationPayload {
    response: NotificationMessage;
}

// Định nghĩa type cho props của component
interface SubscriptionProviderProps { children?: React.ReactNode }

// Định nghĩa type cho user data từ Redux state
interface UserData {
    user: any;
    info: any;
    permissions: any[];
    [key: string]: any;
}

const NOTIFICATION_SUBCRIBE = gql`
subscription UserNotification($token:String){
    response:user_notification(token:$token){
      data
      at
      subject
      body
      sender
      messageType
      regCode
      receiver
      actions
      type
    }
  }
`;

export default function SubscriptionProvider({ children }: SubscriptionProviderProps) {
    const access_token = get(ACCESS_TOKEN);
    const dispatch = useDispatch();

    // Lấy thông tin user từ Redux state với type safety
    const userData = useSelector((state: RootState) => state.auth?.user?.data as UserData | undefined);

    // Kiểm tra cả access token và user data để đảm bảo user đã đăng nhập
    const isUserLoggedIn = Boolean(access_token && userData && userData.user);
    
    useSubscription(NOTIFICATION_SUBCRIBE, {
        variables: { token: access_token },
        shouldResubscribe: true,
        skip: !isUserLoggedIn, // chỉ subscribe khi user đã đăng nhập hoàn toàn

        onData(e) {
            console.log({ subscriptionData: e })
            const d: any = (e as any).data;
            if (d?.data?.response) {
                const message: NotificationMessage = d.data.response;
                dispatch(add_notify_message(message));
            }

        },
        onComplete() {
            console.log("Subscription completed");
        },
        onError(error: unknown) {
            console.error("Subscription error:", error);
        },
    });

    return (
        <React.Fragment>{children}</React.Fragment>
    );
}
