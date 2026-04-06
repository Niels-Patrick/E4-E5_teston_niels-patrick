/**
 * Module to store the User object definition and all user related functions and variables.
 */

import axios from 'axios';
import { ref, type Ref } from 'vue';
import { handleCheckTokenValidity } from './token';
import type { User, UserRead } from '../types/users';
import { cloneDeep } from 'lodash';

export const message = ref('');  // Message to display when submitting form
export const formRef = ref();  // Used to check if a form is valid or not

export const confirmPassword = ref(''); // To store the "confirm password" field's input
export const oldPassword = ref(''); // To store the "old password" field's input
export const newPassword = ref(''); // To store the "new password" field's input

export const users = ref<UserRead[]>([]);  // List of Users

// Another declaration to use in user related form
export const formUser = ref<User>({
    username: undefined,
    password: undefined,
    email: undefined,
    idRole: undefined
});

// Declaration of a User object
export const user = ref<UserRead>({ idUser: '0' });
user.value = formUser.value;


/**
 * Pre-fills a form using a specific user's data.
 * 
 * @function
 * @param item - A specific user's data.
 * @returns {void}
 */
export function preFillForm(item: User) {
    formUser.value.username = item.username;
    formUser.value.email = item.email;
    formUser.value.idRole = item.idRole;
};


/**
 * Empties the user form fields
 * 
 * @function
 * @returns {void}
 */
export function emptyForm(): void {
    formUser.value.username = '';
    formUser.value.password = '';
    formUser.value.email = '';
    formUser.value.idRole = '';
    confirmPassword.value = '';
    oldPassword.value = '';
    newPassword.value = '';
    message.value = '';
};


/**
 * Fetches a specific user's data from the backend.
 * 
 * @async
 * @param id - The id of the user.
 * @returns {Promise<User>} - A User object if the request is successful.
 * @throws Will rethrow any other errors.
 */
export const getUser = async (id: string): Promise<UserRead> => {
    handleCheckTokenValidity();

    return await axios.get<{ user: UserRead, message: string }>(`http://127.0.0.1:5000/api/user/${id}`, {
        headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
    })
        .then((response) => {
            console.log(response.data.message);
            return response.data.user;
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the getUser function.
 * 
 * @async
 * @handler
 */
export const handleGetUser = async (id: string): Promise<void> => {
    await getUser(id)
        .then((data) => { user.value = data })
        .catch((err) => {
            message.value = err;
            console.error('Error:', err)
        });
};


/**
 * Fetches the list of users' data from the backend.
 * 
 * @async
 * @returns {Promise<User[]>} - An array of User objects if the request is
 *                              successful.
 * @throws Will rethrow any other errors.
 */
export const getUsers = async (): Promise<UserRead[]> => {
    handleCheckTokenValidity();

    return await axios.get<{ users: UserRead[], message: string }>('http://127.0.0.1:5000/api/user/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            console.log(response.data.message);
            return response.data.users;
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the getUsers function.
 * 
 * @async
 * @handler
 */
export const handleGetUsers = async (): Promise<void> => {
    await getUsers()
        .then((data) => {users.value = data})
        .catch((err) => {
            message.value = err;
            console.error('Error:', err)
        });
};


/**
 * Submits an edit user pop-up form.
 * 
 * @async
 * @returns {Promise<User>} - A User object in case of success.
 *                          - An error message in case of failure.
 * @throws Will rethrow any other errors.
 */
export const submitEditUserForm = async (dialog: Ref<boolean>): Promise<User> => {
    handleCheckTokenValidity();

    const payload = cloneDeep(formUser.value);

    return await axios.put(`http://127.0.0.1:5000/api/user/`, payload,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            dialog.value = false;  // Closes the pop-up window
            console.log(response.data.message);

            // Fetches the list of users to update displayed users' data
            getUsers()
                .then((data) => {users.value = data})
                .catch((err) => {console.error('Error:', err)});

            return response.data.user;
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            if (error.response?.status === 400) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the submitEditUserForm function.
 * 
 * @async
 * @handler
 * @param dialog - A boolean variable containing the state of the dialog window
 *                 containing the form (true = open, false = close).
 */
export const handleEditUserSubmitForm = async (dialog: Ref<boolean>): Promise<void> => {
    const isValid = await formRef.value?.validate();
    // Checks if the form is valid (all fields are filled correctly)
    if (isValid?.valid) {
        await submitEditUserForm(dialog)
            .then()
            .catch((err) => {
                message.value = err;
                console.error('Error:', err)
            });
    }
    else {
        console.log("Error: Invalid form");
    }
};


/**
 * Submits an edit password pop-up form.
 * 
 * @async
 * @returns {Promise<User>} - A User object in case of success.
 *                          - An error message in case of failure.
 * @throws Will rethrow any other errors.
 */
export const submitEditPasswordForm = async (dialog: Ref<boolean>): Promise<User> => {
    handleCheckTokenValidity();

    return await axios.put('http://127.0.0.1:5000/api/user/edit-password', {
        username: formUser.value.username,
        password: formUser.value.password,
        old_password: oldPassword.value
    },
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            emptyForm();
            dialog.value = false;  // Closes the pop-up window
            console.log(response.data.message);

            return response.data.user;
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            if (error.response?.status === 400) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the submitEditPasswordForm function.
 * 
 * @async
 * @handler
 * @param dialog - A boolean variable containing the state of the dialog window
 *                 containing the form (true = open, false = close).
 */
export const handleEditPasswordSubmitForm = async (dialog: Ref<boolean>): Promise<void> => {
    const isValid = await formRef.value?.validate();
    // Checks if the form is valid (all fields are filled correctly)
    if (isValid?.valid) {
        // Checks if the password and the confirm password are matching
        if (formUser.value.password == confirmPassword.value) {
            await submitEditPasswordForm(dialog)
                .then()
                .catch((err) => {
                    message.value = err;
                    console.error('Error:', err)
                });
        }
        else {
            console.log("Error: Passwords don't match");
        }
    }
    else {
        console.log("Error: Invalid form");
    }
};


/**
 * Submits an add user pop-up form.
 * 
 * @async
 * @param dialog - The current state of the dialog window.
 * @returns {Promise<string>} - A message in case of success.
 *                            - An error message in case of failure.
 * @throws Will rethrow any other errors.
 */
export const submitAddUserForm = async (dialog: Ref<boolean>): Promise<string> => {
    handleCheckTokenValidity();

    const payload = cloneDeep(formUser.value);

    return await axios.post('http://127.0.0.1:5000/api/user/', payload,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            dialog.value = false;  // Closes the pop-up window
            console.log(response.data.message);
            
            // Fetches the list of users to update displayed users' data
            getUsers()
                .then((data) => {users.value = data})
                .catch((err) => {console.error('Error:', err)});

            return response.data.message;
        })
        .catch((error: any) => {
            if (error.response?.status === 409) throw error.response.data.message;
            if (error.response?.status === 400) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the submitAddUserForm function.
 * 
 * @async
 * @handler
 * @param dialog - A boolean variable containing the state of the dialog window
 *                 containing the form (true = open, false = close).
 */
export const handleAddUserSubmitForm = async (dialog: Ref<boolean>): Promise<void> => {
    const isValid = await formRef.value?.validate();

    // Checks if the form is valid (all fields are filled correctly)
    if (isValid?.valid) {
        // Checks if the password and the confirm password are matching
        if (formUser.value.password == confirmPassword.value) {
            await submitAddUserForm(dialog)
                .then((data) => {message.value = data})
                .catch((err) => {
                    message.value = err;
                    console.error('Error:', err)
                });
        }
        else {
            console.error("Error: Passwords don't match");
        }
    }
    else {
        console.error("Error: Invalid form");
    }
};


/**
 * Submits a specific user deletion request.
 * 
 * @async
 * @param username - The username of the user to delete.
 * @returns {Promise<void>}
 * @throws Will rethrow any other errors.
 */
export const deleteUser = async (username: string, dialog: Ref<boolean>): Promise<void> => {
    handleCheckTokenValidity();

    return await axios.delete(`http://127.0.0.1:5000/api/user/${username}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            dialog.value = false;
            console.log(response.data.message);

            // Fetches the list of users to update displayed users' data
            getUsers()
            .then((data) => {users.value = data})
            .catch((err) => {
                message.value = err;
                console.error('Error:', err)
            });
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            throw error.response.data.message;
        });
}


/**
 * Handler to wrap the deleteUser function.
 * 
 * @async
 * @handler
 * @param username - The username of the user to delete.
 * @param dialog - A boolean variable containing the state of the dialog window
 *                 containing the form (true = open, false = close).
 */
export const handleDeleteUser = async (username: string, dialog: Ref<boolean>): Promise<void> => {
    await deleteUser(username, dialog)
        .then()
        .catch((err) => {
            message.value = err;
            console.error('Error:', err)
        });
};
