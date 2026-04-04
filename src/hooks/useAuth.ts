import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/pages/shared/auth/store/actions/user.actions';
import { getCurrentRole } from '@/utils/authUtils';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state: any) => state.auth);
    
    // Attempt to extract user data from both flattened and nested formats
    const userState = authState?.user;
    const sessionData = userState?.data || authState; // Fallback to authState itself if flattened
    
    // Resilient role extraction
    const rawRole =
        authState?.activeRole ||
        authState?.role ||
        userState?.role ||
        sessionData?.activeRole ||
        getCurrentRole() ||
        null;
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

    // availableRoles logic: ONLY filter contexts matching BAC_USER_CLIENT_ID ('bac.user')
    // as per user requirement. Other contexts like 'tenant.manager' are ignored for this list.
    const BAC_USER_CLIENT_ID = 'bac.user';
    const identityContexts = sessionData?.user?.identity_contexts || [];
    const bacContext = identityContexts.find((c: any) => c.clientId === BAC_USER_CLIENT_ID);
    
    let availableRoles: string[] = [];
    if (bacContext && bacContext.roles) {
        availableRoles = bacContext.roles.map((r: any) => String(r).toUpperCase());
    }

    // fallback: if no context found, use the current active role
    if (availableRoles.length === 0 && role) {
        availableRoles = [role.toUpperCase()];
    }

    const logout = () => {
        dispatch(logoutUser());
    };

    return {
        user: sessionData?.user || (userState?._id ? userState : null),
        session: sessionData,
        role,
        roles,
        availableRoles, // New property
        isAdmin,
        logout,
        isAuthenticated: !!(sessionData?.user?._id || userState?._id || authState?.isAuthenticated)
    };
};
