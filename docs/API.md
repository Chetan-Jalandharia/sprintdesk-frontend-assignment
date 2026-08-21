# SprintDesk API Documentation

## Authentication

### Login

```http
POST /api/dummyjson/auth/login
Content-Type: application/json
```

Development requests are proxied by Vite to `https://dummyjson.com/auth/login`. The deployed application should expose the same-origin path through a server-side proxy.

Request:

```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 30
}
```

Response fields used by the application:

```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@example.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "image": "https://...",
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Refresh

```http
POST /api/dummyjson/auth/refresh
Content-Type: application/json
```

Request:

```json
{
  "refreshToken": "...",
  "expiresInMins": 30
}
```

A failed refresh clears the local session and returns the user to `/login`.

## Authenticated API Client

`src/services/apiClient.ts` provides the request wrapper used for protected backend calls:

1. Reads the in-memory access token.
2. Adds `Authorization: Bearer <token>`.
3. Returns normal responses unchanged.
4. On `401`, refreshes once and retries with the new token.
5. Shares one refresh promise across simultaneous failed requests.
6. Clears auth state when refresh fails.

## Mock Backend Adapter

```http
GET /mock-data.json
```

`dataService.ts` reads the provided assignment data and returns typed users, sprints, tasks, comments, and seed notifications. The UI accesses this only through TanStack Query.

## Notification Polling

```http
GET https://jsonplaceholder.typicode.com/posts?_limit=5
```

TanStack Query polls every 30 seconds while the document is visible. New post IDs become notifications. Zustand persists notification read state and history; the panel displays 20 items per page.

## Error Handling

- Login `401`: `Invalid username or password`
- Other login failures: `Authentication service is unavailable`
- Refresh failure: `Your session has expired`, followed by logout
- Mock/API query failure: page-level error state
- Notification polling failure: query error state without destroying existing notification history

## Environment Configuration

```env
VITE_AUTH_API_URL=/api/dummyjson/auth
```

The default development value is already configured in the service. Use an equivalent same-origin endpoint in production.
