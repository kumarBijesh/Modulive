# MyStore — Premium Furniture E-Commerce

Full-stack furniture e-commerce platform built with Next.js, TypeScript, MongoDB and Prisma.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- Prisma
- Auth.js
- Zod
- Argon2id
- Stripe Test Mode
- Playwright
- Vitest/Jest-compatible unit testing setup

## Start

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

## Environment

```env
DATABASE_URL="mongodb+srv://..."
AUTH_SECRET="..."
AUTH_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

APP_URL="http://localhost:3000"
```

Never commit `.env.local`.

## Core Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## Security

This project treats security as a first-class architecture concern.

- Argon2id password hashing
- Zod server-side validation
- Sanitization/normalization
- XSS defenses
- CSP/security headers
- Rate limiting
- RBAC
- Central error handling
- Audit logs
- Stripe webhook verification
- No secret values in client bundles or logs

## Development Strategy

Build in this order:

```text
Foundation
→ Security
→ Authentication
→ Catalog
→ Cart
→ Checkout
→ Orders
→ Admin
→ Testing
→ Deployment
```

## Design

The UI takes inspiration from the provided Modulive furniture design reference while remaining an original implementation.

Design principles:

- premium
- minimal
- editorial
- spacious
- product-focused
- responsive
- accessible
