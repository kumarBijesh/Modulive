---
name: mystore-security
description: Reviews and implements security for MyStore authentication, validation, authorization, XSS, MongoDB, payments, rate limiting and audit logs.
---

# MyStore Security Skill

Use for security-sensitive changes.

## Process
1. Inspect the existing implementation.
2. Identify trust boundaries.
3. Identify threats and abuse cases.
4. Define Zod validation.
5. Define authentication/authorization requirements.
6. Implement safe data access.
7. Implement audit logging where appropriate.
8. Add tests for malicious/invalid inputs.
9. Run typecheck/lint/tests.
10. Summarize remaining risk.

Never remove a security control merely to make a test pass.
