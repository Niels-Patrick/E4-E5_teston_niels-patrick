import { beforeEach, describe, expect, it, vi } from 'vitest';

const tokenMock = vi.hoisted(() => ({
    handleCheckTokenValidity: vi.fn()
}));

const apiClientMock = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn()
}));

vi.mock('../src/api/token', () => tokenMock);
vi.mock('../src/api/client', () => ({ apiClient: apiClientMock }));

import {
    formRetrain,
    getTrainingResult,
    getTrainingStatus,
    lastGamesResults,
    messageResult,
    messageStatus,
    retrainModel,
    setFormToDefault
} from '../src/api/monitoring';

describe('api/monitoring', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('access_token', 'access-token');
        formRetrain.value = {
            populationSize: 1,
            gamesPerEval: 2,
            mutationRate: 0.1,
            mutationStd: 0.2,
            generations: 3
        };
        messageResult.value = '';
        messageStatus.value = '';
    });

    it('resets the retrain form to its defaults', () => {
        setFormToDefault();

        expect(formRetrain.value).toEqual({
            populationSize: 100,
            gamesPerEval: 60,
            mutationRate: 0.05,
            mutationStd: 0.15,
            generations: 200
        });
    });

    it('fetches the last games summary', async () => {
        const summary = { should_retrain: 'false' };
        apiClientMock.get.mockResolvedValueOnce({
            data: { summary, message: 'ok' }
        });

        await expect(lastGamesResults()).resolves.toEqual(summary);
    });

    it('submits a retrain request with the current parameters', async () => {
        apiClientMock.post.mockResolvedValueOnce({
            data: { message: 'started' }
        });

        await expect(retrainModel()).resolves.toBe('started');
        expect(apiClientMock.post).toHaveBeenCalledWith(
            '/monitoring/retrain-model',
            formRetrain.value,
            {
                headers: { Authorization: 'Bearer access-token' }
            }
        );
    });

    it('stores the training result message and returns plots', async () => {
        apiClientMock.get.mockResolvedValueOnce({
            data: { message: 'finished', plots: ['/plot.png'] }
        });

        await expect(getTrainingResult()).resolves.toEqual(['/plot.png']);
        expect(messageResult.value).toBe('finished');
    });

    it('stores the training status and returns it', async () => {
        apiClientMock.get.mockResolvedValueOnce({
            data: { message: 'ok', status: 'running' }
        });

        await expect(getTrainingStatus()).resolves.toBe('running');
        expect(messageStatus.value).toBe('running');
    });
});
