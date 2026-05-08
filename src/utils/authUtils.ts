import history from '@history';

export interface UserData {
    username: string;
    role: string;
    roles: string[];
}

const AUTH_KEY = 'userData';

export const MANUAL_ROLE_KEY = 'manualActiveRole';

export const setUserData = (data: UserData) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

export const getUserData = (): UserData | null => {
    const data = localStorage.getItem(AUTH_KEY);
    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to parse userData from localStorage', e);
        return null;
    }
};

export const getManualRoleOverride = (): string | null => {
    return localStorage.getItem(MANUAL_ROLE_KEY);
};

export const clearManualRoleOverride = () => {
    localStorage.removeItem(MANUAL_ROLE_KEY);
};

export const clearUserData = () => {
    localStorage.removeItem(AUTH_KEY);
    clearManualRoleOverride();
};

export const getCurrentRole = (): string | null => {
    return getManualRoleOverride() || (getUserData()?.role || null);
};

export const switchRole = (newRole: string) => {
    localStorage.setItem(MANUAL_ROLE_KEY, newRole);
    const data = getUserData();
    if (data) {
        const updatedRoles = data.roles?.includes?.(newRole) ? data.roles : [...(data.roles || []), newRole];
        setUserData({ ...data, role: newRole, roles: updatedRoles });
        return true;
    }
    return true; // Still true because we set the manual key
};

export const forceSwitchRole = (newRole: string, path: string) => {
    localStorage.setItem(MANUAL_ROLE_KEY, newRole);
    const data = getUserData();
    if (data) {
        const updatedRoles = data.roles?.includes?.(newRole) ? data.roles : [...(data.roles || []), newRole];
        setUserData({ ...data, role: newRole, roles: updatedRoles });
    }
    history.push(path);
    return true;
};

export const resetCurrentRole = () => {
    const data = getUserData();
    if (data) {
        setUserData({ ...data, role: '' });
        clearManualRoleOverride();
    }
};

export const getRolePathPrefix = (role: string | undefined | null): string => {
    if (!role) return 'guest';
    const r = role.toUpperCase();
    switch (r) {
        case 'ADMIN':
            return '';
        case 'QL':
        case 'PM':
            return 'ql';
        case 'KD':
        case 'SALE':
            return 'kd';
        case 'GS':
        case 'GIAM-SAT':
            return 'gs';
        case 'KT':
        case 'KE-TOAN':
            return 'kt';
        case 'KYT':
        case 'KY-THUAT':
            return 'kyt';
        // PARTNER role disabled in Wave 1 — legacy users fall through to guest (forces re-login / not-found).
        default:
            return role.toLowerCase();
    }
};
