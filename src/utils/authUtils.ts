export interface UserData {
    username: string;
    role: string;
    roles: string[];
}

const AUTH_KEY = 'userData';

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

export const clearUserData = () => {
    localStorage.removeItem(AUTH_KEY);
};

export const getCurrentRole = (): string | null => {
    const data = getUserData();
    return data ? data.role : null;
};

export const switchRole = (newRole: string) => {
    const data = getUserData();
    if (data && data.roles.includes(newRole)) {
        setUserData({ ...data, role: newRole });
        return true;
    }
    return false;
};

export const forceSwitchRole = (newRole: string, path: string) => {
    const data = getUserData();
    if (data) {
        const updatedRoles = data.roles.includes(newRole) ? data.roles : [...data.roles, newRole];
        setUserData({ ...data, role: newRole, roles: updatedRoles });
        window.location.href = path;
        return true;
    }
    return false;
};

export const resetCurrentRole = () => {
    const data = getUserData();
    if (data) {
        setUserData({ ...data, role: '' });
    }
};
