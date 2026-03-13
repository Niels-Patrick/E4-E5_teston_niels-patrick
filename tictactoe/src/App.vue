<!--
App module.

This is the main Vue.js module of the application.
-->

<template>
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { handleCheckTokenValidity } from './api/token';


  onMounted(async () => {
    await handleCheckTokenValidity();
  });
</script>
