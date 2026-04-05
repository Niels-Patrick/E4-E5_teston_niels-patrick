<!--
Home Page module.

This module is a temporary dummy home page.
-->

<template>
    <v-row class="justify-center">
        <e-card
            title="Home page"
            class="title"
            variant="plain"
        >
            <h1>Tic Tac Toe</h1>
            <h3>{{ `Welcome, ${user?.username}!` }}</h3>

            <v-row class="justify-center">
                <v-btn @click="redirection('/game', false)">New Game</v-btn>
            </v-row>
            <v-row
                class="justify-center"
                v-if="game.idGame"
            >
                <v-btn @click="redirection('/game', true)">Load Last Game [{{ game.gameDate }}]</v-btn>
            </v-row>
        </e-card>
    </v-row>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import { handleGetUser, user } from '../api/users';
    import { getToken, idUser } from '../api/token';
    import { useRouter } from 'vue-router';
    import { emptyForm, formGame, game, handleEditGameSubmitForm, handleLoadsGame, preFillForm } from '../api/games';
    import { format } from 'date-fns';
 

    // Used for redirections when clicking on a page name in the navigation drawer
    const router = useRouter();
    
    onMounted(async () => {
        getToken();
        await handleGetUser(idUser.value);
        await handleLoadsGame();
    });

    
    /**
     * Redirects to the specified route.
     * 
     * @function
     * @param route - The URL route to redirect to.
     */
    function redirection(route: string, load: boolean): void {
        if (load) {
            handleSave();
            preFillForm(game.value);
            router.push(route);
        }

        if (!load) {
            emptyForm();
            router.push(route);
        }
    };


    /**
     * Handles the game saving process.
     * 
     * @function
     * @async
     */
    async function handleSave(): Promise<void> {
        formGame.value.gameDate = format(new Date(), 'yyyy-MM-dd');
        formGame.value.gameResult = "0-1";
        formGame.value.idUserX = idUser.value;
        formGame.value.idUserO = undefined;
        formGame.value.moves = {
            "moves": game.value.moves!["moves"],
            "result": "0-1"
        };

        handleEditGameSubmitForm();
    };
</script>

<style>
    .title {
        color: black;
    }
</style>
