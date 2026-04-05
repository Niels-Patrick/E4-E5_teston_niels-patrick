<!--
Add User module.

This module provides a pop-up form to add a new user in the database.
-->

<template>
    <div class="pa-4 text-center">
        <v-dialog
            v-model="addUserDialog"
            width="50%"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <!-- The button that opens the pop-up form -->
                <v-btn
                    prepend-icon="mdi-account-plus"
                    text="Add User"
                    v-bind="activatorProps"
                    @click="emptyForm"
                />
            </template>

            <v-form @submit.prevent="handleFormSubmit" ref="formRef">
                <v-sheet>
                    <!-- Used only to display the form's title -->
                    <v-card
                        prepend-icon="mdi-account-plus"
                        title="Add User"
                        color="white"
                    >
                    <v-card-text>
                        <v-row dense class="justify-center">
                            <!-- Email field -->
                            <v-col
                                cols="12"
                                md="6"
                                sm="6"
                            >
                                <v-text-field
                                    label="Email"
                                    v-model="formUser.email"
                                    :rules="emailRules"
                                    required
                                />
                            </v-col>

                            <!-- Username field -->
                            <v-col
                                cols="12"
                                sm="6"
                            >
                                <v-text-field
                                        label="Username"
                                        v-model="formUser.username"
                                        :rules="nameRules"
                                        required
                                />
                            </v-col>

                            <!-- Role dropdown menu -->
                            <EditRole v-if="displayEditRole" />

                            <!-- Password field -->
                            <v-col
                                cols="12"
                                md="6"
                                sm="6"
                            >
                                <v-text-field
                                    label="Password"
                                    :type="showPassword ? 'text' : 'password'"
                                    v-model="formUser.password"
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
                                color="white"
                                @click="() => { addUserDialog = false; message = '' }"
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
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import { nameRules, emailRules, passwordRules, confirmPasswordRules} from '../../rules/rules';
    import { message, formRef, confirmPassword, formUser, handleAddUserSubmitForm, emptyForm } from '../../api/users';
    import EditRole from './EditRole.vue';
    import { computed, ref, shallowRef } from 'vue';
    import { loading } from '../../api/login';

    
    message.value = '';

    const addUserDialog = shallowRef(false);

    // Used to handle hidden/displayed passwords
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    // Defines the properties of the component (like the parameters of a function)
    const parentProps = defineProps<{ parentType: string }>();

    // Restrict the access to this child component to the AdminDashboard parent component only
    const displayEditRole = computed(() => parentProps.parentType === 'AdminDashboard');

    
    /**
     * Handles the form submit process by calling the Add User Form Submit
     * handler, then the Get Users handler to refresh the data table.
     * Finally, it closes the pop-up window.
     * 
     * @async
     * @handler
     */
    async function handleFormSubmit(): Promise<void> {
        loading.value = true;

        try {
            await handleAddUserSubmitForm(addUserDialog);
        }
        catch (error) {
            console.error('Error submitting add user form:', error);
        }
        finally {
            loading.value = false;
        }
    };
</script>
