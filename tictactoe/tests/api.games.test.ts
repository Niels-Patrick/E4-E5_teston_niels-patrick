import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

const tokenMock = vi.hoisted(() => ({
    handleCheckTokenValidity: vi.fn()
}));

const apiClientMock = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
}));

vi.mock('../src/api/token', () => tokenMock);
vi.mock('../src/api/client', () => ({ apiClient: apiClientMock }));

import {
    deleteGame,
    emptyForm,
    formGame,
    game,
    games,
    getGames,
    handleAddGameSubmitForm,
    handleDeleteGame,
    handleEditGameSubmitForm,
    handleGetGames,
    handleLoadsGame,
    loadsGame,
    message,
    preFillForm,
    submitAddGameForm,
    submitEditGameForm
} from '../src/api/games';

describe('api/games', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('access_token', 'access-token');
        formGame.value = {
            gameDate: undefined,
            gameResult: undefined,
            moves: undefined,
            idUserX: undefined,
            idUserO: undefined
        };
        game.value = { idGame: 'game-1' };
        games.value = [];
        message.value = '';
    });

    it('prefills and empties the game form', () => {
        preFillForm({
            gameDate: '2026-01-01',
            gameResult: 'X wins',
            moves: { a1: 'X' },
            idUserX: 'u1',
            idUserO: 'u2'
        });

        expect(formGame.value).toEqual({
            gameDate: '2026-01-01',
            gameResult: 'X wins',
            moves: { a1: 'X' },
            idUserX: 'u1',
            idUserO: 'u2'
        });

        emptyForm();

        expect(formGame.value).toEqual({
            gameDate: '',
            gameResult: '',
            moves: {},
            idUserX: '',
            idUserO: ''
        });
    });

    it('loads the last game', async () => {
        const lastGame = { idGame: 'game-2' };
        apiClientMock.get.mockResolvedValueOnce({
            data: { game: lastGame, message: 'ok' }
        });

        await expect(loadsGame()).resolves.toEqual(lastGame);
    });

    it('resets state when no saved game is found', async () => {
        apiClientMock.get.mockResolvedValueOnce({
            data: { game: null, message: 'ok' }
        });

        await handleLoadsGame();

        expect(game.value).toEqual(formGame.value);
    });

    it('fetches and stores the games list', async () => {
        const gameList = [{ idGame: 'game-1' }, { idGame: 'game-2' }];
        apiClientMock.get.mockResolvedValue({
            data: { games: gameList, message: 'ok' }
        });

        await expect(getGames()).resolves.toEqual(gameList);
        await handleGetGames();

        expect(games.value).toEqual(gameList);
    });

    it('submits an edited game and refreshes the games list', async () => {
        formGame.value = {
            gameDate: '2026-01-01',
            gameResult: 'draw',
            moves: { a1: 'X' },
            idUserX: 'u1',
            idUserO: 'u2'
        };
        game.value = { idGame: 'game-9' };
        apiClientMock.put.mockResolvedValueOnce({
            data: { game: { idGame: 'game-9' }, message: 'updated' }
        });
        apiClientMock.get.mockResolvedValueOnce({
            data: { games: [{ idGame: 'game-9' }], message: 'ok' }
        });

        await expect(submitEditGameForm()).resolves.toEqual({ idGame: 'game-9' });
        expect(apiClientMock.put).toHaveBeenCalledWith(
            '/game/',
            {
                gameDate: '2026-01-01',
                gameResult: 'draw',
                moves: { a1: 'X' },
                idUserX: 'u1',
                idUserO: 'u2',
                idGame: 'game-9'
            },
            {
                headers: { Authorization: 'Bearer access-token' }
            }
        );
        expect(games.value).toEqual([{ idGame: 'game-9' }]);
    });

    it('stores the error message when editing a game fails', async () => {
        apiClientMock.put.mockRejectedValueOnce({
            response: { status: 400, data: { message: 'Invalid game' } }
        });

        await handleEditGameSubmitForm();

        expect(message.value).toBe('Invalid game');
    });

    it('submits a new game and refreshes the games list', async () => {
        formGame.value = {
            gameDate: '2026-01-01',
            gameResult: 'draw',
            moves: { a1: 'X' },
            idUserX: 'u1',
            idUserO: 'u2'
        };
        apiClientMock.post.mockResolvedValueOnce({
            data: { message: 'created' }
        });
        apiClientMock.get.mockResolvedValueOnce({
            data: { games: [{ idGame: 'game-10' }], message: 'ok' }
        });

        await expect(submitAddGameForm()).resolves.toBe('created');
        expect(games.value).toEqual([{ idGame: 'game-10' }]);
    });

    it('stores the error message when adding a game fails', async () => {
        apiClientMock.post.mockRejectedValueOnce({
            response: { status: 400, data: { message: 'Bad payload' } }
        });

        await handleAddGameSubmitForm();

        expect(message.value).toBe('Bad payload');
    });

    it('deletes a game, closes the dialog and refreshes the games list', async () => {
        const dialog = ref(true);
        apiClientMock.delete.mockResolvedValueOnce({ data: { message: 'deleted' } });
        apiClientMock.get.mockResolvedValueOnce({
            data: { games: [{ idGame: 'game-11' }], message: 'ok' }
        });

        await deleteGame('game-11', dialog);
        await Promise.resolve();

        expect(dialog.value).toBe(false);
        expect(games.value).toEqual([{ idGame: 'game-11' }]);
    });

    it('stores the error message when deleting a game fails', async () => {
        const dialog = ref(true);
        apiClientMock.delete.mockRejectedValueOnce({
            response: { status: 404, data: { message: 'Missing game' } }
        });

        await handleDeleteGame('game-11', dialog);

        expect(message.value).toBe('Missing game');
    });
});
