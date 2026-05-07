# SCANiD Project Configuration

This document lists the project-level configuration values that control local development, API connectivity, and production builds.

## Environment Files

Create a local `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
PORT=5000
```

`.env` is ignored by Git, so each developer can keep machine-specific values locally. Keep shared examples in `.env.example`.

## API Base URL

Frontend API calls are configured in:

```text
src/lib/api.ts
```

The frontend reads:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If `VITE_API_BASE_URL` is missing, the app falls back to:

```text
http://localhost:5000/api
```

Do not use a relative base URL such as `/api` unless the frontend and backend are served from the same origin. In Vite preview, `/api` resolves to `http://localhost:4173/api`, which causes login calls to hit the frontend server instead of the backend API.

## Local Server Port

The local Express mock API in `server.ts` reads:

```env
PORT=5000
```

The server file is:

```text
server.ts
```

Run it with:

```bash
npm run dev
```

Expected health check:

```text
http://localhost:5000/api/health
```

## .NET Backend Configuration

The .NET API project lives in:

```text
backend/ScanID.Api
```

The local API port is configured in:

```text
backend/ScanID.Api/Properties/launchSettings.json
```

Current expected API URL:

```text
http://localhost:5000
```

Backend app settings, including database connection strings, are configured in:

```text
backend/ScanID.Api/appsettings.json
```

CORS origins for the React frontend are configured in:

```text
backend/ScanID.Api/Program.cs
```

Make sure the frontend origin you use, such as `http://localhost:4173` for Vite preview or `http://localhost:5173` for Vite dev, is allowed there.

## Login Test Users

The mock API in `server.ts` currently accepts these credentials:

```text
superadmin / Password123
schooladmin1 / Password123
teacher1 / Password123
student1 / Password123
```

## Build And Preview

Vite embeds `VITE_*` variables at build time. If you change `VITE_API_BASE_URL`, rebuild the frontend:

```bash
npm run build
npm run preview
```

When preview runs at `http://localhost:4173`, API calls should still go to `http://localhost:5000/api` because the base URL is absolute.

## Common Troubleshooting

If login calls go to `http://localhost:4173/api/auth/login`, check that:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

is present before running `npm run build` or `npm run dev`.

If `http://localhost:5000/api/health` does not respond, start the API server with:

```bash
npm run dev
```
