import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/pages/shared/auth/store/actions/user.actions';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const userState = useAppSelector((state) => state.auth.user);
    const sessionData = userState?.data;

    const role = userState?.role || null;
    const roles = role ? [role] : [];

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
