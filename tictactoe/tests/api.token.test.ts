import { beforeEach, describe, expect, it, vi } from 'vitest';

const jwtDecodeMock = vi.hoisted(() => vi.fn());
const loginMock = vi.hoisted(() => ({
    handleSubmitLogout: vi.fn()
}));
const apiClientMock = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn()
}));

vi.mock('jwt-decode', () => ({ jwtDecode: jwtDecodeMock }));
vi.mock('../src/api/login', () => loginMock);
vi.mock('../src/api/client', () => ({ apiClient: apiClientMock }));

import {
    checkTokenValidity,
    email,
    getToken,
    handleCheckTokenValidity,
    idUser,
    refreshTokens,
    role,
    username
} from '../src/api/token';

describe('api/token', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        idUser.value = '';
        username.value = '';
        email.value = '';
        role.value = '';
    });

    it('decodes the access token into exported refs', () => {
        localStorage.setItem('access_token', 'access');
        jwtDecodeMock.mockReturnValue({
            sub: '1',
            username: 'admin',
            email: 'admin@example.com',
            role: { idRole: 'r1', name: 'Admin' }
        });

        getToken();

        expect(idUser.value).toBe('1');
        expect(username.value).toBe('admin');
        expect(email.value).toBe('admin@example.com');
        expect(role.value).toBe('Admin');
    });

    it('refreshes tokens and stores the returned values', async () => {
        localStorage.setItem('refresh_token', 'refresh');
        apiClientMock.get.mockResolvedValue({
            data: {
                access_token: 'new-access',
                refresh_token: 'new-refresh',
                message: 'ok'
            }
        });

        await refreshTokens();

        expect(localStorage.getItem('access_token')).toBe('new-access');
        expect(localStorage.getItem('refresh_token')).toBe('new-refresh');
    });

    it('returns the backend token validity result', async () => {
        apiClientMock.post.mockResolvedValue({
            data: { result: true, message: 'ok' }
        });

        await expect(checkTokenValidity('token')).resolves.toBe(true);
    });

    it('does nothing when there is no access token', async () => {
        await handleCheckTokenValidity();

        expect(apiClientMock.post).not.toHaveBeenCalled();
        expect(loginMock.handleSubmitLogout).not.toHaveBeenCalled();
    });

    it('refreshes tokens when the access token is invalid but refresh token is valid', async () => {
        localStorage.setItem('access_token', 'access');
        localStorage.setItem('refresh_token', 'refresh');
        apiClientMock.post
            .mockResolvedValueOnce({ data: { result: false, message: 'expired' } })
            .mockResolvedValueOnce({ data: { result: true, message: 'ok' } });
        apiClientMock.get.mockResolvedValue({
            data: {
                access_token: 'new-access',
                refresh_token: 'new-refresh',
                message: 'ok'
            }
        });

        await handleCheckTokenValidity();

        expect(apiClientMock.get).toHaveBeenCalled();
        expect(loginMock.handleSubmitLogout).not.toHaveBeenCalled();
        expect(localStorage.getItem('access_token')).toBe('new-access');
    });

    it('logs out when both tokens are invalid', async () => {
        localStorage.setItem('access_token', 'access');
        localStorage.setItem('refresh_token', 'refresh');
        apiClientMock.post
            .mockResolvedValueOnce({ data: { result: false, message: 'expired' } })
            .mockResolvedValueOnce({ data: { result: false, message: 'expired' } });

        await handleCheckTokenValidity();

        expect(loginMock.handleSubmitLogout).toHaveBeenCalled();
    });
});
