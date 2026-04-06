<!--
Confirm Retrain module.

This module provides a button to confirm the launch of the model retraining.
The process takes place in 2 steps, with a pop-up confirmation window opening up when clicking on the confirm button.
-->

<template>
    <div class="px-0 py-4 text-center">
        <v-dialog
            v-model="confirmRetrainDialog"
            width="50%"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <!-- The button that opens the pop-up confirmation window -->
                <v-btn
                    prepend-icon="mdi-dumbbell"
                    v-bind="activatorProps"
                    text="Start Retraining"
                />
            </template>
            
            <v-form v-if="formRetrain" @submit.prevent="handleFormRetrainModel()" ref="formRef">
                <v-sheet>
                    <!-- Used only to display the pop-up window title -->
                    <v-card
                        prepend-icon="mdi-dumbbell"
                        title="Confirm Deletion"
                        color="white"
                    >
                    <v-card-text class="text-center">
                        <h3>Are you sure you want to start the model retraining?</h3>
                    </v-card-text>
            
                    <v-divider />
            
                        <v-card-actions>
                            <v-spacer />
                
                            <!-- Closes pop-up window without submitting -->
                            <v-btn
                                text="No"
                                variant="plain"
                                @click="confirmRetrainDialog = false"
                                color="white"
                            />
                
                            <!-- Submits deletion request and closes the pop-up window -->
                            <v-btn
                                text="Yes"
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
    import { shallowRef } from 'vue';
    import { loading } from '../../api/login';
    import { retrainModel, messageRetrain, formRef } from '@/api/monitoring';


    const confirmRetrainDialog = shallowRef(false);

    // Defines the properties of the component (like the parameters of a function)
    const parentProps = defineProps<{formRetrain: any}>();


    /**
     * Handles the form submit process by calling the Retrain Model Form Submit function.
     * Finally, it closes the pop-up window.
     * 
     * @async
     * @handler
     */
    async function handleFormRetrainModel(): Promise<void> {
        loading.value = true;

        try {
            await retrainModel()
                    .then((data) => { messageRetrain.value = data })
                    .catch((err) => { messageRetrain.value = err });
        }
        catch (error) {
            console.error('Error submitting retrain model form:', error);
        }
        finally {
            loading.value = false;
            confirmRetrainDialog.value = false;
        }
    };
</script>

<style scoped>
    .tiny-btn {
        min-width: 35px;
        height: 35px;
    }
</style>
