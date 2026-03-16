/**
 * Module to store the Game object definition and all game related functions and variables.
 */

import axios from 'axios';
import { ref, type Ref } from 'vue';
import { handleCheckTokenValidity } from './token';
import type { Game, GameRead } from '../types/games';
import { cloneDeep } from 'lodash';

export const message = ref('');  // Message to display when submitting form
export const formRef = ref();  // Used to check if a form is valid or not

export const games = ref<GameRead[]>([]);  // List of Games

// Another declaration to use in game related form
export const formGame = ref<Game>({
    gameDate: undefined,
    gameResult: undefined,
    moves: undefined,
    idUserX: undefined,
    idUserO: undefined
});

// Declaration of a Game object
export const game = ref<GameRead>({ idGame: '0' });
game.value = formGame.value;


/**
 * Pre-fills a form using a specific game's data.
 * 
 * @function
 * @param item - A specific game's data.
 * @returns {void}
 */
export function preFillForm(item: Game) {
    formGame.value.gameDate = item.gameDate;
    formGame.value.gameResult = item.gameResult;
    formGame.value.moves = item.moves;
    formGame.value.idUserX = item.idUserX;
    formGame.value.idUserO = item.idUserO;
};


/**
 * Empties the game form fields
 * 
 * @function
 * @returns {void}
 */
export function emptyForm(): void {
    formGame.value.gameDate = '';
    formGame.value.gameResult = '';
    formGame.value.moves = {};
    formGame.value.idUserX = '';
    formGame.value.idUserO = '';
    message.value = '';
};


/**
 * Loads the saved game's data from the backend.
 * 
 * @async
 * @returns {Promise<Game>} - A Game object if the request is successful.
 * @throws Will rethrow any other errors.
 */
export const loadsGame = async (): Promise<GameRead | null> => {
    handleCheckTokenValidity();

    return await axios.get<{ game: GameRead, message: string }>(`http://127.0.0.1:5000/api/game/last-game`, {
        headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
    })
        .then((response) => {
            console.log(response.data.message);
            return response.data.game;
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the loadsGame function.
 * 
 * @async
 * @handler
 */
export const handleLoadsGame = async (): Promise<void> => {
    await loadsGame()
        .then((data) => {
            if (data !== null) game.value = data
            else {
                emptyForm();
                game.value = formGame.value;
            }
        })
        .catch((err) => {
            message.value = err;
            console.error('Error:', err)
        });
};


/**
 * Fetches the list of games' data from the backend.
 * 
 * @async
 * @returns {Promise<Game[]>} - An array of Game objects if the request is successful.
 * @throws Will rethrow any other errors.
 */
export const getGames = async (): Promise<GameRead[]> => {
    handleCheckTokenValidity();

    return await axios.get<{ games: GameRead[], message: string }>('http://127.0.0.1:5000/api/game/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            console.log(response.data.message);
            return response.data.games;
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the getGames function.
 * 
 * @async
 * @handler
 */
export const handleGetGames = async (): Promise<void> => {
    await getGames()
        .then((data) => {games.value = data})
        .catch((err) => {
            message.value = err;
            console.error('Error:', err)
        });
};


/**
 * Submits an edit game pop-up form.
 * 
 * @async
 * @returns {Promise<Game>} - A Game object in case of success.
 *                          - An error message in case of failure.
 * @throws Will rethrow any other errors.
 */
export const submitEditGameForm = async (dialog: Ref<boolean>): Promise<Game> => {
    handleCheckTokenValidity();

    const payload = cloneDeep(formGame.value);

    return await axios.put(`http://127.0.0.1:5000/api/game/`, payload,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            dialog.value = false;  // Closes the pop-up window
            console.log(response.data.message);

            // Fetches the list of games to update displayed games' data
            getGames()
                .then((data) => {games.value = data})
                .catch((err) => {console.error('Error:', err)});

            return response.data.game;
        })
        .catch((error: any) => {
            if (error.response?.status === 404) throw error.response.data.message;
            if (error.response?.status === 400) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the submitEditGameForm function.
 * 
 * @async
 * @handler
 * @param dialog - A boolean variable containing the state of the dialog window containing the form (true = open,
 *                 false = close).
 */
export const handleEditGameSubmitForm = async (dialog: Ref<boolean>): Promise<void> => {
    const isValid = await formRef.value?.validate();
    // Checks if the form is valid (all fields are filled correctly)
    if (isValid?.valid) {
        await submitEditGameForm(dialog)
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
 * Submits an add game pop-up form.
 * 
 * @async
 * @param dialog - The current state of the dialog window.
 * @returns {Promise<Game>} - A Game object in case of success.
 *                          - An error message in case of failure.
 * @throws Will rethrow any other errors.
 */
export const submitAddGameForm = async (dialog: Ref<boolean>): Promise<Game> => {
    handleCheckTokenValidity();

    const payload = cloneDeep(formGame.value);

    return await axios.post('http://127.0.0.1:5000/api/game/', payload,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            dialog.value = false;  // Closes the pop-up window
            console.log(response.data.message);
            
            // Fetches the list of games to update displayed games' data
            getGames()
                .then((data) => {games.value = data})
                .catch((err) => {
                    message.value;
                    console.error('Error:', err)
                });

            return response.data.message;
        })
        .catch((error: any) => {
            if (error.response?.status === 409) throw error.response.data.message;
            if (error.response?.status === 400) throw error.response.data.message;
            throw error.response.data.message;
        });
};


/**
 * Handler to wrap the submitAddGameForm function.
 * 
 * @async
 * @handler
 * @param dialog - A boolean variable containing the state of the dialog window containing the form (true = open,
 *                 false = close).
 */
export const handleAddGameSubmitForm = async (dialog: Ref<boolean>): Promise<void> => {
    const isValid = await formRef.value?.validate();

    // Checks if the form is valid (all fields are filled correctly)
    if (isValid?.valid) {
        await submitAddGameForm(dialog)
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
 * Submits a specific game deletion request.
 * 
 * @async
 * @param id - The ID of the game to delete.
 * @returns {Promise<void>}
 * @throws Will rethrow any other errors.
 */
export const deleteGame = async (id: string, dialog: Ref<boolean>): Promise<void> => {
    handleCheckTokenValidity();

    return await axios.delete(`http://127.0.0.1:5000/api/game/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            dialog.value = false;
            console.log(response.data.message);

            // Fetches the list of games to update displayed games' data
            getGames()
            .then((data) => {games.value = data})
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
 * Handler to wrap the deleteGame function.
 * 
 * @async
 * @handler
 * @param id - The Id of the game to delete.
 * @param dialog - A boolean variable containing the state of the dialog window containing the form (true = open,
 *                 false = close).
 */
export const handleDeleteGame = async (id: string, dialog: Ref<boolean>): Promise<void> => {
    await deleteGame(id, dialog)
        .then()
        .catch((err) => {
            message.value = err;
            console.error('Error:', err)
        });
};
