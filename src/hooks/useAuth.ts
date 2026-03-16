import { useState } from 'react';
import { UserData, getUserData, setUserData, clearUserData, switchRole } from '../utils/authUtils';

export const useAuth = () => {
    const [user, setUser] = useState<UserData | null>(getUserData());

    const updateUserData = (data: UserData) => {
        setUserData(data);
        setUser(data);
    };

    const logout = () => {
        clearUserData();
        setUser(null);
    };

    const handleSwitchRole = (newRole: string) => {
        if (switchRole(newRole)) {
            setUser(getUserData());
            return true;
        }
        return false;
    };

    return {
        user,
        role: user?.role || null,
        roles: user?.roles || [],
        updateUserData,
        logout,
        switchRole: handleSwitchRole,
        isAuthenticated: !!user?.role
    };
};
