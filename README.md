# E4-E5_teston_niels-patrick

## Docker deployment with the E2-E3 API

This repository contains the Vue frontend in `tictactoe/` and a Docker Compose file at the repository root.

### How it works

- The frontend is built with Vite and served by Nginx.
- Nginx proxies every request under `/api/` to the E2-E3 backend container.
- The browser only talks to the frontend origin, so the SPA does not need to know the backend container hostname.
- The same compose stack can also start Uptime Kuma to monitor the frontend container.

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
Uptime Kuma will be available on `http://localhost:3002` by default.

### Important note

The E2-E3 compose network now uses the fixed name `tictactoe-shared-network` so this frontend stack can join it. If you already had the backend stack running before this change, recreate it once so Docker applies the named network:

```sh
docker compose down
docker compose up --build -d
```

### Uptime Kuma setup for the Vue app

After the stack is running:

1. Open `http://localhost:3002` and create the first Uptime Kuma admin account.
2. Add a new monitor of type `HTTP(s)`.
3. Use `http://e4-e5-frontend` as the monitored URL.
4. Save the monitor and verify that the frontend status becomes `Up`.

Uptime Kuma runs on the same Docker network as the Vue app, so it can reach the frontend by container name without using the host port.

### Local development without Docker

Inside `tictactoe/`, `pnpm dev` still works. Vite now proxies `/api` requests to `http://127.0.0.1:5000` by default.

---

## CI/CD Workflow (GitHub Actions)

This repository uses one GitHub Actions workflow for frontend validation and image publishing:

- Workflow file: `.github/workflows/frontend-ci-cd.yml`
- Workflow name: `Frontend CI/CD`

This section documents triggers, tools, steps, tasks, setup, configuration, and test procedures.

### Triggers

The workflow runs on:

- Pull request to `main`
- Push to `main`
- Manual run from the Actions tab (`workflow_dispatch`)

### Concurrency and Permissions

- Concurrency group: `frontend-ci-cd-${{ github.ref }}`
- Cancel in progress: enabled for the same branch/ref
- Permissions:
	- `contents: read`
	- `packages: write`

### Tools and Actions Used

The workflow uses these GitHub Actions:

- `actions/checkout@v5`: checks out repository code
- `pnpm/action-setup@v4`: installs pnpm
- `actions/setup-node@v4`: installs Node.js 20.19.0 and enables pnpm dependency cache
- `docker/setup-buildx-action@v3`: prepares Docker Buildx
- `docker/login-action@v3`: authenticates to GitHub Container Registry (GHCR) and Azure Container Registry (ACR)
- `docker/metadata-action@v5`: generates image tags and labels
- `docker/build-push-action@v6`: builds and pushes Docker image
- `azure/login@v2`: authenticates to Azure for deployment

### Jobs and Tasks

#### Job 1: `ci` (Lint, Test, Build)

This job validates the frontend application in the `tictactoe/` directory.

Steps:

1. Check out code.
2. Set up pnpm.
3. Set up Node.js 20.19.0 with pnpm cache.
4. Install dependencies using `pnpm install --frozen-lockfile`.
5. Run fast lint checks with `pnpm lint:oxlint`.
6. Run tests with `pnpm vitest run`.
7. Build application with `pnpm build`.

Expected outcome:

- The lint, tests, and production build all pass.

#### Job 2: `publish-image` (Docker image publish)

This job publishes the frontend image only after successful frontend validation.

Conditions:

- Runs only when:
	- event is `push`
	- branch is `main`
	- `ci` job succeeded

Steps:

1. Check out code.
2. Set up Buildx.
3. Authenticate to GHCR with `GITHUB_TOKEN`.
4. Authenticate to ACR with repository secrets.
5. Generate GHCR tags (`latest`, `sha`, branch ref).
6. Generate ACR tags (`latest`, short `sha`).
7. Build and push Docker image from `tictactoe/Dockerfile` to both registries.

Expected outcome:

- Image pushed to `ghcr.io/<owner>/e4-e5-tictactoe-frontend`.
- Image pushed to `<registry>.azurecr.io/e4-e5-frontend`.

#### Job 3: `deploy-to-azure` (Continuous Delivery)

This job deploys the new image to Azure Container Instances after image publication.

Conditions:

- Runs only when:
	- event is `push`
	- branch is `main`
	- `publish-image` job succeeded

Steps:

1. Check out code.
2. Sign in to Azure using service principal secrets.
3. Create or update Azure Container Instance `e4-e5-frontend` with the latest ACR image.
4. Read and output the container FQDN.

Expected outcome:

- The container instance is created or updated successfully.
- The deployed endpoint FQDN is visible in workflow logs.

### Installation and Setup Procedure

Use this procedure to enable CI and CD in GitHub Actions.

1. Commit and push `.github/workflows/frontend-ci-cd.yml`.
2. Open repository settings in GitHub.
3. Check `Settings` > `Actions` > `General` and confirm Actions are enabled.
4. Add Azure deployment secrets in `Settings` > `Secrets and variables` > `Actions`.
5. Open `Actions` tab and run `Frontend CI/CD` manually once to validate CI setup.
6. Push a commit to `main` to validate publish and deploy jobs.

Required secrets for CD:

- `AZURE_RESOURCE_GROUP`
- `AZURE_CONTAINER_REGISTRY` (registry name only, without `.azurecr.io`)
- `AZURE_REGISTRY_USERNAME`
- `AZURE_REGISTRY_PASSWORD`
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

Note: manual `workflow_dispatch` runs validate CI only. Publish and deploy jobs are intentionally limited to `push` on `main`.

### Configuration Procedure

This workflow is currently configured with:

- Working directory: `tictactoe`
- Node.js version: `20.19.0`
- Package manager: `pnpm` (version 10)
- Lint command: `pnpm lint:oxlint`
- Test command: `pnpm vitest run`
- Build command: `pnpm build`
- GHCR image: `ghcr.io/<owner>/e4-e5-tictactoe-frontend`
- ACR image: `<registry>.azurecr.io/e4-e5-frontend`
- Azure deployment target: Azure Container Instance `e4-e5-frontend`
- Deployed port: `80`
- Resource limits: `1 CPU`, `1 GB memory`

If you change scripts in `tictactoe/package.json`, update the workflow commands to match.

If you change Azure resource names, update both:

1. GitHub repository secrets.
2. Values used in `deploy-to-azure` job.

### Workflow Test Procedure

Use this checklist to validate the workflow behavior.

#### Test 1: Manual run

1. Open `Actions` in GitHub.
2. Select `Frontend CI/CD`.
3. Select `Run workflow` on `main`.
4. Confirm `ci` passes.
5. Confirm `publish-image` is skipped.
6. Confirm `deploy-to-azure` is skipped.

Expected result:

- CI validation passes.
- Publish and deploy remain skipped for manual runs.

#### Test 2: Pull request validation

1. Create a branch.
2. Make a small non-breaking change.
3. Open a pull request to `main`.
4. Confirm workflow runs and `ci` passes.
5. Confirm `publish-image` is skipped for pull request events.
6. Confirm `deploy-to-azure` is skipped for pull request events.

Expected result:

- PR checks validate quality without publishing or deploying.

#### Test 3: Main branch publish and deploy

1. Merge a successful pull request into `main`.
2. Confirm workflow runs on push.
3. Confirm `ci`, `publish-image`, and `deploy-to-azure` succeed.
4. Confirm image appears in GHCR package list.
5. Confirm image appears in ACR repository `e4-e5-frontend`.
6. Confirm Azure Container Instance endpoint responds.

Expected result:

- New image is published to both registries.
- Azure deployment is updated and reachable.

### Troubleshooting for CI/CD

- Symptom: pnpm install fails
	- Check lockfile consistency in `tictactoe/pnpm-lock.yaml`.
	- Check Node version compatibility with `tictactoe/package.json` engines.

- Symptom: lint/test/build fails in CI but works locally
	- Run the same commands locally from `tictactoe/` in this order:
		1. `pnpm install --frozen-lockfile`
		2. `pnpm lint:oxlint`
		3. `pnpm vitest run`
		4. `pnpm build`

- Symptom: image publish fails
	- Check that the run is a push to `main`.
	- Check package write permission and GHCR login step.

- Symptom: publish job is skipped
	- Check run trigger type.
	- `publish-image` runs only for `push` to `main`.

- Symptom: deploy job fails at Azure login
	- Check `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`.
	- Verify the service principal has access to the target resource group.

- Symptom: deploy job fails with ACR authentication
	- Check `AZURE_CONTAINER_REGISTRY` contains only registry name.
	- Check `AZURE_REGISTRY_USERNAME` and `AZURE_REGISTRY_PASSWORD` values.
	- Re-test with `az acr login --name <registry-name>`.