<!--
Edit User module.

This module provides a pop-up form to edit an existing user's information.
The EditRole module is called only if this module is called by the
AdminDashboard module.
-->

<template>
    <div class="px-0 py-4 text-center">
        <v-dialog
            v-model="editUserDialog"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <!-- The button that opens the pop-up form -->
                <v-btn
                    icon
                    v-bind="activatorProps"
                    @click="preFillForm(user)"
                    class="tiny-btn"
                >
                    <v-icon>mdi-account-edit</v-icon>
                    <v-tooltip activator="parent" text="Edit User" />
                </v-btn>
            </template>
            
            <v-form @submit.prevent="handleFormSubmit" ref="formRef">
                <v-sheet>
                    <!-- Used only to display the form's title -->
                    <v-card
                        prepend-icon="mdi-account-edit"
                        title="Edit User"
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

                            <!--
                            Role dropdown menu
                            Only displayed if this component is called by AdminDashboard
                             -->
                            <EditRole v-if="displayEditRole" />
                        </v-row>
                    </v-card-text>
            
                    <v-divider />
            
                        <v-card-actions>
                            <v-spacer />
                
                            <!-- Closes pop-up window without submitting -->
                            <v-btn
                                text="Close"
                                variant="plain"
                                @click="() => { editUserDialog = false; message = '' }"
                            />
                
                            <!-- Submits form and closes the pop-up window -->
                            <v-btn
                                text="Save"
                                type="submit"
                                v-model:loading="loading"
                            />
                        </v-card-actions>
                    </v-card>
                </v-sheet>
            </v-form>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
    import { nameRules, emailRules } from '../../rules/rules';
    import { preFillForm, message, formRef, handleEditUserSubmitForm, formUser } from '../../api/users';
    import EditRole from './EditRole.vue';
    import { computed, shallowRef } from 'vue';
    import { loading } from '../../api/login';
    import type { User } from '../../types/users';

    
    message.value = '';

    const editUserDialog = shallowRef(false);

    // Defines the properties of the component (like the parameters of a function)
    const parentProps = defineProps<{
        parentType: string;
        user: User;
    }>();

    // Restrict the access to this child component to the AdminDashboard parent component only
    const displayEditRole = computed(() => parentProps.parentType === 'AdminDashboard');

    
    /**
     * Handles the form submit process by calling the Edit User Form Submit
     * handler, then the Get Users handler to refresh the data table.
     * Finally, it closes the pop-up window.
     * 
     * @async
     * @handler
     */
    async function handleFormSubmit(): Promise<void> {
        loading.value = true;

        try {
            await handleEditUserSubmitForm(editUserDialog);
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
