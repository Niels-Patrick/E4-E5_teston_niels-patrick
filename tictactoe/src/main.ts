/**
 * Main module.
 * 
 * This is the main module of the application that creates and starts up the
 * application.
 */

import { createApp } from 'vue';

// Vuetify
import 'vuetify/styles';
import './style.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

// Components
import App from './App.vue';
import router from './router';
import { handleCheckTokenValidity } from './api/token';


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});

async function init() {
  await handleCheckTokenValidity();

  createApp(App).use(vuetify).use(router).mount('#app');
};

init();
