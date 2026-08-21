# SprintDesk

SprintDesk is a responsive sprint management dashboard built for the frontend engineering assignment.

## Stack

- React 19 with TypeScript strict mode
- Vite 6
- TanStack Query v5 for server state
- Zustand for application state
- React Router 7 with protected route APIs
- Tailwind CSS 3 plus scoped CSS
- Recharts for analytics
- `@dnd-kit/core` and `@dnd-kit/sortable` for drag and drop
- Vitest and React Testing Library dependencies

## Run Locally

```bash
npm install
npm run dev
```

The development server runs at `http://127.0.0.1:5173/`.

Demo credentials are prefilled on the login screen:

```text
Username: emilys
Password: emilyspass
```

## Routes

- `/login`: public authentication route
- `/dashboard`: protected sprint overview
- `/board`: protected interactive Kanban board
- `/analytics`: protected analytics page

## Architecture

```text
Pages and components
  |
TanStack Query hooks / Zustand selectors
  |
Service and data-access layer
  |
DummyJSON, JSONPlaceholder, and mock-data.json
```

The UI does not fetch `mock-data.json` directly. `dataService.ts`, `authService.ts`, `apiClient.ts`, and `notificationService.ts` keep API concerns replaceable. The data service first attempts `/mock-data.json` and falls back to the bundled provided dataset for static deployments that do not expose repository-root files.

## Implemented Features

- DummyJSON login, protected routes, logout, refresh-token persistence, silent refresh, and bearer retry interceptor
- Persisted Kanban tasks with drag and reorder across Backlog, In Progress, Review, and Done
- Task creation from Dashboard and Board, assignee selection, editing drawer, comments, and delete confirmation
- Sprint velocity, task status, priority-by-column, and completion-trend charts derived from task data
- JSONPlaceholder polling with persisted unread notifications, read actions, pagination, and toast feedback
- Persistent light/dark theme toggle
- Responsive desktop and 375px mobile layouts
- Keyboard focus states and keyboard-openable task cards

## API Notes

| Purpose | Endpoint |
| --- | --- |
| Login | `POST /api/dummyjson/auth/login` |
| Refresh | `POST /api/dummyjson/auth/refresh` |
| Notification polling | `GET https://jsonplaceholder.typicode.com/posts?_limit=5` |
| Initial app data | `GET /mock-data.json` |

The development Vite server proxies `/api/dummyjson` to `https://dummyjson.com`. The included `vercel.json` provides the equivalent production proxy and SPA fallback for Vercel. Set `VITE_AUTH_API_URL=/api/dummyjson/auth` in the deployment environment.

## Validation

```bash
npm run lint
npm test
npm run build
```

The unit tests cover the board store add/move/delete operations, notification state, toast state, and auth refresh/retry behavior.

## Submission Pack

- [Architecture](docs/ARCHITECTURE.md)
- [API documentation](docs/API.md)
- [Evaluation checklist](docs/EVALUATION.md)
- [Submission process](docs/SUBMISSION.md)

Never commit passwords, access tokens, private environment files, or `node_modules`.
