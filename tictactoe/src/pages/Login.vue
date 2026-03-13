<!--
Login module.

This module provides an authentication form to log in the TicTacToe application.
-->

<template>
    <v-container>
        <v-row class="justify-center">
            <v-card
                title="Sign in to TicTacToe"
                width="40%"
            >
                <v-form @submit.prevent="handleSubmitLoginForm(router)" ref="formRef">
                    <v-col
                        sm="11"
                    >
                        <v-text-field
                            v-model="username"
                            :rules="usernameLoginRules"
                            label="Username"
                            prepend-icon="mdi-account"
                        />
                    </v-col>

                    <v-col
                        sm="12"
                    >
                        <v-text-field
                            v-model="password"
                            :rules="passwordLoginRules"
                            label="Password"
                            :type="showPassword ? 'text' : 'password'"
                            prepend-icon="mdi-lock"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                        />
                    </v-col>

                    <v-col>
                        <v-btn
                            text="Submit"
                            type="submit"
                            v-model:loading="loading"
                        />
                    </v-col>
                </v-form>

                <v-alert
                    v-if="message"
                    :color="message.includes('Error') ? 'error' : 'success'"
                    class="mt-5"
                    variant="elevated"
                >
                    {{ message }}
                </v-alert>
            </v-card>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import { username, password, message, formRef, handleSubmitLoginForm, loading} from '../api/login';
    import { usernameLoginRules, passwordLoginRules } from '../rules/rules';
    import { useRouter } from "vue-router";
    import { ref } from 'vue';


    const router = useRouter();

    const showPassword = ref(false);
</script>
