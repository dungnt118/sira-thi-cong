import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/pages/shared/auth/store/actions/user.actions';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const userState = useAppSelector((state) => state.auth.user);
    const sessionData = userState?.data;

    // Derive role - assuming the first role is primary or mapped from metadata
    const roles = sessionData?.user?.roles || [];
    const role = userState?.role || (roles.length > 0 ? roles[0].toLowerCase() : null);

    const logout = () => {
        dispatch(logoutUser());
    };

    return {
        user: sessionData?.user || null,
        session: sessionData,
        role,
        roles,
        logout,
        isAuthenticated: !!sessionData?.user?._id
    };
};

