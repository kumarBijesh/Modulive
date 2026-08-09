---
name: mystore-testing
description: Tests MyStore end-to-end behavior, security controls, forms, authentication, checkout and responsive UI.
---

# MyStore Testing Skill

Test:
- registration/login/logout
- validation failures
- authorization/IDOR
- XSS payload handling
- cart and stock rules
- checkout
- Stripe test webhooks
- duplicate webhook/idempotency behavior
- admin permissions
- audit logs
- responsive storefront
- accessibility basics

Never use real payment credentials in tests. Use Stripe test mode.
