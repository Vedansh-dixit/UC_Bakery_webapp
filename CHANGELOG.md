# Changelog — Upper Crust Bakery

## v5.0 — Security Hardened + Full Feature Audit (March 2026)

### Security Fixes
- **CRITICAL**: Replaced djb2 (insecure 32-bit hash) with SHA-256 via `crypto.subtle` (browser-native)
- **CRITICAL**: `passHash` is now stripped from localStorage session via `Auth._safeUser()` before storage
- **HIGH**: All admin functions (`adminSetStatus`, `adminStock`, `saveProd`, `adminDel`, `uiAdmin`, `uiProducts`, `uiPform`) now have explicit role guards — callable from console by non-admins no longer works
- **HIGH**: `uiCheckout()` now null-checks `Auth.user` before accessing `savedAddress` — eliminates TypeError crash for logged-out users
- **HIGH**: `doOrder()` now guards against null `Auth.user` — eliminates undefined userId in order records
- **HIGH**: `adminStock` was declared `async async` (double keyword) — fixed to single `async`
- **MEDIUM**: Session now expires after 7 days (`_exp` timestamp stored in session object)
- **MEDIUM**: Signup rate-limited to 3 attempts per 10 minutes per browser session
- **MEDIUM**: First admin now determined by `dbAnyAdmin()` (checks by role) instead of `dbUserCount()` — eliminates race condition where two simultaneous signups could both become admin
- **LOW**: Email validated with proper regex `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`
- **LOW**: Password minimum length raised from 6 to 8 characters

### Logic Fixes
- `logout()` now clears the in-memory `wishlist` Set — previously wishlist persisted after logout
- `uiAccount()` now reuses the fetched orders array for the count badge — eliminates double DB fetch
- `submitCustomOrder()` now opens a pre-filled WhatsApp message to the bakery number instead of just resetting the form
- Cart `<img>` src in checkout summary was a broken string quote from earlier patch session — fixed
- First-run admin banner now calls `dbAnyAdmin()` (checks Supabase) instead of `localStorage.users` — banner correctly hidden if Supabase already has an admin

### New Features
- Full Razorpay payment integration with dynamic SDK loading
- Mock payment gateway with 3 test scenarios (Success / Failure / Pending)
- Info pages: FAQ, Returns Policy, Privacy Policy, Terms of Service, Blog, Careers, Sitemap
- Custom order form with WhatsApp deep link integration
- `submitCustomOrder()` pre-fills WhatsApp message with name, phone, requirement, budget, date

---

## v4.0 — Backend Integration (February 2026)

### Added
- Supabase PostgreSQL backend replacing pure localStorage
- localStorage retained as offline fallback — app works without internet
- `dbAnyAdmin()`, `dbUserByEmail()`, `dbSaveUser()`, `dbCreateOrder()`, `dbAllOrders()`, `dbUserOrders()`, `dbUpdateStatus()`, `dbToggleStock()`
- Graceful Supabase fallback — if SDK fails to load, app falls back to localStorage silently
- Auto-seed: empty `uc_products` table is seeded with CATALOG on first load

---

## v3.0 — Admin Dashboard (January 2026)

### Added
- Admin dashboard with revenue stats, order management, product CRUD
- Role-based access: first signup = admin, all subsequent = customer
- Order status flow: pending → confirmed → preparing → out for delivery → delivered
- Stock toggle with immediate UI update
- Product form (add / edit / delete with confirmation)

---

## v2.0 — Full E-Commerce (December 2025)

### Added
- Shopping cart with persistent localStorage
- Checkout flow with address validation
- GPay / UPI QR payment option
- Order confirmation modal
- My Orders history
- My Account with editable profile and saved address

---

## v1.0 — Storefront (November 2025)

### Added
- Product catalogue with 8 items across 6 categories
- Category filter tiles
- Wishlist (in-memory)
- Responsive mobile-first design
- Hero section, testimonials, newsletter
- Mobile navigation
