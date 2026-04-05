/**
 * Module to call monitoring related routes.
 */

import { handleCheckTokenValidity } from "./token";
import axios from "axios";
import { cloneDeep } from 'lodash';
import { ref } from "vue";


export const loading = ref<boolean>(false);  // Boolean to manage loading animation
export const message = ref<string>("");

export const formRetrain = ref({
    populationSize: 100,
    gamesPerEval: 60,
    mutationRate: 0.05,
    mutationStd: 0.15,
    generations: 200
});


/**
 * Empties the retrain form fields
 * 
 * @function
 * @returns {void}
 */
export function setFormToDefault(): void {
    formRetrain.value.populationSize = 100;
    formRetrain.value.gamesPerEval = 60;
    formRetrain.value.mutationRate = 0.05;
    formRetrain.value.mutationStd = 0.15;
    formRetrain.value.generations = 200;
};


/**
 * Submits an retrain model request to backend.
 * 
 * @async
 * @returns {Promise<string>} - A success message.
 *                            - An error message in case of failure.
 * @throws Will rethrow any other errors.
 */
export const retrainModel = async (): Promise<string> => {
    handleCheckTokenValidity();

    const payload = cloneDeep(formRetrain.value);

    return await axios.post('http://127.0.0.1:5000/api/monitoring/retrain-model', payload,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            console.log(response.data.message);

            return response.data.message;
        })
        .catch((error: any) => { throw error.response.data.message });
};


/**
 * Submits an retrain model request to backend.
 * 
 * @async
 * @returns {Promise<string>} - A success message.
 *                            - An error message in case of failure.
 * @throws Will rethrow any other errors.
 */
export const getTrainingResult = async (): Promise<string> => {
    handleCheckTokenValidity();

    const payload = cloneDeep(formRetrain.value);

    return await axios.post('http://127.0.0.1:5000/api/monitoring/retrain-model', payload,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then((response) => {
            console.log(response.data.message);

            return response.data.message;
        })
        .catch((error: any) => { throw error.response.data.message });
};
