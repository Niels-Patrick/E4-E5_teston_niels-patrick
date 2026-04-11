import { beforeEach, describe, expect, it, vi } from 'vitest';

const tokenMock = vi.hoisted(() => ({
    handleCheckTokenValidity: vi.fn()
}));

const apiClientMock = vi.hoisted(() => ({
    get: vi.fn()
}));

vi.mock('../src/api/token', () => tokenMock);
vi.mock('../src/api/client', () => ({ apiClient: apiClientMock }));

import { getRoles } from '../src/api/roles';

describe('api/roles', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('access_token', 'access-token');
    });

    it('fetches the roles list', async () => {
        const roles = [{ idRole: '1', name: 'Admin' }];
        apiClientMock.get.mockResolvedValue({
            data: { roles, message: 'ok' }
        });

        await expect(getRoles()).resolves.toEqual(roles);
        expect(apiClientMock.get).toHaveBeenCalledWith('/role/', {
            headers: { Authorization: 'Bearer access-token' }
        });
    });

    it('rethrows not found errors', async () => {
        apiClientMock.get.mockRejectedValue({
            response: { status: 404, data: { message: 'No roles' } }
        });

        await expect(getRoles()).rejects.toBe('No roles');
    });
});
