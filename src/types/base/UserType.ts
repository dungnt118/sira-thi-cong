import type { Role } from "types/auth/UserSessionContext";

/**
 * Interface định nghĩa cấu trúc của User object
 */
export interface UserType {
    _id?: string;
    userName?: string;
    username?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    avatar?: string;
    roles?: Role[];
    isRoot?: boolean;
    isActive?: boolean;
    employeeId?: string;
    createdAt?: Date;
    updatedAt?: Date;
} 