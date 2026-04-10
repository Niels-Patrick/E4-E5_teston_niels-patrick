/**
 * Module to store all functions and variables related to login and logout management.
 */

import { ref } from "vue";
import type { Router } from "vue-router";
import { handleCheckTokenValidity } from "./token";
import { apiClient } from './client';

export const formRefLogin = ref();  // Used to check if a form is valid or not
export const username = ref('');
export const password = ref('');
export const message = ref('');  // Message to display when submitting form
export const loading = ref(false);  // Boolean to manage loading animation
export const signIn = ref(true);


/**
 * Submits the login form and handles the authentication, then stores the
 * access and refresh tokens in local storage.
 *
 * @async
 * @function
 * @returns {Promise<void>}
 * @throws Will rethrow any other errors.
 */
export const submitLoginForm = async (router: Router): Promise<void> => {
    await handleCheckTokenValidity();

    return await apiClient.post('/login/', {
        username: username.value,
        password: password.value
    })
        .then((response) => {
            // Stores locally the access and refresh tokens
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);

            // Empties the login form (in case of a redirection after tokens expiration)
            username.value = '';
            password.value = '';

            console.log(response.data.message);
            // Redirects to the home page when successfully authenticated
            router.push('/home-page');
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            if (error.response?.status === 401) throw error.response.data.message;
            if (error.response?.status === 400) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the submitLoginForm function.
 *
 * @async
 * @handler
 */
export const handleSubmitLoginForm = async (router: Router): Promise<void> => {
    loading.value = true;

    // Checks if the submitted form respects the defined rules
    const isValid = await formRefLogin.value?.validate();
    if (isValid?.valid) {
        await submitLoginForm(router)
            .then()
            .catch((err) => {
                message.value = err;
                console.error('Error:', err)
            });
    } else {
        console.error("Error: Invalid form");
    }

    loading.value = false;
};


/**
 * Submits the login form and handles the authentication.
 *
 * @async
 * @function
 * @param username - The username of the current session's user.
 * @returns {Promise<void>}
 * @throws Will rethrow any other errors.
 */
export const submitLogout = async (): Promise<void> => {
    await handleCheckTokenValidity();

    return await apiClient.delete('/login/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            // Deletes the access token from local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Refreshes the page and, since there's no more token, redirects to login
            window.location.reload();
            console.log(response.data.message);
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the submitLogout function.
 *
 * @async
 * @handler
 * @param username - The username of the current session's user.
 */
export const handleSubmitLogout = async (): Promise<void> => {
    loading.value = true;

    await submitLogout()
        .then()
        .catch((err) => {console.error('Error:', err)});

    loading.value = false;
};
