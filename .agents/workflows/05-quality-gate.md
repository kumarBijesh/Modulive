# MyStore Quality Gate

Before declaring any feature complete:

1. Inspect git diff.
2. Check for secrets.
3. Run typecheck.
4. Run lint.
5. Run unit/server tests.
6. Run Playwright tests where relevant.
7. Verify authentication/authorization.
8. Verify validation for every new input.
9. Verify error handling.
10. Verify audit logging for sensitive mutations.
11. Check XSS/injection risk.
12. Check mobile layout.
13. Check accessibility basics.
14. Check performance regressions.
15. Fix failures.
16. Only then report completion.
