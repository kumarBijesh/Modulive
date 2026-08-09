---
description: TypeScript, Next.js, testing and maintainability rules.
activation: always_on
---

# Code Quality

- TypeScript strict mode.
- Avoid any.
- Prefer small, composable functions.
- Keep server-only code out of client bundles.
- Mark Client Components only when necessary.
- Use typed return values for services.
- Keep validation schemas reusable.
- Avoid duplicated business logic.
- Keep components focused.
- Use meaningful names.
- Do not leave TODOs for security-critical behavior.
- Add tests for authentication, authorization, payments, validation and important business logic.
- Test failure paths, not only happy paths.
- Run lint, typecheck and tests before completion.
