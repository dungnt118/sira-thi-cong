import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/pages/shared/auth/store/actions/user.actions';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state: any) => state.auth);
    
    // Attempt to extract user data from both flattened and nested formats
    const userState = authState?.user;
    const sessionData = userState?.data || authState; // Fallback to authState itself if flattened
    
    // Resilient role extraction
    const rawRole = authState?.activeRole || authState?.role || userState?.role || null;
    const role = typeof rawRole === 'string' ? rawRole : (rawRole?._id || rawRole?.code || null);
    const roles = role ? [role] : [];
    
    // Robust Admin Check
    const userRoles = sessionData?.user?.roles || sessionData?.roles || [];
    const isAdmin = role === 'admin' || 
                    authState?.policy === 'admin' ||
                    sessionData?.user?.isRoot === true ||
                    userRoles.some((r: any) => {
                        const rCode = typeof r === 'string' ? r : (r?._id || r?.code || r?.name);
                        return rCode?.toLowerCase?.() === 'admin';
                    });

    const logout = () => {
        dispatch(logoutUser());
    };

    return {
        user: sessionData?.user || (userState?._id ? userState : null),
        session: sessionData,
        role,
        roles,
        isAdmin,
        logout,
        isAuthenticated: !!(sessionData?.user?._id || userState?._id || authState?.isAuthenticated)
    };
};
