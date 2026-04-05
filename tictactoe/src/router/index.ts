/**
 * Index module.
 * 
 * This module manages the router and routes of the application.
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { handleCheckTokenValidity, type JwtPayload } from '../api/token.ts';

import BaseLayout from '../layouts/BaseLayout.vue';
import LoginPage from '../pages/Login.vue';
import Unauthorized from '../pages/Unauthorized.vue';
import UserPage from '../pages/UserPage.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import HomePage from '../pages/HomePage.vue';
import Game from '@/pages/Game.vue';


// Defining routes
const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: { requiresAuth: false, layout: 'none' }, // No layout
    },
    {
        path: '/',
        name: 'base_layout',
        component: BaseLayout,
        children: [
            {
                path: '',
                redirect: "/home-page"
            },
            {
                path: '/home-page',
                name: 'home_page',
                component: HomePage,
                meta: { requiresAuth: true }
            },
            {
                path: '/user-page',
                name: 'user_page',
                component: UserPage,
                meta: { requiresAuth: true }
            },
            {
                path: '/admin-dashboard',
                name: 'admin_dashboard',
                component: AdminDashboard,
                meta: { requiresAuth: true, roles: ['Admin'] },
            },
            {
                path: '/game',
                name: 'game',
                component: Game,
                meta: { requiresAuth: true },
            },
            {
                path: '/unauthorized',
                name: 'unauthorized',
                component: Unauthorized,
                meta: { requiresAuth: true }
            }
        ],
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('access_token');

            // Redirecting to the login page if no token
            if (!token) {
                next('/login');
            }
            else {
                console.log('Navigation guard triggered (before enter)');
                next();
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('access_token');

    // Getting the user's role from the JWT token payload
    var role = '';
    var username = '';
    var id = '';

    if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        id = decoded.sub;
        role = decoded.role.name;
        username = decoded.username;
    }

    handleCheckTokenValidity();

    // Checks if user is authorized to access a page based on role
    const allowedRoles = to.meta.roles as Array<string>;

    if (allowedRoles && !allowedRoles.includes(role)) {
        return next('/unauthorized'); // Error 403 page
    }
    console.log('Navigation guard triggered (before each)');
    next();
})

export default router;
