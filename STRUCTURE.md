# Project Architecture & Structure

This document outlines the professional folder structure implemented for **Used Market**. The project is designed to be **scalable**, **maintainable**, and follows modern **Next.js 14+ best practices**.

## 📂 Folder Overview

### 1. `src/app` (Routing & Pages)
The heart of the application using Next.js App Router.
- `(public)` / `(auth)`: Route groups for cleaner URL management (if implemented).
- `api/`: Backend API endpoints (for external integrations).
- `seller/`: Pages specific to sellers (e.g., `/seller/mystore`).
- `dashboard/`: The main browsing and management hub.

### 2. `src/components` (Frontend UI)
Organized by domain to avoid a "giant components folder" mess.
- `ui/`: Raw, reusable atomic components (Buttons, Inputs, Cards).
- `common/`: Global components like `Navbar`, `Footer`, `AuthProvider`.
- `store/`: Components specific to store creation and settings (e.g., `StoreForm`).
- `dashboard/`: Components used in the user/buyer dashboard.

### 3. `src/lib` (The Backend Logic)
This is where the "brains" of the application live, separated from the UI.
- `services/`: **Business Logic Layer**. Services like `StoreService` and `UploadService` handle complex operations.
- `actions/`: **Server Actions**. The bridge between frontend and database.
- `models/`: **Mongoose Models**. Definitions for `User`, `Store`, `Product`, etc.
- `utils/`: Helper functions, auth configurations, and formatting tools.
- `cloudinary.ts`: Dedicated configuration for image hosting.

### 4. `src/types`
Global TypeScript definitions to ensure type safety across the entire codebase.

---

## 🚀 Why this structure scales:

1.  **Separation of Concerns**: If you want to change your database (e.g., to PostgreSQL), you only change the `models` and `services`. The `components` don't care.
2.  **Domain Driven**: Everything related to "Stores" is in `lib/services/store-service` and `components/store`. This makes it easy to find code.
3.  **No Logic in Components**: Components are kept for "viewing" logic. Hard calculations and DB calls stay in `lib`.
4.  **Dry & Reusable**: Common UI is centralized in `components/ui`, preventing code duplication.

> [!TIP]
> As the project grows, consider moving **Server Actions** into feature-based folders if they become too many (e.g., `src/lib/actions/store/`, `src/lib/actions/product/`).

---

## Current Roadmap Consistency
| Feature | Logic Location | UI Location |
| :--- | :--- | :--- |
| **Authentication** | `lib/utils/auth.ts` | `components/auth/` |
| **Store Management** | `lib/services/store-service.ts` | `components/store/` |
| **Image Uploads** | `lib/services/upload-service.ts` | `lib/cloudinary.ts` |
