# UsedBasic Marketplace Project

Welcome to the UsedBasic Marketplace, a comprehensive e-commerce and second-hand marketplace application designed for the Ethiopian market.

## Tech Stack Overview
This application is built using a modern, scalable stack:
- **Framework:** [Next.js 15](https://nextjs.org/) (App Directory routing).
- **Frontend Library:** [React 19](https://react.dev/).
- **Database:** [MongoDB](https://www.mongodb.com/) via Mongoose ODM.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) for rapid UI development.
- **Real-Time Communication:** [Pusher](https://pusher.com/) for real-time chat, events, and immediate notifications.
- **Authentication:** [NextAuth.js (v4)](https://next-auth.js.org/) for secure credential-based login, role-based access, and session management.
- **Forms & Validation:** `react-hook-form` coupled with `zod`.
- **Payment Gateway:** Custom abstraction using Chapa (Telebirr, CBE Birr, M-Pesa).

## Core Architecture
Our architecture isolates domains and favors clean, reusable abstractions:
- **`src/app`**: Contains Next.js App Router definitions. Folders here represent URL routes.
- **`src/components`**: Organized by domain (`auth`, `home`, `chat`, `products`, `seller`, etc.).
- **`src/lib`**:
  - `models/`: Mongoose schemas. See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for full ERD documentation.
  - `actions/`: Next.js Server Actions used primarily across the app for server-side logic (e.g., `product-actions.ts`).
  - `services/`: Encapsulated domain logic abstraction (e.g., `payment-service.ts`, `notification-service.ts`).
  - `db/`: MongoDB connection setup (`mongoose.ts`).

## Developer Setup
To set up the project on your local machine:

1. **Clone & Install Dependencies**
    ```bash
    git clone <repository_url>
    cd used_market
    npm ci
    ```

2. **Environment Variables**
    Copy `.env.example` (or configure a local `.env` file) based on the needed keys:
    - `MONGODB_URI`: Local or remote mongo instance.
    - `NEXTAUTH_SECRET`: Random hash for encrypting JWT payload.
    - `PUSHER_APP_ID`, `NEXT_PUBLIC_PUSHER_KEY`, `PUSHER_SECRET`, `NEXT_PUBLIC_PUSHER_CLUSTER`: Necessary for the chat application.

3. **Run Dev Server**
    ```bash
    npm run dev
    ```
    The application will be running on `http://localhost:3000`.

## Docker & CI/CD
A complete pipeline is maintained:
- **Docker**: Located via the `Dockerfile` at root. Utilize `docker-compose.yml` to spin up isolated container instances. A `.dockerignore` file aggressively ignores local dependencies to keep image sizes small.
- **Continuous Integration**: Configured in `.github/workflows/ci.yml`. It runs NPM install, linter scripts, and guarantees a successful Next.js production build for all PRs.

## Further Reading
- For Schema and Data Architecture, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).
- For Network & REST definitions within Next.js API Routes, see [API_ENDPOINTS.md](./API_ENDPOINTS.md).
