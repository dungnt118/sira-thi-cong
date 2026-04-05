import history from '@history';
import elsagaService from '@/services/authenticationService';
import {
  BASE_URL,
  CLOUD_ENABLE,
  get,
  REGCODE,
  REGISTRATION_ID,
  set,
  TENANT_KEY
} from 'app/services/storeService';
import { set_float_buttons } from 'app/store/actions/float_buttons';
import { showMessage } from 'app/store/actions/fuse/message.actions';
import { fetch_all_schemas } from 'app/store/actions/schemas/schemas.action';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import axios from 'axios';
import qs from 'qs';
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import type { ApiResponse } from 'types/apis/ApiResponse';
import { updateToken } from './store/actions/login.actions';
import { loadUserData, logoutUser } from './store/actions/user.actions';
import type { TenantRegistrationPublicDto } from './tenantService.types';

type AuthProps = PropsWithChildren<{
  match?: {
    params?: {
      token?: string;
      [key: string]: string | undefined;
    };
  };
}>;

const isPublicPath = (pathname: string) =>
  pathname.startsWith('/login') ||
  pathname.startsWith('/documents') ||
  pathname.startsWith('/portal') ||
  pathname === '/portal';

const getCurrentPathname = () => window.location.pathname;

const getCurrentPath = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;

const buildLoginRedirectPath = (targetPath: string) => {
  if (!targetPath || targetPath.startsWith('/login')) {
    return '/login';
  }

  return `/login?redirect=${encodeURIComponent(targetPath)}`;
};

const Auth: React.FC<AuthProps> = ({ children, match }) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state: any) => state.auth?.user?.data);
  const schemas = (useAppSelector((state: any) => state.schemas))?.all_schemas;
  
  const isCloudEnabledRaw = get(CLOUD_ENABLE);
  const isCloudEnabled = isCloudEnabledRaw === true || String(isCloudEnabledRaw).toLowerCase() === 'true';
  const [tenantReady, setTenantReady] = useState<boolean>(() => !isCloudEnabled);
  const [loading, setLoading] = useState(true);
  
  const matchToken = match?.params?.token;
  const hasResetApolloClient = useRef(false);
  const lastTenantHostRef = useRef<string | null>(null);
  const tenantFetchInFlightRef = useRef(false);
  const lastTenantFetchFailedHostRef = useRef<string | null>(null);

  const authenCheck = useCallback(() => {
    elsagaService.on('onAutoLogout', (logoutMessage: string) => {
      if (logoutMessage) {
        dispatch(showMessage({ message: logoutMessage }));
      }
      dispatch(logoutUser());
      setLoading(false);
    });

    elsagaService.on('onAutoLogin', async () => {
      try {
        await dispatch(loadUserData());
        dispatch(fetch_all_schemas());
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    });

    elsagaService.init();
  }, [dispatch]);

  // 1) Fetch tenant config (cloud mode)
  useEffect(() => {
    if (!isCloudEnabled) {
      setTenantReady(true);
      return;
    }
    
    const tenantHostName = window.location.hostname;
    const tenantUrl = `${get(BASE_URL)}/api/tenant-info/get_registration?access_uri=${encodeURIComponent(tenantHostName)}`;

    axios.get<ApiResponse<TenantRegistrationPublicDto>>(tenantUrl)
      .then((response) => {
        const registration = response.data?.data;
        if (registration) {
          set(REGCODE, registration.code);
          set(REGISTRATION_ID, registration._id);
          set(TENANT_KEY, registration.tenantId);
          setTenantReady(true);
        }
      })
      .catch(() => {
        setTenantReady(true); // Fallback so app doesn't hang
      });
  }, [isCloudEnabled]);

  // 2) Init auth after tenant config is ready
  useEffect(() => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true }) as Record<string, unknown>;
    
    if (tenantReady && !userData?.user && !query.layoutStyle) {
      const token = (query.token as string) ?? matchToken;
      if (token) {
        updateToken(token);
      }
      
      const existingToken = elsagaService.getAccessToken();
      const currentPathname = getCurrentPathname();
      const currentPath = getCurrentPath();

      if (existingToken) {
        console.log('Auth: existingToken found', existingToken);
        authenCheck();
      } else {
        console.log('Auth: No token, checking path', currentPathname);
        if (!isPublicPath(currentPathname)) {
          console.log('Auth: Redirecting to login from', currentPathname);
          history.replace(buildLoginRedirectPath(currentPath));
        }
        setLoading(false);
      }
    } else if (userData?.user || 
               isPublicPath(getCurrentPathname()) ||
               query.layoutStyle) {
      setLoading(false);
    }
  }, [authenCheck, tenantReady, userData?.user, matchToken]);

  // 3) Schemas and Float Buttons
  useEffect(() => {
    if (schemas) {
      const clientConfiguration = schemas.find((s: any) => s.name === 'ClientConfiguration');
      if (clientConfiguration?.properties) {
        const floatButtons = clientConfiguration.properties.find((p: any) => p.id === 'float_buttons');
        if (floatButtons?.nested) {
          const floatBtnSettings = floatButtons.nested.map((n: any) => ({
            faIcon: n.faIcon,
            type: 'remote',
            action: { steps: n.action_steps },
            label: n.label,
            title: n.label,
          }));
          dispatch(set_float_buttons([
            { title: 'Công việc', type: 'local', action: 'tasks', faIcon: 'bug' },
            ...floatBtnSettings,
          ]) as any);
        }
      }
    }
  }, [dispatch, schemas]);

  if (loading && !isPublicPath(getCurrentPathname())) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>
             <span style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>SIRA</span>
          </div>
          <div style={{ fontSize: 16, color: '#888' }}>Đang tải phiên làm việc...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Auth;
