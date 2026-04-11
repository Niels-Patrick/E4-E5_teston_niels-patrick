import { beforeEach, describe, expect, it, vi } from 'vitest';

const tokenMock = vi.hoisted(() => ({
    handleCheckTokenValidity: vi.fn()
}));

const apiClientMock = vi.hoisted(() => ({
    post: vi.fn()
}));

vi.mock('../src/api/token', () => tokenMock);
vi.mock('../src/api/client', () => ({ apiClient: apiClientMock }));

import { playAiTurn } from '../src/api/ai';

describe('api/ai', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('access_token', 'access-token');
    });

    it('posts the board to the AI endpoint and returns the updated board', async () => {
        const board = ['X', '', '', '', '', '', '', '', ''];
        const updatedBoard = ['X', 'O', '', '', '', '', '', '', ''];
        apiClientMock.post.mockResolvedValue({
            data: { board: updatedBoard, message: 'ok' }
        });

        await expect(playAiTurn(board)).resolves.toEqual(updatedBoard);
        expect(tokenMock.handleCheckTokenValidity).toHaveBeenCalled();
        expect(apiClientMock.post).toHaveBeenCalledWith(
            '/ai/',
            { board, aiMark: 'O' },
            {
                headers: { Authorization: 'Bearer access-token' }
            }
        );
    });

    it('rethrows the backend error message on failure', async () => {
        apiClientMock.post.mockRejectedValue({
            response: { data: { message: 'AI failed' } }
        });

        await expect(playAiTurn(['', '', '', '', '', '', '', '', '']))
            .rejects.toBe('AI failed');
    });
});
