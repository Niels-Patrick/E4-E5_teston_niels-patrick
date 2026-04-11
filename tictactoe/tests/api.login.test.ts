import { beforeEach, describe, expect, it, vi } from 'vitest';

const tokenMock = vi.hoisted(() => ({
    handleCheckTokenValidity: vi.fn()
}));

const apiClientMock = vi.hoisted(() => ({
    post: vi.fn(),
    delete: vi.fn()
}));

vi.mock('../src/api/token', () => tokenMock);
vi.mock('../src/api/client', () => ({ apiClient: apiClientMock }));

import {
    formRefLogin,
    handleSubmitLoginForm,
    handleSubmitLogout,
    loading,
    message,
    password,
    submitLoginForm,
    submitLogout,
    username
} from '../src/api/login';

const originalLocation = window.location;

function stubReload() {
    const reloadMock = vi.fn();

    Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
            ...originalLocation,
            reload: reloadMock
        }
    });

    return reloadMock;
}

describe('api/login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        loading.value = false;
        message.value = '';
        username.value = 'admin';
        password.value = 'secret';
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation
        });
    });

    it('logs in successfully, stores tokens, clears the form and redirects', async () => {
        const router = { push: vi.fn() } as any;
        apiClientMock.post.mockResolvedValue({
            data: {
                access_token: 'access',
                refresh_token: 'refresh',
                message: 'ok'
            }
        });

        await submitLoginForm(router);

        expect(tokenMock.handleCheckTokenValidity).toHaveBeenCalled();
        expect(localStorage.getItem('access_token')).toBe('access');
        expect(localStorage.getItem('refresh_token')).toBe('refresh');
        expect(username.value).toBe('');
        expect(password.value).toBe('');
        expect(router.push).toHaveBeenCalledWith('/home-page');
    });

    it('stores the backend error message when login submit fails after validation', async () => {
        const router = { push: vi.fn() } as any;
        formRefLogin.value = {
            validate: vi.fn().mockResolvedValue({ valid: true })
        };
        apiClientMock.post.mockRejectedValue({
            response: { status: 401, data: { message: 'Invalid credentials' } }
        });

        await handleSubmitLoginForm(router);

        expect(message.value).toBe('Invalid credentials');
        expect(loading.value).toBe(false);
    });

    it('does not submit the login form when validation fails', async () => {
        const router = { push: vi.fn() } as any;
        formRefLogin.value = {
            validate: vi.fn().mockResolvedValue({ valid: false })
        };

        await handleSubmitLoginForm(router);

        expect(apiClientMock.post).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    it('logs out successfully, clears tokens and reloads the page', async () => {
        localStorage.setItem('access_token', 'access');
        localStorage.setItem('refresh_token', 'refresh');
        const reloadMock = stubReload();
        apiClientMock.delete.mockResolvedValue({ data: { message: 'ok' } });

        await submitLogout();

        expect(apiClientMock.delete).toHaveBeenCalledWith('/login/', {
            headers: { Authorization: 'Bearer access' }
        });
        expect(localStorage.getItem('access_token')).toBeNull();
        expect(localStorage.getItem('refresh_token')).toBeNull();
        expect(reloadMock).toHaveBeenCalled();
    });

    it('toggles loading while handling logout', async () => {
        apiClientMock.delete.mockResolvedValue({ data: { message: 'ok' } });
        stubReload();

        await handleSubmitLogout();

        expect(loading.value).toBe(false);
    });
});
