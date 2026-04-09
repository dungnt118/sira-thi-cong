const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '');

export const LEGACY_ADMIN_PREFIXES = ['ql', 'kd', 'gs', 'kt', 'kyt'] as const;

export type AdminRolePrefix = (typeof LEGACY_ADMIN_PREFIXES)[number];

export const buildAdminRoleRoute = (role: string, subPath = '') => {
    const normalizedRole = trimSlashes(role).toLowerCase();
    const normalizedSubPath = trimSlashes(subPath);

    if (!normalizedRole) {
        return '/admin';
    }

    return normalizedSubPath
        ? `/admin/${normalizedRole}/${normalizedSubPath}`
        : `/admin/${normalizedRole}`;
};

export const buildJourneyDetailRoute = (role: string, journeyId: string, search = '') => {
    const normalizedSearch = search
        ? search.startsWith('?') || search.startsWith('#')
            ? search
            : `?${search}`
        : '';

    return `${buildAdminRoleRoute(role, `journeys/${journeyId}`)}${normalizedSearch}`;
};

export const buildJourneyBoardRoute = (role: string, search = '') => {
    const normalizedSearch = search
        ? search.startsWith('?') || search.startsWith('#')
            ? search
            : `?${search}`
        : '';

    return `${buildAdminRoleRoute(role, 'journeys/board')}${normalizedSearch}`;
};
