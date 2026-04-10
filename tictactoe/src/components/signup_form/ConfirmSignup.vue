<!--
Confirm Signup module.

This module provides a button to confirm the user's account creation.
The user has to accepts the terms of agreement to confirm his account creation.
The process takes place in 2 steps, with a pop-up confirmation window opening up when clicking on the confirm button.
-->

<template>
    <div class="px-0 py-4 text-center">
        <v-dialog
            v-model="confirmSignupDialog"
            width="50%"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <!-- The button that opens the pop-up confirmation window -->
                <v-btn
                    v-bind="activatorProps"
                    text="Sign Up"
                />
            </template>
            
            <v-form v-if="formUser" @submit.prevent="handleFormSignUpSubmit()" ref="formRef">
                <v-sheet>
                    <!-- Used only to display the pop-up window title -->
                    <v-card
                        prepend-icon="mdi-account-plus"
                        title="Confirm Account Creation"
                        color="white"
                    >
                    <v-card-text class="text-center">
                        <h3>Terms of Agreement</h3>
                        <div>
                            <p>
                                By creating an account on TicTacToe AI, you agree to the following terms:
                            </p>
                            <p>
                                Your email address is stored in the TicTacToe AI database.
                            </p>
                            <p>
                                Your email address will be used solely for password recovery.
                            </p>
                            <p>
                                You will be able to delete your account at any time, from your user profile page.
                            </p>
                        </div>
                    </v-card-text>
            
                    <v-divider />
            
                        <v-card-actions>
                            <v-spacer />
                
                            <!-- Closes pop-up window without submitting -->
                            <v-btn
                                text="No, I Disagree"
                                variant="plain"
                                @click="confirmSignupDialog = false"
                                color="white"
                            />
                
                            <!-- Submits deletion request and closes the pop-up window -->
                            <v-btn
                                text="Yes, I Agree"
                                type="submit"
                                v-model:loading="loading"
                                color="white"
                            />
                        </v-card-actions>
                    </v-card>
                </v-sheet>
            </v-form>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, shallowRef } from 'vue';
    import { loading, signIn } from '../../api/login';
    import { formUser, message, submitAddUserForm, formRef } from '@/api/users';
    import { roles } from '@/api/roles';


    const confirmSignupDialog = shallowRef(false);

    // Defines the properties of the component (like the parameters of a function)
    const parentProps = defineProps<{formUser: any}>();


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
            await submitAddUserForm(ref(false))
                    .then((data) => {message.value = data})
                    .catch((err) => {message.value = err});
            if (message.value.includes("Success")) signIn.value = true;

        }
        catch (error) {
            console.error('Error submitting add user form:', error);
        }
        finally {
            loading.value = false;
        }
    };
</script>

<style scoped>
    .tiny-btn {
        min-width: 35px;
        height: 35px;
    }
</style>
