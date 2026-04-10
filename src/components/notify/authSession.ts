import type { UserState } from '@/pages/shared/auth/store/reducers/user.reducer';

export function hasAuthenticatedUserSession(authUser: UserState | null | undefined): boolean {
    const u = authUser?.data?.user;
    return !!(u && (u._id || u.username));
}
