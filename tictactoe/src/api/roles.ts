/**
 * Module to store the Role object definition and all role related functions and variables.
 */

import { ref } from 'vue';
import { handleCheckTokenValidity } from './token';
import { apiClient } from './client';


// Definition of type Role
export type Role = {
    idRole: string
    name: string
};

export const roles = ref<Role[]>([]);
export const role = ref<Role>();


/**
 * Fetches the list of roles' data from the backend.
 *
 * @async
 * @function
 * @returns {Promise<Role[]>} - An array of Role objects if the request is
 *                              successful.
 * @throws Will rehtrow any other errors.
 */
export const getRoles = async (): Promise<Role[]> => {
    handleCheckTokenValidity();

    return await apiClient.get('/role/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then((response) => {
            console.log(response.data.message);
            return response.data.roles;
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            throw error.response.data.message;
        });
};
