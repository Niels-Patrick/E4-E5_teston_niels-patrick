import { beforeEach, describe, expect, it, vi } from 'vitest';

const jwtDecodeMock = vi.hoisted(() => vi.fn());

vi.mock('jwt-decode', () => ({
    jwtDecode: jwtDecodeMock
}));

import { copyMatchingKeys, getUserTokenData } from '../src/api/utils';

describe('api/utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('copies only matching defined keys and deep clones nested values', () => {
        const target = {
            keep: { nested: 'old' },
            untouched: 'same'
        };
        const source = {
            keep: { nested: 'new' },
            ignored: 'value'
        };

        copyMatchingKeys(target, source);

        expect(target).toEqual({
            keep: { nested: 'new' },
            untouched: 'same'
        });
        expect(target.keep).not.toBe(source.keep);
    });

    it('returns decoded token data when an access token exists', () => {
        const decoded = { sub: '1', username: 'admin', email: 'a@b.c', role: { idRole: '1', name: 'Admin' } };
        jwtDecodeMock.mockReturnValue(decoded);
        localStorage.setItem('access_token', 'token-value');

        expect(getUserTokenData()).toEqual(decoded);
        expect(jwtDecodeMock).toHaveBeenCalledWith('token-value');
    });

    it('returns undefined when there is no access token', () => {
        expect(getUserTokenData()).toBeUndefined();
        expect(jwtDecodeMock).not.toHaveBeenCalled();
    });
});
