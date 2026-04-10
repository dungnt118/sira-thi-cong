import { describe, expect, it } from 'vitest';
import { hasAuthenticatedUserSession } from '../authSession';

describe('hasAuthenticatedUserSession', () => {
    it('trả về false khi state sau logout chỉ còn object rỗng', () => {
        expect(hasAuthenticatedUserSession({ data: {} } as any)).toBe(false);
    });

    it('trả về true khi session còn thông tin user hợp lệ', () => {
        expect(
            hasAuthenticatedUserSession({
                data: {
                    user: {
                        _id: 'user-01',
                        username: 'tester',
                    },
                },
            } as any),
        ).toBe(true);
    });
});
