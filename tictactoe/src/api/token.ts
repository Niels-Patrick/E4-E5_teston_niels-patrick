/**
 * Module to store the JwtPayload object definition and all JWT token related functions and variables.
 */

import { jwtDecode } from "jwt-decode";
import { ref } from "vue";
import { handleSubmitLogout } from "./login";
import type { Role } from "./roles";
import { apiClient } from './client';


// To store user's data
export const idUser = ref('');
export const username = ref('');
export const email = ref('');
export const role = ref('');

// Definition of interface JwtPayload
export interface JwtPayload {
    sub: string
    username: string
    email: string
    role: Role
};


/**
 * Gets the current user's information contained in the JWT token
 *
 * @function
 */
export function getToken(): void {
    const token = localStorage.getItem('access_token') || '';

    if (token) {
        const decoded = jwtDecode<JwtPayload>(token);

        idUser.value = decoded.sub;
        username.value = decoded.username;
        email.value = decoded.email;
        role.value = decoded.role.name;
    }
};


/**
 * Refreshes a JWT token and stores it.
 *
 * @async
 * @function
 *
 * @param username - The username of the current sessions's user.
 *
 * @returns {Promise<void>}
 *
 * @throws Will rethrow any other errors.
 */
export const refreshTokens = async (): Promise<void> => {
    return await apiClient.get('/token/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
        }
    })
        .then((response) => {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            console.log(response.data.message);
        })
        .catch((error: any) => {
            if (error.response?.status === 400) throw error.response.data.message;
            if (error.response?.status === 401) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Checks the time validity of the current session access or refresh token.
 *
 * @async
 * @function
 *
 * @returns {Promise<boolean>}
 *  - True if the token is still valid or false if it has expired.
 *  - A message in case of failure.
 */
export const checkTokenValidity = async (token: string | null): Promise<boolean> => {
    return await apiClient.post('/token/', {
        token: token
    })
        .then((response) => {
            console.log(response.data.message);
            return response.data.result;
        })
        .catch((error: any) => {
            if (error.response?.status === 400) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to manage the token validity checking.
 *
 * @async
 * @handler
 */
export const handleCheckTokenValidity = async (): Promise<void> => {
    const token = localStorage.getItem('access_token');
    var accessTokenValidity = false;
    var refreshTokenValidity = false;

    if (token) {
        // Checking the tokens time validity and refreshes it if expired.
        await checkTokenValidity(localStorage.getItem('access_token'))
            .then((data) => {accessTokenValidity = data})
            .catch((err) => {console.error('Error:', err)});

        await checkTokenValidity(localStorage.getItem('refresh_token'))
            .then((data) => {refreshTokenValidity = data})
            .catch((err) => {console.error('Error:', err)});

        if (!accessTokenValidity) {
            if (!refreshTokenValidity) {
                // If both access token and refresh token have expired, the user is logged out.
                handleSubmitLogout();
            }
            else {
                await refreshTokens();
            }
        }
    }
};
