<!--
Administration Dashboard module.

This module is only accessible to users with the "Admin" role. It allows them to do CRUD operations on users with:
    - A data table displaying the users list.
    - An option to edit an existing user.
    - An option to add a new user.
    - An option to delete a user.
-->

<template>
    <v-row class="py-1">
        <v-card-title style="color: black; font-size: 40px;">Administration Dashboard</v-card-title>
    </v-row>

    <v-row justify="center">
        <v-col>
            <!-- Displays a list of all users -->
            <v-card
                title="Users List"
                prepend-icon="mdi-account-multiple"
                width="100%"
            >
                <template v-slot:text>
                    <v-row>
                        <v-col cols="8">
                            <v-text-field
                                v-model="search"
                                label="Search"
                                prepend-inner-icon="mdi-magnify"
                                variant="filled"
                                bg-color="white"
                                hide-details
                                single-line
                                color="orange-lighten-1"
                                width="250"
                                density="compact"
                            />
                        </v-col>
                        <v-col>
                            <div>
                                <v-select
                                    label="Role"
                                    v-model="selectedRoles"
                                    :items="availableRoles"
                                    variant="filled"
                                    bg-color="white"
                                    multiple
                                    chips
                                    density="compact"
                                    width="250"
                                    prepend-inner-icon="mdi-filter"
                                >
                                    <!-- Custom dropdown display -->
                                    <template #item="{ item, props }">
                                        <v-list-item v-bind="props">
                                            <template #prepend>
                                                <v-checkbox-btn
                                                    :model-value="selectedRoles.includes(item.value)"
                                                    readonly
                                                />
                                            </template>
                                            <v-list-item-title class="d-flex justify-space-between">
                                                <span class="text-grey">
                                                    {{ item.count }}
                                                </span>
                                            </v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </div>
                        </v-col>
                    </v-row>
                </template>

                <v-data-table
                    :headers="userHeaders"
                    :items="filteredUsers"
                    style="background-color: whitesmoke; color: black;"
                    height="300"
                >
                    <template  #item.edit="{ item }">
                        <v-row>
                            <v-col class="px-0">
                                <EditUser :user="item" parentType="AdminDashboard" />
                            </v-col>
                            <v-col class="px-0">
                                <EditPassword :user="item" />
                            </v-col>
                            <v-col class="px-0">
                                <DeleteUser :user="item" parentType="AdminDashboard" />
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>

                <v-row>
                    <v-col class="py-2">
                        <AddUser parentType="AdminDashboard" />
                    </v-col>
                </v-row>
            </v-card>

            <v-alert
                v-if="message"
                class="mt-5"
                variant="elevated"
            >
                {{ message }}
            </v-alert>
        </v-col>

        <v-col>
            <v-card
                title="Retrain Model"
                width="100%"
                style="background-color: whitesmoke; color: black;"
                height="572"
            >
                <v-card-subtitle class="py-4">Please select the genetic algorithm parameters</v-card-subtitle>
                <v-form @submit.prevent="">
                    <!-- Population size field -->
                    <v-col
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                                label="Population size"
                                v-model="formRetrain.populationSize"
                                :rules="numbersRules"
                                numbers
                                prepend-icon="mdi-account-group"
                                required
                        />
                    </v-col>

                    <!-- Games per eval field -->
                    <v-col
                        md="6"
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                            label="Games per eval"
                            v-model="formRetrain.gamesPerEval"
                            :rules="numbersRules"
                            number
                            prepend-icon="mdi-controller"
                            required
                        />
                    </v-col>

                    <!-- Mutation rate field -->
                    <v-col
                        md="6"
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                            label="Mutation rate"
                            v-model="formRetrain.mutationRate"
                            :rules="numbersRules"
                            number
                            prepend-icon="mdi-dna"
                            required
                        />
                    </v-col>

                    <!-- Mutation standard deviation field -->
                    <v-col
                        md="6"
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                            label="Mutation standard deviation"
                            v-model="formRetrain.mutationStd"
                            :rules="numbersRules"
                            number
                            prepend-icon="mdi-chart-bell-curve"
                            required
                        />
                    </v-col>

                    <!-- Generations field -->
                    <v-col
                        md="6"
                        sm="6"
                        class="px-10"
                    >
                        <v-text-field
                            label="Generations"
                            v-model="formRetrain.generations"
                            :rules="numbersRules"
                            number
                            prepend-icon="mdi-human-male-female-child"
                            required
                        />
                    </v-col>

                    <v-row justify="center">
                        <v-col class="px-0">
                            <ConfirmRetrain :formRetrain="formRetrain" />
                        </v-col>

                        <v-col class="px-0 py-4">
                            <v-btn
                                prepend-icon="mdi-list-status"
                                text="Check Status"
                                @click="handleGetTrainingStatus"
                            />
                        </v-col>

                        <v-col>
                            <v-alert
                                v-if="messageStatus !== ''"
                                class="mx-5"
                                variant="elevated"
                            >
                                {{ messageStatus }}
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>

            <v-alert
                v-if="messageRetrain !== ''"
                class="mt-5"
                variant="elevated"
            >
                {{ messageRetrain }}
            </v-alert>
        </v-col>
    </v-row>

    <v-row justify="center">
        <v-card
            title="Training Results"
            prepend-icon="mdi-chart-line"
            width="100%"
        >
            <v-row justify="center">
                <v-col class="ma-5">
                    <v-btn
                        prepend-icon="mdi-chart-line"
                        text="Get Last Training Results"
                        @click="handleGetLastTrainingResults"
                    />
                </v-col>
            </v-row>

            <v-row v-if="plots.length" justify="center">
                <v-col class="px-16 my-3">
                    <h4>Win / Draw / Loss rates during evaluation</h4>
                    <div v-for="plot in plots" :key="plot">
                        <img
                            v-if="plot.includes('gauge')"
                            :src="getPlotUrl(plot)"
                            alt="Training Plot"
                        />
                    </div>
                </v-col>
                <v-col>
                    <h4>Fitness + Draw / Loss rates evolution of the best genome during training</h4>
                    <div v-for="plot in plots" :key="plot">
                        <img
                            v-if="plot.includes('evolution')"
                            :src="getPlotUrl(plot)"
                            alt="Training Plot"
                        />
                    </div>
                </v-col>
            </v-row>
            <div v-else class="ma-5">
                No previous results detected
            </div>
        </v-card>

        <v-alert
            v-if="messageResult !== ''"
            class="mt-5"
            variant="elevated"
        >
            {{ messageResult }}
        </v-alert>
    </v-row>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { users, handleGetUsers, message } from '../api/users';
    import { userHeaders } from '../headers/user_headers';
    import EditUser from '../components/user_forms/EditUser.vue';
    import EditPassword from '../components/user_forms/EditPassword.vue';
    import AddUser from '../components/user_forms/AddUser.vue';
    import DeleteUser from '../components/user_forms/DeleteUser.vue';
    import type { UserRead } from '../types/users';
    import { formRetrain, getTrainingResult, getTrainingStatus, lastGamesResults, loading, messageResult,
        messageRetrain, messageStatus, setFormToDefault } from '@/api/monitoring';
    import { resolveApiUrl } from '@/api/client';
    import { numbersRules } from '@/rules/rules';
    import ConfirmRetrain from '@/components/retrain_model/ConfirmRetrain.vue';


    const search = ref('');
    const selectedRoles = ref<string[]>([]);
    const results = ref<Record<string, string>>();
    const plots = ref<Array<string>>([]);

    // Get all users at start
    onMounted(async () => {
            await handleGetUsers();
            setFormToDefault();

            await lastGamesResults()
                .then((data) => {
                    results.value = data;
                    if (results.value['should_retrain'] === "true") {
                        messageRetrain.value = "Model is decaying and should be retrained.";
                    } else {
                        messageRetrain.value = "Model metrics are correct. Retraining not required.";
                    }
                })
                .catch((err) => { message.value = err });
    });

    const availableRoles = computed(() => {
        const roleMap: Record<string, { title: string, count: number }> = {};

        users.value.forEach((user: UserRead) => {
            const roleId = user.role?.idRole;
            const roleName = user.role?.name;

            if (roleName && roleId) {
                if (!roleMap[roleId]) {
                    roleMap[roleId] = {
                        title: roleName,
                        count: 0
                    };
                }

                roleMap[roleId].count++;
            }
        });

        return Object.entries(roleMap).map(([id, data]) => ({
            title: data.title,
            count: data.count,
            value: id
        }));
    });

    const filteredUsers = computed(() => {
        return users.value.filter((user: UserRead) => {
            const matchesRole = selectedRoles.value.length === 0 || selectedRoles.value.includes(user.role?.idRole!);

            return matchesRole;
        });
    });


    /**
     * Handles the submit process by calling the Get Training Status function.
     * Finally, it closes the pop-up window.
     * 
     * @async
     * @handler
     */
    async function handleGetTrainingStatus(): Promise<void> {
        loading.value = true;

        try {
            await getTrainingStatus()
                    .then((data) => { messageStatus.value = data })
                    .catch((err) => { messageStatus.value = err });
        }
        catch (error) {
            console.error('Error submitting get training status form:', error);
        }
        finally {
            loading.value = false;
        }
    };


    /**
     * Handles the submit process by calling the Get Training Result function.
     * Finally, it closes the pop-up window.
     * 
     * @async
     * @handler
     */
    async function handleGetLastTrainingResults(): Promise<void> {
        loading.value = true;

        try {
            await getTrainingResult()
                    .then((data) => { plots.value = data })
                    .catch((err) => { messageRetrain.value = err });
        }
        catch (error) {
            console.error('Error submitting get training results form:', error);
        }
        finally {
            loading.value = false;
        }
    };

    function getPlotUrl(plot: string): string {
        return resolveApiUrl(plot);
    }
</script>
