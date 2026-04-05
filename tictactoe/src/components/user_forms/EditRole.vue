<!--
Edit Role module.

This module adds a dropdown list of user roles, to use in a user related form.
It is separated from the EditUser module to avoid having this field in contexts where it shouldn't be possible to
update a user's role, as in the case of a user updating their own information from their user page.
-->

<template>
    <!-- Role dropdown menu -->
    <v-col
        cols="12"
        md="6"
        sm="6"
    >
        <v-select
            label="Role"
            v-model="formUser.idRole"
            :rules="selectRules"
            :items="roles"
            item-title="name"
            item-value="idRole"
            required
        />
    </v-col>
</template>

<script setup lang="ts">
    import { formUser } from '../../api/users';
    import { selectRules } from '../../rules/rules';
    import { getRoles, roles } from '../../api/roles';
    import { onMounted } from 'vue';


    // Get all roles at start
    onMounted(async () => {
            await getRoles()
                .then((data) => {roles.value = data})
                .catch((err) => {console.error('Error:', err);});
        }
    );
</script>
