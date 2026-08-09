---
description: Always-on architecture, security, quality and implementation rules for MyStore.
activation: always_on
---

# MyStore Always-On Rules

## Stack
- Next.js App Router + TypeScript strict mode.
- Tailwind CSS.
- MongoDB Atlas + Prisma.
- Auth.js for authentication/session management.
- Zod for validation.
- Argon2id for password hashing.
- Stripe TEST mode during development.
- Playwright for end-to-end tests.
- Use Server Components by default; Client Components only when interaction/browser APIs require them.

## Non-negotiable security
- Passwords are HASHED, never reversibly encrypted.
- Never store plaintext passwords.
- Never log passwords, password reset tokens, sessions, JWTs, API keys, Stripe secrets, database URLs, or payment credentials.
- Every server-side trust boundary must validate input with Zod or an equivalent typed validator.
- Client validation is UX only; server validation is mandatory.
- Enforce authentication and authorization on the server, not by hiding UI.
- Use context-aware output encoding and sanitization. Do not blindly sanitize every string.
- Avoid dangerouslySetInnerHTML. If rich text is required, sanitize it with an allowlist before rendering.
- Protect against XSS, injection, CSRF where applicable, IDOR, request abuse, unsafe redirects, path traversal and malicious file uploads.
- Use secure cookies, SameSite and appropriate HttpOnly/Secure settings.
- Add CSP and other security headers.
- Rate-limit login, registration, password reset, verification, contact/newsletter and other abuse-prone endpoints.
- Never trust browser-calculated prices, totals, stock, roles or payment success.
- Stripe webhooks must be signature-verified and idempotent.
- All admin mutations require server-side RBAC.
- Security-sensitive and important business actions must create audit events.

## Data and business logic
- Database access remains server-side.
- Keep business rules in reusable service functions rather than UI components.
- Use transactions/atomic patterns appropriate to MongoDB/Prisma.
- Re-read product price/stock from the database before creating an order.
- Store order item snapshots so historical orders remain stable after product edits.
- Validate ownership for customer resources such as orders and addresses.

## Error handling
- Use typed application errors.
- Centralize unexpected errors.
- Return safe, stable error codes/messages to clients.
- Never expose stack traces, database internals or secret configuration to users.
- Log useful diagnostics server-side without secrets.

## UI/UX
- Use the supplied Dribbble reference as inspiration, not as a pixel-perfect copy.
- Build an original premium furniture e-commerce experience.
- Prioritize typography, whitespace, product photography, hierarchy and usability.
- Keep search, account, cart and CTAs obvious.
- Mobile-first responsive design.
- Follow semantic HTML and accessibility basics.
- Respect reduced-motion preferences.

## Engineering
- Do not make broad rewrites when a focused change is sufficient.
- Before changing code, inspect the relevant files and existing conventions.
- After each meaningful change run typecheck/lint/tests relevant to the change.
- Do not mark work complete if checks fail.
- Do not silently weaken validation or security to make a feature pass.
- Keep dependencies justified and current.
