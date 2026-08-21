# SprintDesk Submission Process

## 1. Final Local Verification

From the repository root:

```bash
npm install
npm run lint
npm test
npm run build
```

Do not submit a repository with failing checks. Keep the generated `dist/` output out of version control unless the chosen host explicitly requires it.

## 2. Prepare the Repository

1. Create a public GitHub repository with a clear name such as `sprintdesk-frontend-assignment`.
2. Copy the project into the repository without committing `node_modules`, tokens, passwords, or private environment files.
3. Keep `mock-data.json`, `README.md`, `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/EVALUATION.md`, and this document in the repository.
4. Add a concise repository description and make the README the first page an evaluator sees.
5. Verify the public repository can be cloned and installed from a clean directory.

Recommended commands:

```bash
git init
git add .
git commit -m "Complete SprintDesk frontend assignment"
git branch -M main
git remote add origin <public-repository-url>
git push -u origin main
```

Review `git status` before pushing to ensure no secrets or unrelated files are included.

## 3. Deploy the Application

Deploy the Vite application to a static host such as Vercel, Netlify, or Cloudflare Pages. The deployment must also provide a same-origin proxy for:

```text
/api/dummyjson/auth/* -> https://dummyjson.com/auth/*
```

Configure the frontend environment variable on the host:

```env
VITE_AUTH_API_URL=/api/dummyjson/auth
```

Do not point production browser code directly at DummyJSON if the host does not provide the required CORS behavior. After deployment, test login, refresh, logout, and protected routes from the public URL.

## 4. Record the Demo

Target length: 3 to 6 minutes.

Suggested sequence:

1. Show the public repository and README.
2. Open the live deployment.
3. Demonstrate login and password visibility.
4. Explain that the login request uses DummyJSON and the access/refresh token flow.
5. Show the dashboard and route-aware sidebar.
6. Open the board, drag a task, reorder it, edit details, add a comment, create a task, and delete a task.
7. Open Analytics and explain that charts use current task data.
8. Open notifications, mark items read, show pagination/toast behavior.
9. Resize to a mobile viewport.
10. Show the terminal results for lint, tests, and build.

Do not record real credentials, access tokens, or private environment variables.

## 5. Submit One Link Set

Provide the evaluator with:

- Public GitHub repository URL
- Live deployment URL
- Screen recording URL
- README and architecture/API document links
- Optional short note about deployment proxy configuration

Example final message:

```text
Repository: <github-url>
Live demo: <deployment-url>
Screen recording: <video-url>
Documentation: available in README.md and docs/
Validation: npm run lint, npm test, and npm run build pass locally
```

## 6. Final Evaluator Smoke Test

Before sending the links, test the public deployment in an incognito window. Confirm that:

- Login works without a CORS error.
- Refreshing `/dashboard`, `/board`, and `/analytics` does not lose the route.
- The sidebar active state follows the route.
- Board state and notifications behave after refresh.
- The 375px layout has no page-level horizontal overflow.
