# Setup Instructions

This guide walks a new developer through getting the Project Management System running locally from scratch.

---

## Prerequisites

Install the following before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | >= 18 | https://nodejs.org |
| npm | >= 9 | Included with Node.js |
| MySQL | 8.x | https://dev.mysql.com/downloads/ |
| Git | Latest | https://git-scm.com |

Verify your installations:

```bash
node --version     # should print v18.x.x or higher
npm --version      # should print 9.x.x or higher
mysql --version    # should print 8.x.x
git --version
```

---

## Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd project-management-system
```

---

## Step 2 — Install Dependencies

Install backend and frontend dependencies separately:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Step 3 — Environment Variables

### Backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
# Application
NODE_ENV=development
PORT=3000

# Database — update with your MySQL credentials
DATABASE_URL=mysql://root:YOUR_PASSWORD@localhost:3306/project_management_db

# JWT — generate a secure secret (command below)
JWT_SECRET=replace_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d

# CORS — frontend origin
CLIENT_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=12
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET`.

### Frontend

```bash
cd frontend
cp .env.example .env
```

The frontend `.env` can stay as-is for local development. Vite's proxy automatically forwards `/api` requests to `http://localhost:3000`.

---

## Step 4 — Database Setup

### 4a. Create the database

Open **MySQL Workbench** (or any MySQL client) and run:

```sql
CREATE DATABASE project_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 4b. Run Prisma migrations

This creates all the tables (`users`, `projects`, `tasks`) automatically:

```bash
cd backend
npx prisma migrate dev --name init
```

You should see output like:
```
✔ Generated Prisma Client
✔ Applied migration `20260911_init`
```

### 4c. Verify the tables (optional)

In MySQL Workbench, refresh your schema and you should see:
- `users`
- `projects`
- `tasks`

Or use Prisma Studio (a visual DB browser):

```bash
cd backend
npx prisma studio
```

Opens at **http://localhost:5555**

---

## Step 5 — Start the Development Servers

You need **two terminals** running simultaneously:

**Terminal 1 — Backend API**
```bash
cd backend
npm run dev
```

Expected output:
```
[server] Server running on http://localhost:3000
[server] Database connected successfully
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

---

## Step 6 — Open in Browser

Visit **http://localhost:5173**

You will see the login page. Click **Register** to create your first account.

---

## Common Issues

### MySQL connection refused
- Make sure MySQL service is running
- Check your `DATABASE_URL` password in `backend/.env`
- Default MySQL port is `3306` — confirm it's not changed

### Port already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Prisma client not generated
```bash
cd backend
npx prisma generate
```

### Frontend shows blank page / API errors
- Make sure the backend is running on port 3000
- Check `vite.config.js` proxy points to `http://localhost:3000`
- Open browser DevTools → Network tab to see failing requests

---

## Project Structure Reference

```
project-management-system/
├── backend/                   # Express.js API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Migration history
│   ├── src/
│   │   ├── config/            # Environment config, Prisma singleton
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, error handling, rate limiting
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic and DB queries
│   │   ├── validators/        # Input validation rules
│   │   ├── utils/             # JWT, password, logger, response helpers
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   └── .env.example           # Environment variable template
│
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth and theme context
│   │   ├── hooks/             # Data fetching hooks
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Route-level page components
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Axios API service functions
│   │   └── utils/             # Date formatting, slug helpers
│   └── .env.example           # Environment variable template
│
└── docs/
    ├── API.md                 # Full API reference
    ├── ER_DIAGRAM.md          # Database schema
    └── SETUP.md               # This file
```

---

## Environment Variable Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Runtime environment |
| `PORT` | No | `3000` | API server port |
| `DATABASE_URL` | **Yes** | — | MySQL connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token lifetime |
| `CLIENT_URL` | No | `http://localhost:5173` | Allowed CORS origin |
| `BCRYPT_ROUNDS` | No | `12` | Password hashing cost |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX` | No | `10` | Max requests per window per IP |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | _(empty)_ | Backend URL — leave empty for local dev |

---

## Useful Commands

```bash
# View DB tables in browser
cd backend && npx prisma studio

# Re-generate Prisma client after schema change
cd backend && npx prisma generate

# Reset database (drops all data and re-runs migrations)
cd backend && npx prisma migrate reset

# Check backend health
curl http://localhost:3000/api/health
```
