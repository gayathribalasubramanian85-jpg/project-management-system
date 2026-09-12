# Project Management System

A full-stack project and task management application built as a technical assessment.

---

## Live Demo

> Frontend: _add Vercel URL after deployment_
> Backend API: _add Railway URL after deployment_

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Node.js 18+, Express.js 4 |
| Database | MySQL 8, Prisma ORM 5 |
| Auth | JWT (httpOnly cookie), bcrypt (cost factor 12) |
| Security | Helmet, CORS, express-rate-limit, express-validator |

---

## Features

- User registration and login with JWT authentication
- Create, read, update, delete **Projects** with status tracking
- Create, read, update, delete **Tasks** with priority and due date
- Mark tasks as complete with a single click
- Dashboard with live statistics and completion charts
- Search and filter projects and tasks
- Pagination on projects and tasks
- Dark / Light theme toggle
- Fully responsive UI (mobile, tablet, desktop)

---

## Screenshots

### Login & Register

| Login | Register |
|-------|----------|
| ![Login](./docs/screenshots/login.png) | ![Register](./docs/screenshots/register.png) |

### Dashboard

![Dashboard](./docs/screenshots/dashboard.png)

### Projects

![Projects](./docs/screenshots/project.png)

### View Project Detail

![View Project](./docs/screenshots/viewproject.png)

### Create Project

![Create Project](./docs/screenshots/createproject.png)

### Edit Project

![Edit Project](./docs/screenshots/editproject.png)

### Delete Project

![Delete Project](./docs/screenshots/deleteproject.png)

### Create Task

![Create Task](./docs/screenshots/createtask.png)

### Edit Task

![Edit Task](./docs/screenshots/edittask.png)

### Delete Task

![Delete Task](./docs/screenshots/deletetask.png)

---

## Prerequisites

Before running locally, make sure you have:

- **Node.js** >= 18 → [Download](https://nodejs.org)
- **npm** >= 9 (comes with Node.js)
- **MySQL 8** running locally on port 3306 → [Download](https://dev.mysql.com/downloads/)
- **Git** → [Download](https://git-scm.com)

---

## Quick Start (Local)

### 1. Clone the repository

```bash
git clone <repo-url>
cd project-management-system
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open a new terminal)
cd frontend
npm install
```

### 3. Set up environment variables

```bash
# Copy the example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Open `backend/.env` and update these required values:

```env
DATABASE_URL=mysql://root:YOUR_PASSWORD@localhost:3306/project_management_db
JWT_SECRET=your_long_random_secret_here
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Create the MySQL database

In **MySQL Workbench** or any MySQL client, run:

```sql
CREATE DATABASE project_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 5. Run database migrations

```bash
cd backend
npx prisma migrate dev --name init
```

This creates the `users`, `projects`, and `tasks` tables automatically.

### 6. Start the servers

Open **two terminals**:

```bash
# Terminal 1 — Backend API (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | `development` or `production` |
| `PORT` | No | `3000` | Port Express listens on |
| `DATABASE_URL` | **Yes** | — | MySQL connection string |
| `JWT_SECRET` | **Yes** | — | Long random secret for JWT signing |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiry |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend origin for CORS |
| `BCRYPT_ROUNDS` | No | `12` | bcrypt cost factor |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window in ms |
| `RATE_LIMIT_MAX` | No | `10` | Max requests per window per IP |

### Frontend — `frontend/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | _(empty)_ | Backend API URL — leave empty locally (Vite proxy handles it) |

---

## Database Setup

The Prisma schema lives at `backend/prisma/schema.prisma`.

```bash
cd backend

# Apply all pending migrations (production / CI)
npx prisma migrate deploy

# Apply migrations in dev and regenerate Prisma client
npx prisma migrate dev

# Open Prisma Studio — visual DB browser
npx prisma studio

# Reset DB and re-apply all migrations (wipes data)
npx prisma migrate reset
```

---

## Project Structure

```
project-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (source of truth)
│   │   └── migrations/            # Migration history
│   ├── src/
│   │   ├── config/                # env.js, db.js (Prisma singleton)
│   │   ├── controllers/           # HTTP layer — calls services
│   │   ├── middleware/            # authenticate, errorHandler, rateLimiter, validate
│   │   ├── routes/                # Express routers per resource
│   │   ├── services/              # Business logic + DB queries
│   │   ├── validators/            # express-validator chains
│   │   ├── utils/                 # jwt.js, password.js, logger.js, response.js
│   │   ├── app.js                 # Express app factory
│   │   └── server.js              # Entry point
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Reusable UI components
│   │   │   ├── layout/            # Navbar, Sidebar
│   │   │   ├── projects/          # ProjectCard, ProjectForm, ProjectFilters
│   │   │   └── tasks/             # TaskItem, TaskForm, TaskFilters
│   │   ├── context/               # AuthContext, ThemeContext
│   │   ├── hooks/                 # useProjects, useTasks
│   │   ├── layouts/               # MainLayout
│   │   ├── pages/                 # LoginPage, RegisterPage, Dashboard, etc.
│   │   ├── routes/                # AppRoutes
│   │   ├── services/              # API service functions
│   │   └── utils/                 # formatDate, slugify
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── screenshots/               # Application screenshots
│   ├── API.md                     # Full API reference
│   ├── ER_DIAGRAM.md              # Database schema and ER diagram
│   └── SETUP.md                   # Detailed setup instructions
│
├── .gitignore
└── README.md
```

---

## API Overview

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login |
| POST | `/auth/logout` | No | Logout |
| GET | `/auth/me` | ✅ | Get current user |
| GET | `/projects` | ✅ | List own projects |
| GET | `/projects/:id` | ✅ | Get single project |
| POST | `/projects` | ✅ | Create project |
| PUT | `/projects/:id` | ✅ | Update project |
| DELETE | `/projects/:id` | ✅ | Delete project + tasks |
| GET | `/tasks` | ✅ | List own tasks |
| GET | `/tasks/:id` | ✅ | Get single task |
| POST | `/tasks` | ✅ | Create task |
| PUT | `/tasks/:id` | ✅ | Update task / mark complete |
| DELETE | `/tasks/:id` | ✅ | Delete task |
| GET | `/dashboard` | ✅ | Aggregated stats |
| GET | `/health` | No | Health check |

See [docs/API.md](./docs/API.md) for full request/response schemas.

---

## Security

- Passwords hashed with **bcrypt** (cost 12) — never stored plain text
- **JWT** in `httpOnly`, `SameSite=Strict` cookies — not accessible via JavaScript
- All data queries scoped to `userId` — users cannot access each other's data
- **Helmet** sets secure HTTP headers
- **CORS** restricted to configured `CLIENT_URL`
- **Rate limiting** on auth endpoints (10 req / 15 min per IP)
- **express-validator** validates and sanitises all request bodies
- Prisma ORM uses parameterised queries — no SQL injection possible

---

## Available Scripts

### Backend (`cd backend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start without nodemon |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio |

### Frontend (`cd frontend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## Documentation

| File | Description |
|------|-------------|
| [docs/API.md](./docs/API.md) | Full API documentation with all endpoints |
| [docs/ER_DIAGRAM.md](./docs/ER_DIAGRAM.md) | Database schema and entity relationships |
| [docs/SETUP.md](./docs/SETUP.md) | Step-by-step setup for another developer |
