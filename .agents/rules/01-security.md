---
description: Security review rules for authentication, input, API, database, payments and admin changes.
activation: model_decision
---

# Security Rules

For every feature that accepts user input or changes data:

1. Identify the trust boundary.
2. Create or update a Zod schema.
3. Normalize appropriate fields.
4. Validate on the server.
5. Authenticate the request where required.
6. Authorize the exact action and resource.
7. Apply business rules.
8. Perform the database operation safely.
9. Create an audit event when the action is security-sensitive or business-significant.
10. Return a safe response.

## Authentication
Use Auth.js for session management and Argon2id for passwords.

Never compare plaintext password values to database values.

Use generic login/reset responses where needed to reduce account enumeration.

## XSS
Render normal strings as text. Do not insert untrusted HTML. If rich text is required, sanitize with an explicit allowlist.

## MongoDB
Do not pass arbitrary user objects into Prisma filters or query construction. Map validated fields explicitly.

## Authorization
Use server-side checks for:
- authenticated user
- role
- ownership
- resource state
- permitted operation

## Payments
The browser cannot determine whether an order is paid. Stripe's verified server-side webhook is authoritative.

## Audit logs
Record actor, action, entity, result and useful metadata. Never record credentials, tokens or secrets.
