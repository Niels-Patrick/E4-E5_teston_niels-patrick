<!--
Login module.

This module provides an authentication form to log in the TicTacToe application.
-->

<template>
    <v-container>
        <v-row class="justify-center" v-if="!signIn">
            <v-card
                title="Sign up to TicTacToe"
                width="40%"
            >
                <v-form @submit.prevent="handleFormSignUpSubmit" ref="formRef">
                    <!-- Username field -->
                    <v-col
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                                label="Username"
                                v-model="formUser.username"
                                :rules="nameRules"
                                prepend-icon="mdi-account"
                                required
                        />
                    </v-col>

                    <!-- Email field -->
                    <v-col
                        md="6"
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                            label="Email"
                            v-model="formUser.email"
                            :rules="emailRules"
                            prepend-icon="mdi-at"
                            required
                        />
                    </v-col>

                    <!-- Password field -->
                    <v-col
                        md="6"
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                            label="Password"
                            :type="showPassword ? 'text' : 'password'"
                            v-model="formUser.password"
                            :rules="passwordRules"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            prepend-icon="mdi-lock"
                            required
                        />
                    </v-col>

                    <!-- Confirm password field -->
                    <v-col
                        md="6"
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                            label="Confirm Password"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            v-model="confirmPassword"
                            :rules="confirmPasswordRules"
                            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showConfirmPassword = !showConfirmPassword"
                            prepend-icon="mdi-lock"
                            required
                        />
                    </v-col>

                    <v-btn
                        text="Submit"
                        type="submit"
                        v-model:loading="loading"
                        class="my-4"
                    />
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

        <v-row class="justify-center" v-if="signIn">
            <v-card
                title="Sign in to TicTacToe"
                width="40%"
            >
                <v-form @submit.prevent="handleSubmitLoginForm(router)" ref="formRefLogin">
                    <v-col
                        sm="11"
                        class="px-10"
                    >
                        <v-text-field
                            v-model="username"
                            :rules="usernameLoginRules"
                            label="Username"
                            prepend-icon="mdi-account"
                            required
                        />
                    </v-col>

                    <v-col
                        sm="12"
                        class="px-10"
                    >
                        <v-text-field
                            v-model="password"
                            :rules="passwordLoginRules"
                            label="Password"
                            :type="showPassword ? 'text' : 'password'"
                            prepend-icon="mdi-lock"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            required
                        />
                    </v-col>

                    <v-col>
                        <v-btn
                            text="Submit"
                            type="submit"
                            v-model:loading="loading"
                            class="my-4"
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

        <v-row class="justify-center" v-if="!signIn">
            <v-card width="40%">
                <v-sheet>
                    <v-row>
                        <v-col>
                            <h4>Already have an account?</h4>
                        </v-col>
                        <v-col>
                            <v-btn
                                class="my-4"
                                @click="signIn = true"
                            >
                                Sign In
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-card>
        </v-row>

        <v-row class="justify-center" v-if="signIn">
            <v-card width="40%">
                <v-sheet>
                    <v-row>
                        <v-col>
                            <h4>Don't have an account?</h4>
                        </v-col>
                        <v-col>
                            <v-btn
                                class="my-4"
                                @click="signIn = false"
                            >
                                Sign Up
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-card>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import { username, password, message, formRefLogin, handleSubmitLoginForm, loading } from '../api/login';
    import { usernameLoginRules, passwordLoginRules, emailRules, nameRules, passwordRules,
        confirmPasswordRules } from '../rules/rules';
    import { useRouter } from "vue-router";
    import { onMounted, ref } from 'vue';
    import { formRef, formUser, handleAddUserSubmitForm, confirmPassword } from '@/api/users';
    import { getRoles, roles } from '@/api/roles';


    const router = useRouter();
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const signIn = ref(false);

    onMounted(() => {
        getRoles()
            .then((data) => { roles.value = data })
            .catch((err) => { console.error('Error', err) });
    });


    /**
     * Handles the form submit process by calling the Add User Form Submit handler, then the Get Users handler to
     * refresh the data table.
     * Finally, it closes the pop-up window.
     * 
     * @async
     * @handler
     */
    async function handleFormSignUpSubmit(): Promise<void> {
        loading.value = true;

        roles.value.forEach((role) => {
            if (role.name == "Player") formUser.value.idRole = role.idRole;
            console.warn(role);
        });

        try {
            await handleAddUserSubmitForm(ref(false));
            signIn.value = true;
        }
        catch (error) {
            console.error('Error submitting add user form:', error);
        }
        finally {
            loading.value = false;
        }
    };
</script>
