# PROMPTS
prompt 0
Scaffold a production-ready monorepo named "Motovra" with two workspaces:

- backend (Node.js + TypeScript + Express + Prisma + PostgreSQL)
- frontend (React 18 + TypeScript + Vite + Tailwind CSS)

At this stage, I only want the project structure and development configuration. Do not implement any application features or business logic.

Please include:

- Root, backend, and frontend package.json files with npm workspaces configured
- tsconfig.json for both backend and frontend
- Shared ESLint and Prettier configuration at the root
- A backend .env.example containing:
  - DATABASE_URL
  - JWT_SECRET
  - JWT_REFRESH_SECRET
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - GOOGLE_CALLBACK_URL
  - PORT
  - NODE_ENV
- A .gitignore covering node_modules, .env, dist, coverage, and .DS_Store
- Jest configuration for the backend
- Vitest + React Testing Library configuration for the frontend
- A GitHub Actions workflow at `.github/workflows/ci.yml` that runs linting and tests on every push and pull request, using a PostgreSQL service container for backend integration tests
- Empty `README.md` and `PROMPTS.md` files

Follow the project structure and conventions we agreed on earlier.

Once the scaffolding is complete, stop and let me review everything before we move on to the Prisma schema or any feature implementation.