# SprintDesk Architecture

## Overview

SprintDesk is a client-side React application with a clear separation between server state, application state, local UI state, and external service access.

## Runtime Flow

```text
Route
  -> Page component
    -> TanStack Query or Zustand selector
      -> Service/data-access layer
        -> API or mock data source
```

## Layers

### Application shell

`src/App.tsx` owns the router, protected/public route boundaries, the persistent sidebar, theme synchronization, notification polling, and the toast viewport.

### Server state

TanStack Query manages asynchronous data and request lifecycle state:

- `mock-data.json` query: users, sprints, tasks, comments, and seed notifications
- JSONPlaceholder query: notification polling every 30 seconds
- Loading and error states on dashboard, board, and analytics pages

### Client state

Zustand manages shared application state:

- `useAuthStore`: user session, access token, refresh token coordination, logout
- `useBoardStore`: tasks, comments, task mutations, active drawer, persistence
- `useNotificationStore`: notification history, read state, pagination source, persistence
- `useThemeStore`: persistent light/dark mode
- `useToastStore`: transient toast messages

### Service layer

- `dataService.ts`: central mock backend adapter
- `authService.ts`: DummyJSON login and refresh calls
- `apiClient.ts`: bearer token attachment, refresh-on-401, retry, and refresh deduplication
- `notificationService.ts`: JSONPlaceholder polling adapter

Components do not fetch the mock JSON directly.

## Authentication Flow

1. Login submits credentials to DummyJSON through the local Vite proxy in development.
2. The access token remains in Zustand memory/session state.
3. The refresh token is stored in local storage under `sprintdesk-refresh-token`.
4. `SessionGate` validates the refresh token before rendering the application.
5. `ProtectedRoute` redirects missing sessions to `/login`.
6. `PublicOnlyRoute` redirects authenticated users away from `/login`.
7. `apiClient` refreshes and retries a request once after a `401`.
8. Logout clears the access token, refresh token, and persisted profile.

## Performance and Accessibility

- Route-level lazy loading uses `React.lazy` and `Suspense`.
- Derived analytics data uses `useMemo`.
- Board cards are keyboard focusable and support Enter/Space to open details.
- Forms use explicit labels and accessible status/error messaging.
- The board supports pointer/touch drag interaction and keyboard-focusable task access.
- Responsive checks include a 375px viewport.

## Tradeoffs

The assignment uses a static Vite frontend, so the production deployment must provide a same-origin proxy for DummyJSON authentication. The development proxy is configured in `vite.config.ts`; a deployment-specific rewrite or serverless function should expose the same `/api/dummyjson/auth` path.
