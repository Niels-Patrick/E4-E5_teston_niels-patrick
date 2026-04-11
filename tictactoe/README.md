# TicTacToe Frontend

This project is the Vue 3 frontend for the TicTacToe application. It communicates with the E2-E3 backend API and provides the user interface for authentication, gameplay, user management, and monitoring.

This README is written to be easy to scan and easy to use. It uses short sections, descriptive headings, meaningful link text, and copy-ready commands.

## What This Application Does

The frontend provides:

- authentication screens for login and token-based session handling
- game pages for TicTacToe interactions
- an administration dashboard for user management and model monitoring
- API wrappers for backend communication
- Docker support for deployment with the E2-E3 backend

## Development Environment Installation

### Prerequisites

Install the following tools before working on the project:

- [Node.js](https://nodejs.org/) version `20.19.0` or later, or `22.12.0` or later
- Corepack, included with recent Node.js versions
- [Visual Studio Code](https://code.visualstudio.com/)
- The [Vue - Official extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for Vue and TypeScript support
- Docker Desktop if you want to run the application in containers

### Recommended Setup on Windows PowerShell

Open PowerShell in the frontend folder:

```powershell
Set-Location "c:\Users\<PC-name>\OneDrive\Documents\GitHub\E4-E5_teston_niels-patrick\tictactoe"
```

Enable Corepack if needed:

```powershell
corepack enable
```

Install dependencies:

```powershell
corepack pnpm install
```

## Running the Application Locally

Start the development server:

```powershell
corepack pnpm dev
```

The Vite development server proxies `/api` requests to `http://127.0.0.1:5000` by default, so the E2-E3 backend API should already be running when you use the application locally.

## Building for Production

Run the production build and type-check:

```powershell
corepack pnpm build
```

To preview the built application locally:

```powershell
corepack pnpm preview
```

## Application Architecture

The frontend is organized by responsibility so that UI logic, API calls, and shared types stay separate.

## Main Source Folders

- `src/api/`: frontend wrappers around backend HTTP endpoints
- `src/components/`: reusable Vue components such as forms and dialogs
- `src/layouts/`: layout components shared by multiple pages
- `src/pages/`: route-level screens such as login, user page, admin dashboard, and game page
- `src/router/`: Vue Router configuration
- `src/types/`: TypeScript types shared across the frontend
- `src/rules/`: form validation rules
- `src/headers/`: table and list header definitions
- `tests/`: unit and integration-style frontend tests using Vitest

## Runtime Flow

The main runtime flow is:

1. Vue Router loads a page component from `src/pages/`.
2. Page components call functions from `src/api/`.
3. The shared API client in `src/api/client.ts` sends requests to `/api/...`.
4. In local development, Vite proxies these requests to the backend.
5. In Docker, Nginx proxies the same `/api/...` requests to the E2-E3 backend container.

## Main Dependencies

### Application Dependencies

- `vue`: core frontend framework
- `vue-router`: client-side routing
- `vuetify`: UI component library
- `axios`: HTTP client used by the API wrapper files
- `jwt-decode`: reads JWT payloads in the browser
- `lodash`: utility helpers such as deep cloning
- `date-fns`: date formatting and manipulation
- `@mdi/font`: Material Design icons used by the UI

### Development Dependencies

- `vite`: development server and production bundler
- `typescript`: static typing
- `vue-tsc`: Vue-aware TypeScript checking
- `vitest`: test runner
- `@vue/test-utils`: Vue component testing utilities
- `jsdom`: browser-like test environment for Vitest
- `eslint`, `eslint-plugin-vue`, `@vue/eslint-config-typescript`, `oxlint`: linting tools
- `vite-plugin-vue-devtools`: Vue developer tools integration for Vite

The exact dependency versions are defined in `package.json`.

## Running Tests

Run the full test suite once:

```powershell
corepack pnpm vitest run
```

Run tests in watch mode:

```powershell
corepack pnpm test:watch
```

Run a specific test file:

```powershell
corepack pnpm vitest run tests/api.monitoring.test.ts
```

## Current Test Coverage Area

The `tests/` folder currently includes tests for:

- API helper modules in `src/api/`
- the shared API client
- token and login flows
- monitoring-related frontend logic
- one AI integration-style frontend test

## Linting

Run the configured linters:

```powershell
corepack pnpm lint
```

## Docker Deployment

Run the frontend container from the repository root:

```powershell
Set-Location "c:\Users\tiger\OneDrive\Documents\GitHub\E4-E5_teston_niels-patrick"
docker compose up --build
```

The container serves the built Vue application through Nginx. Nginx forwards `/api` requests to the E2-E3 backend container on the shared Docker network.
