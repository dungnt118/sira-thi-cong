import jwtService from 'app/services/jwtService';
import type { AppThunk } from 'app/store';
import { showMessage } from 'app/store/actions/fuse/message.actions';
import * as UserActions from './user.actions';

export const REGISTER_ERROR = 'REGISTER_ERROR' as const;
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS' as const;

export interface RegisterSuccessAction {
    type: typeof REGISTER_SUCCESS;
}

export interface RegisterErrorAction {
    type: typeof REGISTER_ERROR;
    payload: any;
}

export type RegisterActions = RegisterSuccessAction | RegisterErrorAction;

export function submitRegister({ displayName, password, email }: any): AppThunk {
    return (dispatch) =>
        jwtService.createUser({
            displayName,
            password,
            email
        })
            .then((user: any) => {
                dispatch(UserActions.setUserData(user));
                return dispatch({
                    type: REGISTER_SUCCESS
                });
            }
            )
            .catch((error: any) => {
                return dispatch({
                    type: REGISTER_ERROR,
                    payload: error
                });
            });
}

export function registerWithFirebase(model: any): AppThunk {
    const { email, password, displayName } = model;
    return (dispatch) =>
        // @ts-ignore
        import('app/services/firebaseService').then(({ default: firebaseService }) => {
            if (firebaseService && firebaseService.auth) {
                return firebaseService.auth.createUserWithEmailAndPassword(email, password)
                    .then((response: any) => {
                        dispatch(UserActions.update_user_field({
                            user: {
                                ...response.user,
                                displayName,
                                email
                            }
                        }));

                        return dispatch({
                            type: REGISTER_SUCCESS
                        });
                    })
                    .catch((error: any) => {
                        const usernameErrorCodes = [
                            'auth/operation-not-allowed',
                            'auth/user-not-found',
                            'auth/user-disabled'
                        ];

                        const emailErrorCodes = [
                            'auth/email-already-in-use',
                            'auth/invalid-email'
                        ];

                        const passwordErrorCodes = [
                            'auth/weak-password',
                            'auth/wrong-password'
                        ];

                        const response = {
                            email: emailErrorCodes.includes(error.code) ? error.message : null,
                            displayName: usernameErrorCodes.includes(error.code) ? error.message : null,
                            password: passwordErrorCodes.includes(error.code) ? error.message : null
                        };

                        if (error.code === 'auth/invalid-api-key') {
                            dispatch(showMessage({ message: error.message }));
                        }

                        return dispatch({
                            type: REGISTER_ERROR,
                            payload: response
                        });
                    });
            }
        });
}
