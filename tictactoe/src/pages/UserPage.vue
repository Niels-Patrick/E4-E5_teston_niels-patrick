<!--
User Page module.

This module displays the logged in user's information.
This module also allows the user to edit their information (except their role, of course).
-->

<template>
    <v-row class="justify-center">
        <e-card
            title="Profile page"
            class="center-align"
            prepend-icon="mdi-account"
            width="25%"
        >
            <v-list line="four">
                <v-list-item>
                    <v-list-item-subtitle>Username</v-list-item-subtitle>
                    <v-list-item-title>{{ user?.username }}</v-list-item-title>
                </v-list-item>

                <e-divider />

                <v-list-item>
                    <v-list-item-subtitle>Email</v-list-item-subtitle>
                    <v-list-item-title>{{ user?.email }}</v-list-item-title>
                </v-list-item>

                <e-divider />

                <v-list-item>
                    <v-list-item-subtitle>Role</v-list-item-subtitle>
                    <v-list-item-title>{{ user?.role?.name }}</v-list-item-title>
                </v-list-item>
            </v-list>

            <v-row justify="space-around">
                <v-col class="mx-2">
                    <EditUser :user="user" parentType="UserPage" />
                </v-col>
                <v-col class="mx-2">
                    <EditPassword :user="user" />
                </v-col>
            </v-row>
        </e-card>
    </v-row>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import { getUser, message, user, formUser, handleGetUser } from '../api/users';
    import { getToken, idUser } from '../api/token';
    import EditUser from '../components/user_forms/EditUser.vue';
    import EditPassword from '../components/user_forms/EditPassword.vue';


    message.value = '';

    // Gets the current session user's data and their role's data
    onMounted(async () => {
        getToken();

        await handleGetUser(idUser.value);

        await getUser(idUser.value)
            .then((data) => {formUser.value = data})
            .catch((err) => {console.error('Error:', err)});
    });
</script>
