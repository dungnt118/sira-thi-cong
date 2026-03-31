import elsagaService from '@/services/authenticationService';
import type { AppThunk } from 'app/store';
import { hideLoading, showLoading } from 'app/store/actions/fuse/loading.action';
import moment from 'moment';
import type { OAuthClientConfig } from 'types/auth/OAuthClientConfig';
import { loadUserData } from './user.actions';

export const LOGIN_ERROR = 'LOGIN_ERROR' as const;
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS' as const;

interface SubmitLoginParams {
  email: string;
  password: string;
  client: OAuthClientConfig;
}

export const submitLogin = ({
  email,
  password,
  client,
}: SubmitLoginParams): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(showLoading('Đang đăng nhập...'));
  const closeLoading = () => {
    dispatch(hideLoading());
  };

  try {
    await elsagaService.signInWithEmailAndPassword(email, password, client, closeLoading);

    await dispatch(loadUserData());
    dispatch(hideLoading());
    dispatch({
      type: LOGIN_SUCCESS,
    });
  } catch (error) {
    dispatch(hideLoading());
    dispatch({
      type: LOGIN_ERROR,
      payload: error,
    });
  }
};

export const renewToken = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(showLoading('Đang gia hạn phiên...'));
  //đang phát triển
};

export const updateToken = (token: string): void => {
  localStorage.setItem('access_token', token);
  const expiresAt = moment().add(1, 'days').toDate();
  localStorage.setItem('expires_at', expiresAt.toString());
};
