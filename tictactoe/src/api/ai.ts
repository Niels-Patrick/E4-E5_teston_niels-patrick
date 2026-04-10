/**
 * Module to call the AI model to play a turn.
 */

import { handleCheckTokenValidity } from "./token";
import { apiClient } from './client';


/**
 * Submits an add game pop-up form.
 * 
 * @async
 * @returns {Promise<string[]>} - The updated board in case of success.
 *                              - An error message in case of failure.
 * @throws Will rethrow any other errors.
 */
export const playAiTurn = async (board: string[]): Promise<string[]> => {
    handleCheckTokenValidity();

    return await apiClient.post('/ai/',
    {
        board: board,
        aiMark: "O"
    },
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            console.log(response.data.message);

            return response.data.board;
        })
        .catch((error: any) => { throw error.response.data.message });
};
