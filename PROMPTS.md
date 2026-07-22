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
Prompt 10:

Let's add refresh tokens next. Implement secure refresh token rotation, store the refresh token in the database, and replace it whenever a new one is issued. Follow the same TDD workflow and include both unit and integration tests.

Prompt 11:

Now implement logout. When a user logs out, invalidate their refresh token so it can't be used again. Add the necessary tests and stop once everything is passing.

Prompt 12:

Let's add Google Sign-In. Integrate Google OAuth and issue the same JWT access and refresh tokens after a successful login. If any manual setup or credentials are required, stop and let me handle that first.

Prompt 13:
Finally, add role-based access control. Create reusable middleware to protect routes based on user roles, and cover both allowed and denied access with unit and integration tests. Follow the same RED → GREEN → REFACTOR workflow we've used throughout.
Prompt 14:
Let's start the Vehicle module. Implement the POST /api/vehicles endpoint so only ADMIN users can create vehicles. Follow the same RED → GREEN → REFACTOR workflow by writing the failing tests first, then implement the validation, service, controller, and route until all tests pass. Stop once it's complete so I can review it.

Prompt 15:
Now implement vehicle listing. Add GET /api/vehicles with pagination, sorting, and filtering by make, model, category, and price range using query parameters. Continue following the same TDD workflow and include both unit and integration tests.

Prompt 16:
Implement vehicle update and delete. Add PUT /api/vehicles/:id and DELETE /api/vehicles/:id with proper validation, authorization, and error handling. Write the failing tests first, complete the implementation, refactor, and ensure all tests pass before moving on.

Prompt 17:
Finally, implement vehicle purchase and restocking. Use a Prisma transaction with TransactionIsolationLevel.Serializable to safely handle concurrent purchases and prevent overselling. Add a restock endpoint for administrators and include unit and integration tests, including a concurrency test. Follow the same RED → GREEN → REFACTOR workflow and stop once the entire Vehicle module is complete so I can review 

prompts 18:
This phase is not just about building a React frontend—it is about creating a premium, production-quality user experience that immediately stands out in a portfolio. Take your time and prioritize quality over speed. I want this to look and feel like a product designed by a top-tier design team, not a typical CRUD application.

Design Philosophy
Build a modern, premium automotive marketplace inspired by products such as Tesla, Porsche, Apple, Linear, Stripe, Rivian, and modern SaaS dashboards.
Every page should feel polished, intentional, and visually balanced.
Maintain a clean visual hierarchy with generous spacing and consistent typography.
Avoid generic Bootstrap-style layouts or template-like designs.
Every UI decision should feel deliberate.
Creativity

Don't limit yourself to basic layouts. Use your creativity to design the best interface possible while keeping usability high.

You're encouraged to improve the UI beyond the specification whenever it results in a better user experience without changing backend functionality.

Think like a senior Product Designer and Senior Frontend Engineer working together.

Color System
Premium dark automotive showroom theme.
One carefully selected accent color used consistently.
Beautiful gradients where appropriate.
Excellent contrast.
Elegant shadows.
Glassmorphism only where it improves the design.
Avoid overly bright or neon colors.
Typography

Use modern fonts such as:

Inter
Satoshi
Plus Jakarta Sans
General Sans
Space Grotesk

Use a proper typography scale.

Every heading, label, button, and paragraph should have a clear visual hierarchy.

Animations

Use tasteful modern animations throughout the application.

Examples include:

Smooth page transitions
Card hover elevation
Button micro-interactions
Animated loading states
Skeleton loaders
Fade and slide entrances
Animated drawers
Animated modals
Smooth dropdowns
Animated filtering
Loading indicators
Empty state animations

Animations should feel premium, never distracting.

Use Framer Motion where appropriate.

Components

Every component should feel reusable and production-ready.

Examples:

Beautiful buttons
Premium input fields
Elegant cards
Animated dialogs
Professional tables
Responsive navigation
Smart empty states
Skeleton placeholders
Modern badges
Status chips
Filter pills

Avoid default browser styling.

Responsiveness

The application should be fully responsive.

Optimize separately for:

Mobile
Tablet
Laptop
Desktop
Ultrawide

Layouts should adapt naturally rather than simply shrinking.

Accessibility

Maintain accessibility while keeping the design premium.

Include:

Keyboard navigation
Proper labels
Focus indicators
ARIA attributes where appropriate
Good color contrast
Semantic HTML
Code Quality

Continue following the existing project architecture.

Keep components modular.

Avoid duplicated UI code.

Use reusable hooks, layouts, contexts, utilities, and shared components.

Maintain clean folder organization.

Performance

Optimize rendering where appropriate.

Lazy loading
Code splitting
Memoization when useful
Optimized API calls
Debounced search
Skeleton loading
Avoid unnecessary re-renders
UX

Every user interaction should feel polished.

Examples:

Instant feedback
Helpful empty states
Loading indicators
Optimistic UI updates
Meaningful error messages
Smooth transitions
Clear success states
Visual Quality

Assume this project will be reviewed by senior frontend engineers and design-focused recruiters.

The frontend should be portfolio-worthy and distinguish itself from standard React CRUD applications.

If multiple design approaches are possible, choose the one with the highest visual quality and user experience, even if it requires additional effort.

Do not rush implementation. Prioritize excellence over speed.

prompt 19:
Build the vehicle dashboard: fetch GET /api/vehicles, render a responsive grid
of cards with skeleton loading states, a sticky filter bar wired to
GET /api/vehicles/search with debounced input, and pagination controls.
Purchase button disabled and visibly styled as disabled when quantity is 0.
Write RTL component tests for: loading state, empty state,
disabled-purchase-at-zero-stock, and a successful purchase optimistically
decrementing the displayed quantity (with rollback on API failure).
prompt 20:
Add the admin-only CRUD UI (create/edit/delete vehicle forms + restock
action), gated on the role claim from AuthContext, with a distinct "admin
mode" visual accent as specified in PROJECT_SPEC.md. Client-side validation
should mirror the backend Joi rules so users get instant feedback, not just a
round trip to the server. Include a confirmation step before delete.

prompt 21:
 there is error in backend please resolve

 prompt 22:
 first of all pleasecload seed data ,so i can have idea and please change colour , also the website is too small please make it same as ecommerce platfrom include all the page add footer add everything that car ecommerce sits should contain take your time but i want best design and output .do websearch how carselling website are keeping fonts content copy it and i want an real world website . 

 prompt23:
 
now listen carefully website is not working at all opening admin normal page is coming so your task is to first of all check all the functionality in the system you can take acess of screen so you can also see after openong admin there is normal user page . so after you complete that take ss ensure that each functionalty is working after you complete that please check data is not showinf redisgn the whole webiste please make it look like an real world project add contact pages,profile page of user why there is not googl based login we have implemented that and i am gving you freedom lets suppose an ecommerce site contains a thing but it is not in our website imclude that take your time even you take2-4 hours no problem but please givre me real world production ready website

prompt 24:
done now please remove text box admin email it very improfessional
prompt25:
now in each product can you please sutaible car image from the net 

prompt 26:
Review the entire frontend implementation and identify all critical user flows that require automated tests. Create comprehensive React Testing Library and Vitest tests for authentication, Google OAuth flow, registration, login, logout, protected routes, profile page, admin dashboard, vehicle dashboard, search, pagination, purchase flow, and error states. Run the test suite, fix any failing tests, resolve any bugs uncovered by testing, and continue until all tests pass and the application is stable. For all future prompts, strictly follow the TDD workflow: RED → GREEN → REFACTOR, writing tests before implementation.

