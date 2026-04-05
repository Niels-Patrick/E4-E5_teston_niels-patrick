<!--
Game module.

This module displays the game board and alows the user to play.
-->

<template>
    <h1 class="title">{{ gameMessage }}</h1>

    <v-row class="justify-center">
        <v-card
            class="board"
            color="blue-darken-4"
            variant="tonal"
        >
            <v-btn
                v-for="(cell, i) in board"
                :key="i"
                @click="playHumanTurn(i)"
                class="cell"
                :class="{ locked: cell !== '' }"
                :disabled="disableCells"
            >
                {{ cell }}
            </v-btn>
        </v-card>
    </v-row>

    <v-row class="justify-center">
        <v-btn
            :disabled="disableCells"
            @click="handleSave"
        >
            Save
        </v-btn>

        <v-btn
            :disabled="disableCells"
            @click="handleAbandon"
        >
            Abandon
        </v-btn>
    </v-row>

    <v-row class="justify-center">
        <v-card>
            <v-alert
                v-if="showSuccess"
                title="Game saved"
                type="success"
            />

            <v-alert
                v-if="showError"
                title="Saving failed"
                type="error"
            />
        </v-card>
    </v-row>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { handleGetUser, user } from '../api/users';
    import { getToken, idUser } from '../api/token';
    import { playAiTurn } from '../api/ai';
    import { formGame, game, handleAddGameSubmitForm, handleEditGameSubmitForm } from '../api/games';
    import { format } from 'date-fns';
 

    const board = ref<Array<string> | undefined>(Array(9).fill(""));
    const disableCells = ref(false);
    const gameMessage = ref(`${user.value.username} turn`);
    const showSuccess = ref(false);
    const showError = ref(false);
    const result = ref<string | undefined>(undefined);

    onMounted(async () => {
        getToken();
        await handleGetUser(idUser.value);
        if (formGame.value.gameDate && formGame.value.moves) board.value = formGame.value.moves['moves'];
    });


    /**
     * Stores the human player's mark in the "board" array, then lets the AI play their turn.
     * 
     * @async
     * @function
     * @param i - The played cell's index.
     */
    async function playHumanTurn(i: number): Promise<void> {
        if (board.value) {
            if (!board.value[i]) board.value[i] = "X";
            disableCells.value = true;  // Disabling all cells during AI turn
            if (checkWinner()) {
                handleSave();
                disableCells.value = true;
                return;
            }

            gameMessage.value = "AI turn";
            await playAiTurn(board.value)
                    .then((data) => {
                        board.value = data;
                        disableCells.value = false;
                        gameMessage.value = `${user.value.username} turn`;
                    })
                    .catch((err) => { console.error(err) });
        }

        if (checkWinner()) {
            handleSave();
            disableCells.value = true;
            return;
        }
    };


    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];


    /**
     * Checks if there is a winner or a draw.
     * If there is a winner, writes who it is.
     * 
     * @function
     * @returns - A boolean value set at "true" if there is a winner or a draw, and false if the game isn't over.
     */
    function checkWinner(): boolean {
        let zerosCount = 0;
        for (const line of lines) {
            if (line.every(i => board.value && board.value[i] === "X")) {
                disableCells.value = true;
                gameMessage.value = `${user.value.username} wins!`;
                result.value = "1-0";
                return true;
            }
            
            if (line.every(i => board.value && board.value[i] === "O")) {
                disableCells.value = true;
                gameMessage.value = "AI wins!";
                result.value = "0-1";
                return true;
            }

            if (board.value && board.value.includes("")) {
                zerosCount++;
            }
        }

        if (zerosCount === 0) {
            disableCells.value = true;
            gameMessage.value = "Draw!";
            result.value = "1/2-1/2";
            return true;
        }

        return false;
    };


    let timeout: number;


    function triggerSuccess(): void {
        showSuccess.value = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => { showSuccess.value = false }, 3000); // disappears after 3 seconds
    };


    function triggerError(): void {
        showError.value = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => { showError.value = false }, 3000); // disappears after 3 seconds
    };


    /**
     * Handles the game saving process.
     * 
     * @function
     * @async
     */
    async function handleSave(): Promise<void> {
        formGame.value.gameDate = format(new Date(), 'yyyy-MM-dd');
        formGame.value.gameResult = result.value;
        formGame.value.idUserX = idUser.value;
        formGame.value.idUserO = undefined;
        formGame.value.moves = {
            "moves": board.value,
            "result": result.value
        };

        try {
            if (game.value.idGame === undefined) handleAddGameSubmitForm();
            else handleEditGameSubmitForm();
            triggerSuccess();
        } catch {
            triggerError();
        }
    };


    /**
     * Handles the game saving process when abandoning the game.
     * 
     * @function
     * @async
     */
    async function handleAbandon(): Promise<void> {
        disableCells.value = true;
        formGame.value.gameDate = format(new Date(), 'yyyy-MM-dd');
        formGame.value.gameResult = "0-1";
        formGame.value.idUserX = idUser.value;
        formGame.value.idUserO = undefined;
        formGame.value.moves = {
            "moves": board.value,
            "result": "0-1"
        };

        try {
            if (game.value.idGame === undefined) handleAddGameSubmitForm();
            else handleEditGameSubmitForm();
            triggerSuccess();
        } catch {
            triggerError();
        }
    };
</script>

<style scoped>
    .board {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-template-rows: repeat(3, 100px);
    gap: 5px;
    }

    .cell {
    font-size: 60px;
    color: white;
    background-color: black;
    height: 100px;
    width: 100px;
    min-width: 100px;
    min-height: 100px;
    padding: 0;
    }

    .cell.locked {
    pointer-events: none;
    }

    .title {
        color: black;
    }
</style>
