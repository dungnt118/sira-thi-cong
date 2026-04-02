/**
 * User Management Constants
 */

export const BAC_USER_CLIENT_ID = 'bac.user';

export interface UserRoleOption {
    Value: string;
    Label: string;
    Color?: string;
}

export const USER_ROLES: UserRoleOption[] = [
    {
        Value: 'QL',
        Label: 'Quản lý dự án',
        Color: 'blue',
    },
    {
        Value: 'GS',
        Label: 'Giám sát',
        Color: 'green',
    },
    {
        Value: 'KYT',
        Label: 'Kỹ thuật',
        Color: 'cyan',
    },
    {
        Value: 'KT',
        Label: 'Kế toán',
        Color: 'orange',
    },
    {
        Value: 'KD',
        Label: 'Kinh doanh',
        Color: 'purple',
    },
    {
        Value: 'ADMIN',
        Label: 'Quản trị viên',
        Color: 'red',
    },
];

export const ROLE_LABEL_MAP = USER_ROLES.reduce((acc, curr) => {
    acc[curr.Value] = curr.Label;
    return acc;
}, {} as Record<string, string>);

export const ROLE_COLOR_MAP = USER_ROLES.reduce((acc, curr) => {
    acc[curr.Value] = curr.Color || 'default';
    return acc;
}, {} as Record<string, string>);
