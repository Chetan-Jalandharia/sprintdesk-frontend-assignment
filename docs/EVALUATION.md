# SprintDesk Evaluation Checklist

This checklist mirrors the assignment requirements and gives the evaluator a reliable verification path.

## Required Stack

- [x] React with TypeScript strict mode
- [x] Vite
- [x] TanStack Query v5
- [x] Zustand
- [x] Tailwind CSS 3 plus scoped CSS
- [x] React Router
- [x] Recharts
- [x] `@dnd-kit/core`
- [x] Vitest and React Testing Library dependencies
- [x] DummyJSON and JSONPlaceholder integrations
- [x] No prohibited UI component library

## Functional Verification

### Authentication

1. Open `/login`.
2. Use the prefilled `emilys` / `emilyspass` account.
3. Confirm the API request succeeds and redirects to `/dashboard`.
4. Reload the page and confirm session initialization runs.
5. Visit `/login` while authenticated and confirm redirect to `/dashboard`.
6. Click the profile control and confirm logout redirects to `/login`.
7. Use an invalid password and confirm an accessible error appears.
8. Use Show/Hide password and confirm the input type changes.

### Board

1. Open `/board`.
2. Confirm four columns and dynamic task counts.
3. Drag a task within a column and between columns.
4. Open a task card and edit title, description, priority, assignee, or due date.
5. Add a comment.
6. Create a task from Board and Overview.
7. Delete a task and confirm the browser confirmation dialog.
8. Reload and confirm board persistence.

### Analytics

1. Open `/analytics`.
2. Confirm Sprint Velocity, Task Status, Priority Breakdown, and Completion Trend.
3. Move or create a board task, then revisit analytics and confirm derived values update.
4. Check the page at 375px width.

### Notifications

1. Confirm the notification bell and unread count.
2. Open the notification panel.
3. Mark one notification read and then mark all read.
4. Confirm pagination appears when history exceeds 20 items.
5. Confirm new polling data creates a toast when the panel is closed.
6. Hide the browser tab and confirm polling is paused by TanStack Query's background behavior.

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

Current automated coverage:

- Auth interceptor refresh and retry
- Board store add, move, and delete
- Notification store deduplication and read state
- Toast store add and remove

## Known Deployment Check

The deployed app must provide a same-origin proxy for `/api/dummyjson/auth`. A static host without a rewrite/serverless function will recreate the browser CORS problem even though local Vite development works.

## Evaluation Evidence

Capture these during the screen recording:

- Login network request and protected route redirect
- Dragging a task across columns
- Task drawer editing and comment creation
- Analytics charts
- Notification bell, toast, and pagination
- Mobile viewport behavior
- `npm test` and `npm run build` results
