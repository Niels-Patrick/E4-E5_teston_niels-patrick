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
            <v-card-text>
                {{ `Welcome, ${user?.username}!` }}
            </v-card-text>
        </e-card>
    </v-row>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import { handleGetUser, user } from '../api/users';
    import { getToken, idUser } from '../api/token';
 

    onMounted(async () => {
        getToken();
        await handleGetUser(idUser.value);
    });
</script>

<style>
    .title {
        color: black;
    }
</style>
