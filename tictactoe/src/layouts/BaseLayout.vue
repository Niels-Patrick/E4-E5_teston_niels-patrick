<!--
Base layout module.

This module sets up the nav bar (including the "Logout" button), the navigation drawer and the part in which to display
pages content.
-->

<template>
  <v-app>
    <!-- Displays the nav bar (the upper blue bar) -->
    <v-app-bar color="grey-darken-4">
      <v-row>
        <v-col>
          <v-img :width="65" src="/src/assets/game.png" class="ml-5" />
        </v-col>

        <div class="d-flex align-center mx-5">
          <v-col>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="tiny-btn"
                >
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in topItems"
                  :key="index"
                  :value="index"
                  :prepend-icon="item.icon"
                  @click="handleChoice(item.value)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </div>
      </v-row>
    </v-app-bar>

    <!-- Displays the navigation drawer that can be opened by clicking the leftmost icon in the nav bar -->
    <v-navigation-drawer
      color="grey-darken-4"
      expand-on-hover
      rail
    >
      <v-list density="compact" nav>
        <template v-for="item in sideItems" :key="item.value">
          <v-list-item
            v-if="!item.roles || item.roles.includes(role)"
            @click="redirection(item.value)"
            :prepend-icon="item.icon"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- The main part, where the pages' content is displayed -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { jwtDecode } from 'jwt-decode';
  import { handleSubmitLogout } from '../api/login';
  import { role, idUser, type JwtPayload } from '../api/token';


  const token = localStorage.getItem('access_token');
  
  // Getting the user's role and username from the JWT token payload
  if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      idUser.value = decoded.sub;
      role.value = decoded.role.name;
  }

  // Used for redirections when clicking on a page name in the navigation drawer
  const router = useRouter();

  const topItems = [
    {
      title: 'Profile',
      value: '/user-page',
      icon: 'mdi-account'
    },
    {
      title: 'Logout',
      value: '/logout',
      icon: 'mdi-logout'
    }
  ];

  // The page names and URLs to display in the navigation drawer
  const sideItems = [
    {
      title: 'Home page',
      value: '/home-page',
      icon: 'mdi-home'
    },
    {
      title: 'Admin dashboard',
      value: '/admin-dashboard',
      roles: ['Admin', 'Labo Manager'],
      icon: 'mdi-shield-crown'
    },
    {
      title: 'Game',
      value: '/game',
      icon: 'mdi-controller'
    }
  ];


  /**
   * Redirects to the specified route.
   * 
   * @function
   * @param route - The URL route to redirect to.
   */
  function redirection(route: string) {
    router.push(route);
  };


  /**
   * Handles the page redirection choice.
   * 
   * @handler
   * @param route - The route of the page to redirect to.
   */
  function handleChoice(route: string): void {
    if (route !== "/logout") redirection(route);
    else handleSubmitLogout();
  };
</script>
