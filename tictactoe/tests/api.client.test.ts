import { beforeEach, describe, expect, it, vi } from 'vitest';

const axiosMock = vi.hoisted(() => ({
    create: vi.fn(() => ({ created: true }))
}));

vi.mock('axios', () => ({
    default: axiosMock
}));

async function loadClientModule() {
    return await import('../src/api/client');
}

describe('api/client', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.unstubAllEnvs();
        axiosMock.create.mockClear();
    });

    it('defaults the API base URL to /api', async () => {
        const module = await loadClientModule();

        expect(module.apiBaseUrl).toBe('/api');
        expect(axiosMock.create).toHaveBeenCalledWith({ baseURL: '/api' });
    });

    it('normalizes a configured base URL by trimming a trailing slash', async () => {
        vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/base/');

        const module = await loadClientModule();

        expect(module.apiBaseUrl).toBe('https://api.example.com/base');
        expect(axiosMock.create).toHaveBeenCalledWith({
            baseURL: 'https://api.example.com/base'
        });
    });

    it('returns absolute URLs unchanged', async () => {
        const { resolveApiUrl } = await loadClientModule();

        expect(resolveApiUrl('https://cdn.example.com/file.png'))
            .toBe('https://cdn.example.com/file.png');
    });

    it('resolves relative API asset paths against the current window origin', async () => {
        const { resolveApiUrl } = await loadClientModule();

        expect(resolveApiUrl('/api/monitoring/training-report/test.png'))
            .toBe(new URL('/api/monitoring/training-report/test.png', window.location.origin).toString());
    });

    it('resolves paths against an absolute configured API base URL', async () => {
        vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/base');

        const { resolveApiUrl } = await loadClientModule();

        expect(resolveApiUrl('/monitoring/training-report/test.png'))
            .toBe('https://api.example.com/monitoring/training-report/test.png');
    });
});
