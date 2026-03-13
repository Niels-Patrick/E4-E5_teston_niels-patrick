<!--
Delete User module.

This module provides a button to delete a specific user from the database.
The process takes place in 2 steps, with a pop-up confirmation window opening
up when clicking on the delete button.
-->

<template>
    <div class="px-0 py-4 text-center">
        <v-dialog
            v-model="deleteUserDialog"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <!-- The button that opens the pop-up confirmation window -->
                <v-btn
                    icon
                    color="error"
                    v-bind="activatorProps"
                    class="tiny-btn"
                >
                    <v-icon>mdi-account-remove</v-icon>
                    <v-tooltip activator="parent" text="Delete User" />
                </v-btn>
            </template>
            
            <v-form v-if="user.username" @submit.prevent="handleDelete(user.username)" ref="formRef">
                <v-sheet>
                    <!-- Used only to display the pop-up window title -->
                    <v-card
                        prepend-icon="mdi-lock"
                        title="Confirm Deletion"
                    >
                    <v-card-text class="text-center">
                        <h3>Are you sure you want to delete this user?</h3>
                    </v-card-text>
            
                    <v-divider />
            
                        <v-card-actions>
                            <v-spacer />
                
                            <!-- Closes pop-up window without submitting -->
                            <v-btn
                                text="No"
                                variant="plain"
                                @click="deleteUserDialog = false"
                            />
                
                            <!-- Submits deletion request and closes the pop-up window -->
                            <v-btn
                                text="Yes"
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
    import { shallowRef } from 'vue';
    import { handleDeleteUser } from '../../api/users';
    import { loading } from '../../api/login';
    import type { User } from '../../types/users';


    const deleteUserDialog = shallowRef(false);

    // Defines the properties of the component (like the parameters of a function)
    const parentProps = defineProps<{user: User}>();


    /**
     * Handles the submit process by calling the Delete User handler, then
     * the Get Users handler to refresh the data table.
     * Finally, it closes the pop-up window.
     * 
     * @async
     * @handler
     * 
     * @param username - The username of the user to delete.
     */
    async function handleDelete(username: string): Promise<void> {
        loading.value = true;

        try {
            await handleDeleteUser(username, deleteUserDialog);
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
