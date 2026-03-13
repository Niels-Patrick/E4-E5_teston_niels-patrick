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
        <v-card-title>Administration Dashboard</v-card-title>
    </v-row>

    <v-row justify="center">
        <!-- Displays a list of all users -->
        <v-card
            title="Users List"
            prepend-icon="mdi-account-multiple"
            width="80%"
        >
            <template v-slot:text>
                <v-row>
                    <v-col cols="9">
                        <v-text-field
                            v-model="search"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            variant="filled"
                            bg-color="white"
                            hide-details
                            single-line
                            color="orange-lighten-1"
                            width="500"
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
                            <DeleteUser :user="item" />
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
    </v-row>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { message, users, handleGetUsers } from '../api/users';
    import { userHeaders } from '../headers/user_headers';
    import EditUser from '../components/user_forms/EditUser.vue';
    import EditPassword from '../components/user_forms/EditPassword.vue';
    import AddUser from '../components/user_forms/AddUser.vue';
    import DeleteUser from '../components/user_forms/DeleteUser.vue';
    import type { UserRead } from '../types/users';

    const search = ref('');
    const selectedRoles = ref<string[]>([]);

    message.value = '';

    // Get all users at start
    onMounted(async () => {
            await handleGetUsers();
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
</script>
