import type { UserSessionContext } from 'types/auth/UserSessionContext';
import { MANUAL_ROLE_KEY } from '@/utils/authUtils';
import {
  REMOVE_USER_DATA,
  SET_USER_DATA,
  UPDATE_USER_FIELD,
  USER_LOGGED_OUT,
  type UserActions,
} from '../actions/user.actions';

export interface UserState {
  data: UserSessionContext;
  tenantId: string | null;
  tenantFilters: string[];
  role?: string;
}

const initialState: UserState = {
  data: {} as UserSessionContext,
  tenantId: null,
  tenantFilters: [],
  role: "guest",
};

const userReducer = (state: UserState = initialState, action: UserActions): UserState => {
  switch (action.type) {
    case UPDATE_USER_FIELD:
      return {
        ...state,
        data: {
          ...state.data,
          ...(action.payload ?? {}),
        },
      };

    case SET_USER_DATA: {
      const payload = action.payload as UserSessionContext;
      const tenantFilters =
        payload.tenants?.map((tenant: any) => tenant?._id).filter((id: any): id is string => Boolean(id)) ?? [];
      const tenantId = tenantFilters.length > 0 ? tenantFilters[0] : null;
      
      // Ưu tiên lấy role từ: 
      // 1. Manual override trong localStorage (nếu có, để hỗ trợ Chuyển quyền nhanh)
      // 2. activeRole từ payload server
      // 3. roles đầu tiên từ payload.user.roles
      // 4. Default là 'KD'
      const manualOverride = localStorage.getItem(MANUAL_ROLE_KEY);
      const serverActiveRole = payload.activeRole;
      const userRoles = (payload.user as any)?.roles || [];
      
      let role = 'KD';
      if (manualOverride) {
        role = manualOverride.toUpperCase();
      } else if (serverActiveRole) {
        role = serverActiveRole.toUpperCase();
      } else if (userRoles.length > 0) {
        role = userRoles[0].toUpperCase();
      }

      return {
        ...state,
        data: { ...payload },
        tenantFilters,
        tenantId,
        role
      };
    }

    case REMOVE_USER_DATA:
    case USER_LOGGED_OUT:
      return initialState;

    default:
      return state;
  }
};

export default userReducer;
