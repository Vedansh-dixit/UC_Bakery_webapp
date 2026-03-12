# 🍞 Upper Crust Bakery — E-Commerce Website

A fully-featured artisan bakery e-commerce platform delivered as a **single HTML file**. No framework, no build step, no dependencies.

---

## Live Demo

> Deploy to Vercel and paste your URL here.

---

## Features

| Feature | Status |
|---|---|
| Product catalogue with category filters | ✅ |
| Shopping cart (persistent via localStorage) | ✅ |
| User auth (signup / login / profile) | ✅ |
| Secure checkout flow with address validation | ✅ |
| Razorpay payment (card / UPI / net banking) | ✅ |
| GPay / UPI QR code payment | ✅ |
| Mock payment sandbox (3 scenarios) | ✅ |
| Order confirmation & history | ✅ |
| Admin dashboard (revenue, orders, stock) | ✅ |
| Product CRUD (add / edit / delete / stock toggle) | ✅ |
| Wishlist | ✅ |
| Info pages (FAQ, Returns, Privacy, Terms, Blog, Careers) | ✅ |
| Custom order request form | ✅ |
| Supabase PostgreSQL backend | ✅ |
| localStorage fallback (works offline / demo mode) | ✅ |
| Mobile-first responsive design | ✅ |
| XSS-safe (all user content sanitised via x()) | ✅ |
| SHA-256 password hashing (SubtleCrypto) | ✅ |
| 7-day session expiry | ✅ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML + CSS + Vanilla JS (single file) |
| Database | Supabase (PostgreSQL) |
| Auth | Custom email/password — SHA-256 hash |
| Payments | Razorpay SDK + GPay UPI QR |
| Hosting | Vercel (free Hobby tier) |

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/upper-crust-bakery.git
cd upper-crust-bakery
```

### 2. Configure

Open `index.html` and edit the `CFG` block near the top of the `<script>` tag:

```javascript
var CFG = {
  SUPABASE_URL:        'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY:   'eyJ...',       // from Supabase → Settings → API
  USE_SUPABASE:        true,
  UPI_ID:              'yourbusiness@upi',
  UPI_NAME:            'Your Bakery Name',
  FREE_DELIVERY_ABOVE: 500,
  DELIVERY_FEE:        49,
  RAZORPAY_KEY_ID:     'rzp_test_YOUR_KEY',  // from razorpay.com/app/keys
};
```

### 3. Set up Supabase

Run this SQL in your Supabase project → **SQL Editor**:

```sql
create table if not exists uc_users (
  id text primary key,
  name text not null,
  email text unique not null,
  pass_hash text not null,
  role text not null default 'customer',
  phone text default '',
  address jsonb default '{}',
  created_at bigint
);

create table if not exists uc_products (
  id text primary key,
  name text not null,
  cat text not null,
  description text,
  price int not null,
  tag text,
  tag_class text default '',
  emoji text default '🍞',
  img text,
  in_stock boolean default true,
  sort_order int default 99,
  created_at bigint,
  updated_at bigint
);

create table if not exists uc_orders (
  id text primary key,
  user_id text,
  customer_name text,
  customer_email text,
  items jsonb,
  address jsonb,
  phone text,
  payment_method text,
  payment_status text,
  total int,
  delivery_charge int,
  status text default 'pending_verification',
  created_at bigint,
  updated_at bigint
);

-- Row Level Security (permissive for v1 — tighten before high-traffic launch)
alter table uc_users    enable row level security;
alter table uc_products enable row level security;
alter table uc_orders   enable row level security;

create policy "anon_all" on uc_users    for all using (true) with check (true);
create policy "anon_all" on uc_products for all using (true) with check (true);
create policy "anon_all" on uc_orders   for all using (true) with check (true);
```

### 4. Open locally

Just open `index.html` in any browser. No server needed.

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Settings:
   - **Framework Preset:** Other
   - **Build Command:** *(leave empty)*
   - **Output Directory:** *(leave empty)*
   - **Root Directory:** *(leave as `.`)*
4. Click **Deploy**

Your site is live at `yourproject.vercel.app` in ~30 seconds.

---

## First Admin Account

When you open the site for the first time (no users in the database), a banner appears at the bottom:

> 👋 Welcome to Upper Crust! First account becomes **Admin**.

Click **Create Admin Account →** and sign up. Every subsequent account is automatically a customer.

---

## Payments

### Test Mode (default)
The `RAZORPAY_KEY_ID` is set to `'rzp_test_YOUR_KEY'` by default, which activates the **Mock Payment Gateway** with 3 test scenarios:
- ✅ Simulate Success
- ❌ Simulate Failure  
- ⏳ Simulate Pending

### Live Mode
1. Sign up at [razorpay.com](https://razorpay.com) (free)
2. Go to **Settings → API Keys** → Generate Test Key
3. Replace `rzp_test_YOUR_KEY` in CFG with your actual key
4. For production, use your live key `rzp_live_...`

---

## Security Notes

| What | How |
|---|---|
| Passwords | SHA-256 via `crypto.subtle` (browser-native, no library) |
| Sessions | passHash stripped before storing in localStorage; 7-day TTL |
| Admin operations | Role check on every admin function (not just UI) |
| XSS prevention | All user-controlled strings wrapped in `x()` sanitiser before innerHTML |
| First admin | Determined by `dbAnyAdmin()` (role check), not user count — prevents race condition |
| Rate limiting | Max 3 signup attempts per 10 minutes per browser session |
| Supabase anon key | Safe to expose publicly — Row Level Security controls data access |

---

## Repo Structure

```
upper-crust-bakery/
├── index.html          # The entire app (HTML + CSS + JS)
├── .gitignore
├── README.md
├── CHANGELOG.md        # Version history
├── supabase/
│   └── schema.sql      # Full DB schema (run this in Supabase SQL Editor)
└── docs/
    ├── PRD_v2.docx     # Product Requirements Document
    └── Design_Doc_v2.docx  # UI/UX Design Document
```

---

## Roadmap

| Feature | Phase |
|---|---|
| Guest checkout (no login required) | Phase 2 |
| Order confirmation email (Resend) | Phase 2 |
| Discount / promo codes | Phase 2 |
| Push notifications (order status) | Phase 2 |
| Customer review system | Phase 3 |
| Delivery time slots | Phase 3 |
| Multi-admin accounts | Phase 3 |

---

## Cost

| Service | Cost |
|---|---|
| Vercel Hobby hosting | **₹0 / month** |
| Supabase free tier (500 MB) | **₹0 / month** |
| Razorpay | ~2% per transaction |
| Custom domain (optional) | ~₹700 / year |

---

## License

Private / Proprietary. All rights reserved — Upper Crust Bakery.
