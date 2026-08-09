# MyStore Furniture E-Commerce — PRD

## Product

A premium furniture e-commerce platform inspired by the visual language of the provided Modulive Dribbble reference.

Reference:
https://dribbble.com/shots/25639143-Modulive-Furniture-Landing-Page-E-commerce-Website

## Objective

Create a real, secure, scalable e-commerce application rather than a static design.

## Users

### Guest
Browse/search products and manage a guest cart.

### Customer
Account, addresses, cart, checkout, orders, profile.

### Admin
Products, categories, inventory, customers, orders.

### Super Admin
Administrative permissions and audit visibility.

## MVP

- Premium landing page
- Product catalog
- Product detail
- Search/filter/sort
- Authentication
- Guest + authenticated cart
- Checkout
- Stripe test payment
- Orders
- Customer account
- Admin dashboard
- Product/category/order management
- Audit logs
- Security foundation
- Automated tests

## Non-goals for V1

- Marketplace/multi-vendor
- AI recommendations
- Complex loyalty system
- Microservices
- Native mobile app
- Production payment before testing is complete

## Functional Requirements

### Authentication
Registration, login, logout, verification, reset, change password, session handling and RBAC.

### Products
CRUD, categories, inventory, images, pricing, status, search/filter/sort.

### Cart
Guest cart, authenticated cart, merge, stock validation, totals.

### Checkout
Address, review, server-side pricing, Stripe test mode, webhook confirmation.

### Orders
Creation, status lifecycle, payment status, order snapshots, customer history.

### Admin
Dashboard, product management, inventory, customers, orders, audit logs.

## Security Requirements

All external input is validated server-side. Passwords are hashed using Argon2id. XSS, injection, CSRF where applicable, insecure direct object access, unauthorized admin access, excessive request sizes and rate abuse must be addressed.

## Acceptance Criteria

The MVP is complete only when all critical customer and admin flows work and security/typecheck/lint/test checks pass.
