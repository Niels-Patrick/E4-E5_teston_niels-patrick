# E4-E5_teston_niels-patrick

## Docker deployment with the E2-E3 API

This repository contains the Vue frontend in `tictactoe/` and a Docker Compose file at the repository root.

### How it works

- The frontend is built with Vite and served by Nginx.
- Nginx proxies every request under `/api/` to the E2-E3 backend container.
- The browser only talks to the frontend origin, so the SPA does not need to know the backend container hostname.

### Start order

1. In `E2-E3_teston_niels-patrick`, start the backend stack:
	```sh
	docker compose up --build -d
	```
2. In `E4-E5_teston_niels-patrick`, optionally copy `.env.example` to `.env` and adjust the values.
3. In `E4-E5_teston_niels-patrick`, start the frontend stack:
	```sh
	docker compose up --build -d
	```

The frontend will be available on `http://localhost:8080` by default.

### Important note

The E2-E3 compose network now uses the fixed name `tictactoe-shared-network` so this frontend stack can join it. If you already had the backend stack running before this change, recreate it once so Docker applies the named network:

```sh
docker compose down
docker compose up --build -d
```

### Local development without Docker

Inside `tictactoe/`, `pnpm dev` still works. Vite now proxies `/api` requests to `http://127.0.0.1:5000` by default.