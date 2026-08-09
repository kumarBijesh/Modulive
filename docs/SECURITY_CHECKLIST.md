# Security Checklist

## Authentication
- [ ] Argon2id
- [ ] Secure sessions
- [ ] Login throttling
- [ ] Password reset
- [ ] Email verification
- [ ] Account enumeration protection

## Validation
- [ ] Zod schemas
- [ ] Server-side validation
- [ ] Normalization
- [ ] Length/type/range constraints
- [ ] File validation

## XSS
- [ ] Safe React rendering
- [ ] No unsafe HTML
- [ ] Sanitized rich text
- [ ] CSP
- [ ] Security headers

## Authorization
- [ ] Customer ownership checks
- [ ] Admin checks
- [ ] Super-admin checks
- [ ] Server-side enforcement

## Payments
- [ ] Stripe test mode
- [ ] Server-side totals
- [ ] Webhook signature verification
- [ ] Idempotency
- [ ] No secret keys client-side

## Logging
- [ ] Audit log
- [ ] No passwords
- [ ] No tokens
- [ ] No secrets
- [ ] No full payment credentials

## Production
- [ ] HTTPS
- [ ] Secure cookies
- [ ] Environment secrets
- [ ] Dependency audit
- [ ] Database backups
- [ ] Monitoring
