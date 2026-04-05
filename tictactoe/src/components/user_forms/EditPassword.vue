<!--
Edit Password module.

This module provides a pop-up form to edit an existing user's password.
-->

<template>
    <div class="px-0 py-4 text-center">
        <v-dialog
            v-model="editPasswordDialog"
            width="50%"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <!-- The button that opens the pop-up form -->
                <v-btn
                    icon
                    v-bind="activatorProps"
                    @click="preFillForm(user)"
                    class="tiny-btn"
                >
                    <v-icon>mdi-lock</v-icon>
                    <v-tooltip activator="parent" text="Edit Password" />
                </v-btn>
            </template>
            
            <v-form @submit.prevent="handleFormSubmit" ref="formRef">
                <v-sheet>
                    <!-- Used only to display the form's title -->
                    <v-card
                        prepend-icon="mdi-lock"
                        title="Edit Password"
                        color="white"
                    >
                    <v-card-text>
                        <v-row dense class="justify-center">
                            <!-- Old password field -->
                            <v-col
                                cols="12"
                                md="6"
                                sm="6"
                            >
                                <v-text-field
                                    label="Old Password"
                                    :type="showOldPassword ? 'text' : 'password'"
                                    v-model="oldPassword"
                                    :rules="oldPasswordRules"
                                    :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="showOldPassword = !showOldPassword"
                                    required
                                />
                            </v-col>

                            <!-- New password field -->
                            <v-col
                                cols="12"
                                md="6"
                                sm="6"
                            >
                                <v-text-field
                                    label="New Password"
                                    :type="showPassword ? 'text' : 'password'"
                                    v-model="newPassword"
                                    :rules="passwordRules"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="showPassword = !showPassword"
                                    required
                                />
                            </v-col>

                            <!-- Confirm password field -->
                            <v-col
                                cols="12"
                                md="6"
                                sm="6"
                            >
                                <v-text-field
                                    label="Confirm Password"
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    v-model="confirmPassword"
                                    :rules="confirmPasswordRules"
                                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="showConfirmPassword = !showConfirmPassword"
                                    required
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>
            
                    <v-divider />
            
                        <v-card-actions>
                            <v-spacer />
                
                            <!-- Closes pop-up window without submitting -->
                            <v-btn
                                text="Close"
                                variant="plain"
                                @click="() => { editPasswordDialog = false; message = '' }"
                                color="white"
                            />
                
                            <!-- Submits form and closes the pop-up window -->
                            <v-btn
                                text="Save"
                                type="submit"
                                v-model:loading="loading"
                                color="white"
                            />
                        </v-card-actions>
                    </v-card>
                </v-sheet>
            </v-form>

            <v-alert
                v-if="message"
                :color="message.includes('Error') ? 'error' : 'success'"
                class="mt-5"
                variant="elevated"
            >
                {{ message }}
            </v-alert>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import { confirmPasswordRules, oldPasswordRules, passwordRules } from '../../rules/rules';
    import { message, formRef, handleEditPasswordSubmitForm, formUser, confirmPassword, oldPassword, newPassword,
        preFillForm } from '../../api/users';
    import { ref, shallowRef, watch } from 'vue';
    import { loading } from '../../api/login';
    import type { User } from '../../types/users';

    
    message.value = '';

    const editPasswordDialog = shallowRef(false);

    // Defines the properties of the component (like the parameters of a function)
    const parentProps = defineProps<{user: User}>();

    // Used to handle hidden/displayed passwords
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const showOldPassword = ref(false);

    watch(newPassword, () => {
        formUser.value.password = newPassword.value;
    }, { deep: true });


    /**
     * Handles the form submit process by calling the Edit Password Form
     * Submit handler, then it closes the pop-up window.
     * 
     * @async
     * @handler
     */
     async function handleFormSubmit(): Promise<void> {
        loading.value = true;

        try {
            await handleEditPasswordSubmitForm(editPasswordDialog);
        }
        catch (error) {
            console.error('Error submitting edit form:', error);
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
