# Zorvyn Finance Dashboard

Backend-heavy finance dashboard built with Next.js App Router and MongoDB. The implementation prioritizes backend correctness, clear RBAC enforcement, maintainable code, and complete end-to-end flows.

## Stack
- Next.js 16 (App Router)
- TypeScript (strict)
- React 19
- Tailwind CSS 4
- MongoDB + Mongoose
- Zod validation
- JWT session auth (`httpOnly` cookie)
- `bcryptjs` for password hashing
- Recharts + Framer Motion for dashboard UX

## Project Structure
```text
src/
  app/
    (auth)/login/page.tsx
    (dashboard)/
      dashboard/page.tsx
      records/page.tsx
      records/new/page.tsx
      records/[id]/page.tsx
      records/[id]/edit/page.tsx
      analytics/page.tsx
      users/page.tsx
    api/
      auth/{login,logout,me}
      users/{route,[id], [id]/status}
      records/{route,[id]}
      dashboard/{summary,trends,categories,recent}
      analytics/export
  components/
    auth/
    layout/
    dashboard/
    records/
    users/
    ui/
  lib/
    db.ts
    auth.ts
    permissions.ts
    validators.ts
    http.ts
    errors.ts
    rate-limit.ts
    utils.ts
    server-auth.ts
  models/
    User.ts
    FinancialRecord.ts
  services/
    auth.service.ts
    user.service.ts
    record.service.ts
    dashboard.service.ts
  constants/
  types/
scripts/
  seed.ts
docs/
  progress.md
```

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` from `.env.example`:
```bash
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=zorvyn_finance
JWT_SECRET=replace-with-a-long-random-secret
```

3. Seed demo data:
```bash
npm run seed
```

4. Run dev server:
```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Demo Credentials
- Admin: `admin@zorvyn.com` / `Admin@12345`
- Analyst: `analyst@zorvyn.com` / `Analyst@12345`
- Viewer: `viewer@zorvyn.com` / `Viewer@12345`

## RBAC Rules
- Viewer:
  - Can access dashboard summary and records read-only views.
  - Cannot create/update/delete records.
  - Cannot manage users.
- Analyst:
  - Viewer capabilities + analytics and CSV export.
  - No destructive/admin user actions.
- Admin:
  - Full user and record management.

Additional enforcement:
- Inactive users are blocked from protected API/page access.
- Sensitive APIs validate auth + role server-side (not UI-only checks).

## API Overview

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users (Admin)
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/[id]`
- `PATCH /api/users/[id]`
- `PATCH /api/users/[id]/status`
- `DELETE /api/users/[id]` (deactivates user)

### Records
- `GET /api/records` (pagination + filters + search + sort)
- `POST /api/records` (admin)
- `GET /api/records/[id]`
- `PATCH /api/records/[id]` (admin)
- `DELETE /api/records/[id]` (admin, soft delete)

### Dashboard / Analytics
- `GET /api/dashboard/summary`
- `GET /api/dashboard/trends?period=monthly|weekly`
- `GET /api/dashboard/categories`
- `GET /api/dashboard/recent`
- `GET /api/analytics/export` (analyst/admin)

## Records Filter Query Parameters
`GET /api/records` supports:
- `page`
- `limit`
- `type`
- `category`
- `dateFrom`
- `dateTo`
- `search`
- `sortBy` (`date|amount|createdAt|category`)
- `sortOrder` (`asc|desc`)

## Validation and Error Handling
- Zod schemas validate payloads and query params.
- Standard response envelopes:

Success:
```json
{
  "success": true,
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "Clear message",
  "errors": {}
}
```

- Status code strategy:
  - `400` invalid input
  - `401` unauthenticated
  - `403` forbidden/inactive
  - `404` not found
  - `409` conflicts (e.g., duplicate email)
  - `500` unexpected errors

## How Summaries Are Computed
- `summary`: aggregation by record type for total income/expense; net = income - expense.
- `categories`: grouped totals by category with income/expense/total volume.
- `trends`: grouped by month or ISO week with income/expense/net points.
- `recent`: latest records sorted by transaction date.
- Soft-deleted records are excluded from all summary/trend queries.

## Optional Enhancements Included
- Auth route rate limiting (`/api/auth/login`)
- CSV export endpoint for analytics
- Soft delete for financial records
- User deactivation flow
- Pagination, search, and filtering support
- Seed script with realistic data distribution across multiple months

## Tradeoffs
- Public registration is intentionally excluded for v1 simplicity and stronger account control.
- No heavy state-management or complex API abstraction layer; route handlers stay thin and services hold logic.
- Automated test suite is not included yet to keep v1 scope focused on backend correctness and full workflow completion.

## Assumptions
- MongoDB is available locally or remotely via `MONGODB_URI`.
- UTC behavior for aggregation dates is acceptable for v1.
- Existing viewer/analyst/admin policy is the source of truth for permissions.
