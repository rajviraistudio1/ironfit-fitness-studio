# IronFit Fitness Studio — 30-Day Fitness Challenge

A high-performance, mobile-first lead generation web application and CRM intake engine for **IronFit Fitness Studio** in HSR Layout, Bengaluru, Karnataka.

Primary conversion goal: **Generate qualified membership enquiries for the IronFit 30-Day Fitness Challenge**.

---

## 🏋️‍♂️ Features

- **High-Converting Landing Page**:
  - Hero section with social proof, urgency counters, and direct CTA
  - Interactive lead capture form with client and server-side validation & anti-spam honeypot
  - Challenge program breakdown, amenities, certified trainer roster, and FAQ
  - Mobile sticky CTA bar for instantaneous conversion
- **Database & Persistence**:
  - Direct real-time persistence to **Supabase PostgreSQL** (`public.leads` table)
  - Automatic local disk storage fallback ensuring zero lead loss during network interruptions
- **Automated Instant Email Alerts**:
  - Direct integration with **Resend API** and **SMTP (Gmail / Brevo / SendGrid / SES)**
  - Sends immediate HTML notification to the gym owner for every submitted lead
  - Contains one-tap quick-action buttons: 📞 Call Prospect, 💬 WhatsApp, and ✉️ Reply
- **Owner Admin Portal (`/admin`)**:
  - Real-time pipeline metrics (Total Leads, New, Contacted, Follow-up, Converted, Closed)
  - Search, filter by goal/status, status management
  - Email notification status manager with 1-click test alert dispatcher
  - CSV export for offline follow-up

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express, tsx
- **Database**: Supabase (PostgreSQL)
- **Email Delivery**: Resend API & Nodemailer (SMTP)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
git clone <your-github-repo-url>
cd <repo-folder>
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=3000
ADMIN_PASSWORD=ironfit2026

# Supabase Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Owner Notification Target
OWNER_NOTIFICATION_EMAIL=your-email@example.com

# Email Delivery Option 1: Resend (Recommended, https://resend.com)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM="IronFit Studio <onboarding@resend.dev>"

# Email Delivery Option 2: Gmail SMTP (Optional Fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup

Run the following SQL in your **Supabase SQL Editor**:

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  fitness_goal text not null,
  preferred_workout_time text not null,
  message text,
  status text not null default 'New',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.leads enable row level security;

-- Allow public form submissions
create policy "Allow public lead submissions"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- Allow reading leads for admin dashboard
create policy "Allow viewing leads"
  on public.leads for select
  to anon, authenticated
  using (true);

-- Allow updating lead status
create policy "Allow updating leads"
  on public.leads for update
  to anon, authenticated
  using (true)
  with check (true);
```

---

## 🛡️ Admin Portal

Access the dashboard at `/admin`.
- Default credentials:
  - **Email**: `owner@ironfitfitness.example`
  - **Password**: `ironfit2026` *(Configurable in `.env` via `ADMIN_PASSWORD`)*

---

## 📦 Production Build

```bash
npm run build
npm start
```
