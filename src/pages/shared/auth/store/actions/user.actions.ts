import history from '@history';
import elsagaService from '@/services/authenticationService';
import * as graphqlService from 'app/services/graphqlService';
import { GET_USER_SESSION_INFO_QUERY } from 'app/services/storeService';
import type { AppThunk, RootState } from 'app/store';
import { hideLoading } from 'app/store/actions/fuse/loading.action';
import { showMessage } from 'app/store/actions/fuse/message.actions';
import {
  setFavoriteMenus,
  setFavoriteMenusForm,
  setNavigation,
  setNavigationList,
} from 'app/store/actions/fuse/navigation.actions';
import { setInitialSettings } from 'app/store/actions/fuse/settings.actions';
import type { NavigationItem } from 'app/store/types/fuse.types';
import gql from 'graphql-tag';
import { ApiResponseCode } from 'types/apis/ApiResponse';
import type { UserSessionContext } from 'types/auth/UserSessionContext';
import { BAC_USER_CLIENT_ID } from 'app/services/users/user.constants';
import { getCurrentRole, setUserData as persistUserData } from '@/utils/authUtils';

export const SET_USER_DATA = '[USER] SET DATA' as const;
export const REMOVE_USER_DATA = '[USER] REMOVE DATA' as const;
export const USER_LOGGED_OUT = '[USER] LOGGED OUT' as const;
export const REGISTER_DEVICE = '[USER] REGISTER DEVICE' as const;
export const UPDATE_USER_FIELD = '[USER] UPDATE FIELD' as const;

interface Auth0TokenMetadata {
  settings?: Record<string, unknown>;
  shortcuts?: string[];
  [key: string]: unknown;
}

interface Auth0TokenData {
  username: string;
  picture: string;
  email: string;
  user_metadata?: Auth0TokenMetadata;
  [key: string]: unknown;
}

interface SwitchAccountParams {
  tenantId?: string;
  role?: string;
}

export interface SetUserDataAction {
  type: typeof SET_USER_DATA;
  payload: UserSessionContext;
}

export interface RemoveUserDataAction {
  type: typeof REMOVE_USER_DATA;
}

export interface UserLoggedOutAction {
  type: typeof USER_LOGGED_OUT;
}

export interface UpdateUserFieldAction {
  type: typeof UPDATE_USER_FIELD;
  payload: Partial<UserSessionContext> | undefined;
}

export type UserActions =
  | SetUserDataAction
  | RemoveUserDataAction
  | UserLoggedOutAction
  | UpdateUserFieldAction;

type MaybeWrappedSession = UserSessionContext | { data?: UserSessionContext | null } | null | undefined;

const ensureNavigationArray = (items: unknown): NavigationItem[] => {
  if (Array.isArray(items)) {
    return items as NavigationItem[];
  }
  return [];
};

const extractSession = (payload: MaybeWrappedSession): UserSessionContext => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as { data?: UserSessionContext | null }).data;
    if (data) {
      return data;
    }
  }
  return (payload as UserSessionContext) ?? ({} as UserSessionContext);
};

export const setUserDataAuth0 = (tokenData: Auth0TokenData): AppThunk =>
  setUserData({
    user: {
      _id: (tokenData.sub ?? tokenData.username ?? '') as string,
      username: tokenData.username,
      userName: tokenData.username,
      avatar: tokenData.picture,
      email: tokenData.email,
      isActive: true,
    },
    settings: tokenData.user_metadata?.settings ?? {},
    shortcuts: tokenData.user_metadata?.shortcuts ?? [],
  } as UserSessionContext);

export const loadUserData = (roleOverride?: string): AppThunk<Promise<void>> => async (dispatch) => {
  try {
    const currentRole = roleOverride !== undefined ? roleOverride : getCurrentRole();
    const response = await graphqlService.query<UserSessionContext>(
      gql(GET_USER_SESSION_INFO_QUERY()),
      { role: currentRole },
      dispatch,
    );

    const session = response.data ?? null;
    console.log('Loaded user session:', session);

    if (session) {
      dispatch(setUserData(session));

      const pathname = history.location.pathname;
      
      let targetUrl = session.welcome_url ?? '/l/welcome';
      const context = (session.user as any)?.identity_contexts?.find((ctx: any) => ctx.clientId === BAC_USER_CLIENT_ID);
      const roles = context?.roles || (session.user as any)?.roles || [];
      const derivedRole = session.activeRole && session.activeRole.toLowerCase() !== 'guest' 
                          ? session.activeRole 
                          : (context?.defaultRole || roles[0] || 'guest');
                          
      if (!derivedRole || derivedRole.toLowerCase() === 'guest') {
          if (targetUrl === '/l/welcome' || targetUrl.toLowerCase().includes('guest')) {
              targetUrl = '/portal';
          }
      } else {
          if (targetUrl === '/l/welcome' || targetUrl.toLowerCase().includes('guest')) {
              targetUrl = `/${derivedRole.toLowerCase()}/dashboard`;
          }
      }

      if (pathname.startsWith('/login')) {
        const searchParams = new URLSearchParams(history.location.search);
        const redirectTarget = searchParams.get('redirect');
        if (redirectTarget && !redirectTarget.startsWith('/login')) {
          window.location.href = redirectTarget;
        } else {
          window.location.href = targetUrl;
        }
      } else if (pathname === '/l/welcome' && targetUrl !== '/l/welcome') {
        window.location.href = targetUrl;
      }
    } else {
      // TẠM THỜI DISABLE ĐỂ NGĂN CHẶN LOGOUT KHI CHUYỂN QUYỀN NHANH
      // dispatch(logoutUser());
      dispatch(hideLoading());
    }
  } catch (error) {
    console.log(error);
    dispatch(hideLoading());
    // TẠM THỜI DISABLE ĐỂ NGĂN CHẶN LOGOUT KHI CHUYỂN QUYỀN NHANH
    // dispatch(logoutUser());
  }
};

export const update_user_field = (
  updatedField: Partial<UserSessionContext>,
): AppThunk => (dispatch) =>
    dispatch({
      type: UPDATE_USER_FIELD,
      payload: updatedField,
    });

export const switch_account = ({ role }: SwitchAccountParams): AppThunk<Promise<void>> =>
  async (dispatch) => {
    const response = await graphqlService.mutate<UserSessionContext>(
      gql(GET_USER_SESSION_INFO_QUERY()),
      { role },
      dispatch,
    );

    if (response.code === ApiResponseCode.SUCCESS && response.data) {
      dispatch(showMessage({ message: 'Chuyển tài khoản thành công.' }));
      dispatch(setUserData(response.data));
    }
  };

export const setUserData = (
  payload: MaybeWrappedSession,
): AppThunk => (dispatch) => {
  const session = extractSession(payload);

  const favouriteMenus = ensureNavigationArray(session.favourist_menus);
  const menuGraph = ensureNavigationArray(session.menuGraph);

  dispatch(setFavoriteMenus(favouriteMenus));
  dispatch(setFavoriteMenusForm(favouriteMenus));
  dispatch(setNavigation(menuGraph));
  dispatch(setNavigationList(menuGraph));
  dispatch(updateUserData({ ...session }));

  // Sync to localStorage for Quick Role Switch support
  if (session.user) {
    const context = (session.user as any).identity_contexts?.find((ctx: any) => ctx.clientId === BAC_USER_CLIENT_ID);
    const roles = context?.roles || (session.user as any).roles || [];
    const activeRole = session.activeRole || context?.defaultRole || roles[0] || '';

    persistUserData({
      username: session.user.username || '',
      role: activeRole,
      roles: roles,
    });
  }
};

export const updateUserSettings = (settings: Record<string, unknown>): AppThunk => (dispatch, getState) => {
  const state = getState() as RootState;
  const currentUser = state.auth?.user?.data;

  if (!currentUser) {
    return;
  }

  const updatedUser: UserSessionContext = {
    ...currentUser,
    settings,
  };

  dispatch(updateUserData(updatedUser));
  dispatch(setUserData(updatedUser));
};

export const updateUserShortcuts = (shortcuts: string[]): AppThunk => (dispatch, getState) => {
  const state = getState() as RootState;
  const currentUser = state.auth?.user?.data;

  if (!currentUser) {
    return;
  }

  const updatedUser: UserSessionContext = {
    ...currentUser,
    shortcuts,
  };

  dispatch(updateUserData(updatedUser));
  dispatch(setUserData(updatedUser));
};

export const removeUserData = (): RemoveUserDataAction => ({
  type: REMOVE_USER_DATA,
});

export const logoutUser = (message?: string | null): AppThunk => (dispatch) => {
  elsagaService.logout();
  dispatch(setInitialSettings());

  dispatch({
    type: USER_LOGGED_OUT,
  });

  const pathname = history.location.pathname;
  console.log("logoutUser called at pathname:", pathname);
  if (!pathname.startsWith('/login')) {
    history.push('/login');
  }

  if (message) {
    dispatch(hideLoading());
    dispatch(showMessage({ message }));
  }
};

const updateUserData = (userSetting: UserSessionContext): SetUserDataAction => ({
  type: SET_USER_DATA,
  payload: userSetting,
});
