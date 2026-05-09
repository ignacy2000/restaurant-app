# RST Panel — Frontend

Restaurant management panel built with React, TypeScript, and Vite.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool, dev server
- **React Router v6** — client-side routing
- **Tailwind CSS v4** — styling with dark mode support
- **Vitest** + **React Testing Library** — unit and component tests
- **Bun** — package manager

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.3.9
- Backend API running on `http://localhost:8080`

## Getting Started

```bash
bun install
bun run dev
```

App runs at `http://localhost:3000`. All `/api/*` requests are proxied to `http://localhost:8080`.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview production build locally |
| `bun run test` | Run tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |

## Project Structure

```
src/
├── app/                    # App shell (router, providers, header)
├── modules/
│   ├── auth/               # Login, register, forgot/reset password
│   ├── guest/              # Public guest-facing pages
│   └── restaurants/        # Main restaurant management
│       └── modules/
│           ├── tables/     # Table management + QR codes
│           ├── menus/      # Menu & item management
│           ├── orders/     # Order tracking
│           ├── calls/      # Waiter call notifications
│           └── panel/      # Admin panel
└── shared/
    ├── components/         # Button, Input, Alert, FormField, …
    ├── contexts/           # ThemeContext (light/dark)
    ├── hooks/              # useWebSocket
    └── services/           # HTTP client, auth storage
```

## Authentication Flow

```
/login          — email + password
/register       — create account
/forgot-password — request password reset email
/reset-password?token=… — set new password via emailed link
```

Auth tokens are stored in `localStorage`. The HTTP client automatically refreshes the access token on 401 and redirects to `/login` if the refresh fails.

## Environment Variables

The dev server proxies `/api` to `http://localhost:8080` (configured in `vite.config.ts`). To point to a different backend, update the proxy target there or set the base URL in the HTTP client.
