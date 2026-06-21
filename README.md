# 🏠 ServiceHub BD — Multi-Vendor Service Marketplace

A full-stack service marketplace platform built with Next.js 14, Prisma (SQLite), and Tailwind CSS. Inspired by Sheba.xyz.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM + SQLite
- **Auth:** Mock session-cookie RBAC (3 roles)

---

## Quick Setup

```bash
# 1. Clone and enter the project
cd service-marketplace

# 2. Run setup (installs deps, creates DB, seeds data)
bash setup.sh

# 3. Start development server
npm run dev

# 4. Open the app
# http://localhost:3000/login
```

---

## Demo Accounts

| Role     | Name                    | Email                     |
|----------|-------------------------|---------------------------|
| 🛡️ Admin  | Admin User              | admin@marketplace.com     |
| 🧹 Vendor | Rahim Cleaning Services | rahim@vendor.com          |
| 🔧 Vendor | Karim Plumbing Co.      | karim@vendor.com          |
| ❄️ Vendor | Jamal AC & Appliance    | jamal@vendor.com          |
| 👩 User   | Fatema Begum            | fatema@user.com           |

---

## Features

### 🔐 RBAC Authentication
- Cookie-based mock session system
- Global `middleware.ts` protects routes by role
- 3 distinct roles: Admin, Vendor, End-User

### 👩 End-User
- Browse searchable service catalog at `/marketplace`
- Filter by category (Cleaning, Plumbing, AC Repair…)
- Checkout with mock payment gateway (bKash / Nagad / Card)
- 2-second simulated payment processing
- View personal order history at `/orders`

### 🏪 Vendor
- Dashboard at `/vendor/dashboard` with stats (orders, earnings)
- List and manage services at `/vendor/services`
- View all received orders from customers

### 🛡️ Admin
- Platform overview dashboard at `/admin/dashboard`
- View all registered users at `/admin/users`
- See all transactions across vendors

---

## Database Schema (ERD)

```
User (id, name, email, role)
  │
  ├──[VENDOR]── VendorProfile (id, userId, bio, phone)
  │                  │
  │                  └── Service (id, vendorProfileId, name, description, price, category)
  │                             │
  └──[END_USER]── Transaction (id, userId, serviceId, amount, status, paymentMethod)
```

---

## Project Structure

```
service-marketplace/
├── app/
│   ├── login/page.tsx          # Role-based login page
│   ├── marketplace/            # Service catalog (End-User)
│   ├── checkout/               # Checkout + payment modal
│   ├── orders/page.tsx         # Order history (End-User)
│   ├── vendor/
│   │   ├── dashboard/          # Vendor stats + orders received
│   │   └── services/           # Manage listings
│   ├── admin/
│   │   ├── dashboard/          # Platform overview
│   │   └── users/              # All users table
│   └── api/
│       ├── auth/               # Login / logout endpoints
│       ├── checkout/           # Process + save transactions
│       └── vendor/services/    # Add new services
├── components/
│   └── Navbar.tsx              # Shared navigation
├── lib/
│   ├── prisma.ts               # DB client singleton
│   └── auth.ts                 # Role/session types
├── middleware.ts               # Route protection
└── prisma/
    ├── schema.prisma           # DB models
    └── seed.ts                 # Sample data
```

---

## Vibe Coding Workflow

This project was built using AI-assisted development ("vibe coding"):

1. **Prompt Structure:** Each feature was prompted as a unit — schema first, then API, then UI.
2. **AI Successes:** Prisma schema generation, Tailwind layouts, API route boilerplate.
3. **Manual Interventions:** Cookie encoding/decoding for middleware compatibility, Prisma singleton pattern for Next.js hot reload, TypeScript type alignment between server and client components.

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Apply schema to DB
npm run db:seed      # Insert sample data
npm run db:studio    # Open Prisma Studio (GUI)
```
