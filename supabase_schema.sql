-- ═══════════════════════════════════════════════════════
--  Upper Crust Bakery — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════

-- ── Users ────────────────────────────────────────────────
create table if not exists uc_users (
  id           text primary key,
  name         text not null,
  email        text unique not null,
  pass_hash    text not null,
  role         text not null default 'customer',
  phone        text default '',
  address      jsonb default '{}',
  created_at   bigint
);

-- ── Products ─────────────────────────────────────────────
create table if not exists uc_products (
  id           text primary key,
  name         text not null,
  cat          text not null,
  description  text,
  price        int not null,
  tag          text,
  tag_class    text default '',
  emoji        text default '🍞',
  img          text,
  in_stock     boolean default true,
  sort_order   int default 99,
  created_at   bigint,
  updated_at   bigint
);

-- ── Orders ───────────────────────────────────────────────
create table if not exists uc_orders (
  id               text primary key,
  user_id          text,
  customer_name    text,
  customer_email   text,
  items            jsonb,
  address          jsonb,
  phone            text,
  payment_method   text,
  payment_status   text,
  total            int,
  delivery_charge  int,
  status           text default 'pending_verification',
  created_at       bigint,
  updated_at       bigint
);

-- ── Row Level Security ───────────────────────────────────
-- Enable RLS on all tables (blocks access by default)
alter table uc_users    enable row level security;
alter table uc_products enable row level security;
alter table uc_orders   enable row level security;

-- Permissive policies for v1 (anon key can read/write)
-- TODO: tighten these before high-traffic launch:
--   - uc_users: only allow read of own row
--   - uc_orders: only allow read of own orders
--   - uc_products: allow public read, only service_role write
create policy "anon_all" on uc_users    for all using (true) with check (true);
create policy "anon_all" on uc_products for all using (true) with check (true);
create policy "anon_all" on uc_orders   for all using (true) with check (true);


-- ── Indexes (add after first 100 orders for performance) ─
-- create index if not exists idx_orders_user    on uc_orders(user_id);
-- create index if not exists idx_orders_status  on uc_orders(status);
-- create index if not exists idx_orders_created on uc_orders(created_at desc);
-- create index if not exists idx_users_email    on uc_users(email);
-- create index if not exists idx_products_cat   on uc_products(cat);
