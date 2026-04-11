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
    confirmPassword,
    deleteUser,
    emptyForm,
    formRef,
    formUser,
    getUser,
    getUsers,
    handleAddUserSubmitForm,
    handleDeleteUser,
    handleEditPasswordSubmitForm,
    handleEditUserSubmitForm,
    handleGetUser,
    handleGetUsers,
    message,
    newPassword,
    oldPassword,
    preFillForm,
    submitAddUserForm,
    submitEditPasswordForm,
    submitEditUserForm,
    user,
    users
} from '../src/api/users';

describe('api/users', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('access_token', 'access-token');
        formUser.value = {
            username: undefined,
            password: undefined,
            email: undefined,
            idRole: undefined
        };
        message.value = '';
        confirmPassword.value = '';
        oldPassword.value = '';
        newPassword.value = '';
        users.value = [];
        user.value = { idUser: '0' };
        formRef.value = undefined;
    });

    it('prefills and empties the user form', () => {
        preFillForm({ username: 'admin', email: 'admin@example.com', idRole: 'role-1' });

        expect(formUser.value.username).toBe('admin');
        expect(formUser.value.email).toBe('admin@example.com');
        expect(formUser.value.idRole).toBe('role-1');

        emptyForm();

        expect(formUser.value).toEqual({
            username: '',
            password: '',
            email: '',
            idRole: ''
        });
        expect(confirmPassword.value).toBe('');
        expect(oldPassword.value).toBe('');
        expect(newPassword.value).toBe('');
    });

    it('fetches and stores a specific user', async () => {
        const fetchedUser = { idUser: '1', username: 'admin' };
        apiClientMock.get.mockResolvedValue({
            data: { user: fetchedUser, message: 'ok' }
        });

        await expect(getUser('1')).resolves.toEqual(fetchedUser);
        await handleGetUser('1');

        expect(user.value).toEqual(fetchedUser);
    });

    it('fetches and stores all users', async () => {
        const userList = [{ idUser: '1', username: 'admin' }];
        apiClientMock.get.mockResolvedValue({
            data: { users: userList, message: 'ok' }
        });

        await expect(getUsers()).resolves.toEqual(userList);
        await handleGetUsers();

        expect(users.value).toEqual(userList);
    });

    it('submits an edited user and refreshes the users list', async () => {
        const dialog = ref(true);
        formUser.value = {
            username: 'admin',
            email: 'admin@example.com',
            idRole: 'role-1'
        };
        apiClientMock.put.mockResolvedValueOnce({
            data: { user: { idUser: '1', username: 'admin' }, message: 'updated' }
        });
        apiClientMock.get.mockResolvedValueOnce({
            data: { users: [{ idUser: '1', username: 'admin' }], message: 'ok' }
        });

        await expect(submitEditUserForm(dialog)).resolves.toEqual({ idUser: '1', username: 'admin' });
        expect(dialog.value).toBe(false);
        expect(users.value).toEqual([{ idUser: '1', username: 'admin' }]);
    });

    it('validates before submitting an edited user', async () => {
        const dialog = ref(true);
        formRef.value = {
            validate: vi.fn().mockResolvedValue({ valid: false })
        };

        await handleEditUserSubmitForm(dialog);

        expect(apiClientMock.put).not.toHaveBeenCalled();
    });

    it('submits a password change and clears the form', async () => {
        const dialog = ref(true);
        formUser.value = {
            username: 'admin',
            password: 'new-secret',
            email: 'admin@example.com',
            idRole: 'role-1'
        };
        oldPassword.value = 'old-secret';
        apiClientMock.put.mockResolvedValueOnce({
            data: { user: { idUser: '1' }, message: 'updated' }
        });

        await submitEditPasswordForm(dialog);

        expect(dialog.value).toBe(false);
        expect(formUser.value.username).toBe('');
    });

    it('requires matching passwords before submitting a password change', async () => {
        const dialog = ref(true);
        formRef.value = {
            validate: vi.fn().mockResolvedValue({ valid: true })
        };
        formUser.value.password = 'password-a';
        confirmPassword.value = 'password-b';

        await handleEditPasswordSubmitForm(dialog);

        expect(apiClientMock.put).not.toHaveBeenCalled();
    });

    it('submits a new user and refreshes the list', async () => {
        const dialog = ref(true);
        formUser.value = {
            username: 'player',
            password: 'secret',
            email: 'player@example.com',
            idRole: 'role-2'
        };
        apiClientMock.post.mockResolvedValueOnce({
            data: { message: 'created' }
        });
        apiClientMock.get.mockResolvedValueOnce({
            data: { users: [{ idUser: '2', username: 'player' }], message: 'ok' }
        });

        await expect(submitAddUserForm(dialog)).resolves.toBe('created');
        expect(dialog.value).toBe(false);
        expect(users.value).toEqual([{ idUser: '2', username: 'player' }]);
    });

    it('requires a valid form and matching passwords before adding a user', async () => {
        const dialog = ref(true);
        formRef.value = {
            validate: vi.fn().mockResolvedValue({ valid: true })
        };
        formUser.value.password = 'password-a';
        confirmPassword.value = 'password-b';

        await handleAddUserSubmitForm(dialog);

        expect(apiClientMock.post).not.toHaveBeenCalled();
    });

    it('stores the backend error when add user fails', async () => {
        const dialog = ref(true);
        formRef.value = {
            validate: vi.fn().mockResolvedValue({ valid: true })
        };
        formUser.value.password = 'password';
        confirmPassword.value = 'password';
        apiClientMock.post.mockRejectedValueOnce({
            response: { status: 409, data: { message: 'Username already taken' } }
        });

        await handleAddUserSubmitForm(dialog);

        expect(message.value).toBe('Username already taken');
    });

    it('deletes a user and refreshes the list', async () => {
        const dialog = ref(true);
        apiClientMock.delete.mockResolvedValueOnce({ data: { message: 'deleted' } });
        apiClientMock.get.mockResolvedValueOnce({
            data: { users: [{ idUser: '3', username: 'other' }], message: 'ok' }
        });

        await deleteUser('other', dialog);
        await Promise.resolve();

        expect(dialog.value).toBe(false);
        expect(users.value).toEqual([{ idUser: '3', username: 'other' }]);
    });

    it('stores the backend error when deleting a user fails', async () => {
        const dialog = ref(true);
        apiClientMock.delete.mockRejectedValueOnce({
            response: { status: 404, data: { message: 'User not found' } }
        });

        await handleDeleteUser('missing', dialog);

        expect(message.value).toBe('User not found');
    });
});
