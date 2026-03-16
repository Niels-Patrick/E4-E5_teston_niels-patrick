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
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { handleGetUser } from '../api/users';
    import { getToken, idUser } from '../api/token';
    import { playAiTurn } from '@/api/ai';
    import { formGame } from '@/api/games';
 

    const board = ref<Array<string> | undefined>(Array(9).fill(""));
    const disableCells = ref(false);
    const gameMessage = ref("Game Start");
    
    onMounted(async () => {
        getToken();
        await handleGetUser(idUser.value);
        if (formGame.value.gameDate && formGame.value.moves) board.value = formGame.value.moves['game'];
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
            if (checkWinner()) return;

            await playAiTurn(board.value)
                    .then((data) => {
                        console.warn(data);
                        board.value = data;
                        disableCells.value = false;
                    })
                    .catch((err) => { console.error(err) });
        }

        if (checkWinner()) return;
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
            if (line.every(i => { if (board.value) board.value[i] === "X"} )) {
                disableCells.value = true;
                gameMessage.value = "X wins";
                return true;
            }
            
            if (line.every(i => { if (board.value) board.value[i] === "O"})) {
                disableCells.value = true;
                gameMessage.value = "O wins";
                return true;
            }
            
            if (board.value && board.value.includes("")) {
                zerosCount++;
            }
        }

        if (zerosCount === 0) {
            disableCells.value = true;
            gameMessage.value = "Draw";
            return true;
        }

        return false;
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
