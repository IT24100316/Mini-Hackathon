# FixMyArea LK

Community issue reporting application.

## Step 1: Project Setup

This workspace contains:

- `client/` - React + Vite frontend
- `server/` - Express + Node.js backend

## Run The Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Backend API test route:

```text
http://localhost:5001/api/health
```

## Run The Frontend

In a second terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Step 2: Supabase Setup

Create the database table by running the SQL in:

```text
supabase/schema.sql
```

If you already created an `issues` table and see a missing-column error, run:

```text
supabase/fix-issues-columns.sql
```

Create a Supabase Storage bucket named:

```text
issue-images
```

Then add your Supabase values to `server/.env`:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Supabase status test route:

```text
http://localhost:5001/api/supabase/status
```
