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
                v-if="game.idGame === '0'"
            >
                <v-btn @click="redirection('/game', true)">Load Game</v-btn>
            </v-row>
        </e-card>
    </v-row>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import { handleGetUser, user } from '../api/users';
    import { getToken, idUser } from '../api/token';
    import { useRouter } from 'vue-router';
    import { emptyForm, game, handleLoadsGame, preFillForm } from '../api/games';
 

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
        if (!load) {
            emptyForm();
            router.push(route);
        }

        if (load) {
            preFillForm(game.value);
            router.push(route);
        }
    };
</script>

<style>
    .title {
        color: black;
    }
</style>
