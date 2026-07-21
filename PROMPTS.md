# PROMPTS
prompt 1
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

prompt 2:
- Configure Prisma to read the connection string from DATABASE_URL.
- Update backend/.env.example to include a placeholder DATABASE_URL showing
  the expected format only.
- Ensure Prisma is configured to connect to the database once the schema is
  added in the next step.
- Do not create any Prisma models, migrations, or business logic yet.

Stop after the Prisma configuration is complete and wait for my review before
we move on to designing the database schema.

prompt3:
showing error in health.ts file database is not connecting

prompt4:
Let's add some sample data so the application isn't empty after setup.
Create a Prisma seed script (`backend/prisma/seed.ts`) that inserts
- One ADMIN user
- One CUSTOMER user
- 6–8 sample vehicles from different brands and categories
Use obviously fake credentials (for example, admin@example.com) and make sure the passwords are hashed.
Also configure it so I can run the seed using:
npm run db:seed
Keep it limited to the seed script only. Don't start implementing authentication or any business logic yet. Once it's done, stop and let me review the changes before we move to the Auth module.

prompt5:
In backend/src/modules/auth, write a FAILING Jest unit test for
authService.register(email, password): it should hash the password with bcrypt
(cost 12), reject duplicate emails with a ConflictError, and reject invalid
emails/short passwords via Joi validation before the service is even called.
Do not implement authService yet — I want to see it fail first.
 prompt6:
 Now implement authService.register and the Joi schema in auth.validation.ts so
that the failing test from Prompt 5 passes. Keep it minimal — no extra
features, no login logic yet.
prompt7:
Review authService.register for duplication with what login will need next
(password hashing utils, error types). Extract shared bits into
common/utils/password.ts and common/errors/. Re-run tests to confirm still
green before you show me the diff.
prompt8:
From this point onward, follow the same Test-Driven Development (TDD) workflow that we have successfully followed in the previous tasks.
Implement the user login flow with JWT-based authentication. Add unit and integration tests for the complete login flow, including invalid credentials and protected route access.
prompt9:
the integration red phase has been crashed please check and solve the issue

