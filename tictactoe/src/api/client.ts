import axios from 'axios';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';

export const apiBaseUrl = configuredApiBaseUrl.endsWith('/')
    ? configuredApiBaseUrl.slice(0, -1)
    : configuredApiBaseUrl;

export const apiClient = axios.create({
    baseURL: apiBaseUrl
});

export function resolveApiUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    if (/^https?:\/\//i.test(apiBaseUrl)) {
        return new URL(path, `${apiBaseUrl}/`).toString();
    }

    return new URL(path, window.location.origin).toString();
}