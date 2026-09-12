# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a valid JWT delivered via `httpOnly` cookie set at login/register.

The cookie is automatically sent by the browser. When using API clients (curl, Postman), pass the cookie manually.

## Response Format

All responses use a consistent envelope:

**Success**
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

**Error**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [ ... ]
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (invalid ID format, etc.) |
| 401 | Unauthorised (missing or invalid JWT) |
| 404 | Not Found (or resource exists but is owned by another user) |
| 409 | Conflict (duplicate email) |
| 422 | Unprocessable Entity (validation errors) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| fullName | string | Yes | Max 100 chars |
| email | string | Yes | Valid email, must be unique |
| password | string | Yes | Min 8 chars |

**Response 201**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": {
      "id": 1,
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2026-09-11T10:00:00.000Z"
    }
  }
}
```

Sets `token` httpOnly cookie on success.

**Errors:** 409 (duplicate email), 422 (validation)

---

### POST /auth/login

Login with email and password.

**Request Body**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": {
    "user": {
      "id": 1,
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2026-09-11T10:00:00.000Z"
    }
  }
}
```

Sets `token` httpOnly cookie on success.

**Errors:** 401 (invalid credentials), 422 (validation)

---

### POST /auth/logout

Clear the JWT cookie and end the session.

**Request Body:** None

**Response 200**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### GET /auth/me

🔒 **Auth required**

Get the currently authenticated user's profile. Used by the frontend to restore session on page refresh.

**Response 200**
```json
{
  "success": true,
  "message": "User retrieved.",
  "data": {
    "user": {
      "id": 1,
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2026-09-11T10:00:00.000Z"
    }
  }
}
```

**Errors:** 401 (no/invalid token)

---

## Project Endpoints

All project endpoints require authentication. Projects are always scoped to the authenticated user — accessing another user's project returns **404** (not 403, to avoid existence leakage).

### GET /projects

🔒 **Auth required**

List all projects owned by the authenticated user.

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| search | string | Filter by name (case-insensitive contains) |
| status | string | Filter by status: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED` |

**Example**
```
GET /projects?search=alpha&status=IN_PROGRESS
```

**Response 200**
```json
{
  "success": true,
  "message": "Projects retrieved.",
  "data": {
    "projects": [
      {
        "id": 1,
        "name": "Alpha Project",
        "description": "A sample project",
        "status": "IN_PROGRESS",
        "startDate": "2026-01-01T00:00:00.000Z",
        "endDate": "2026-12-31T00:00:00.000Z",
        "createdAt": "2026-09-11T10:00:00.000Z",
        "updatedAt": "2026-09-11T10:00:00.000Z",
        "_count": { "tasks": 3 }
      }
    ]
  }
}
```

---

### GET /projects/:id

🔒 **Auth required**

Get a single project by ID.

**Response 200**
```json
{
  "success": true,
  "message": "Project retrieved.",
  "data": {
    "project": {
      "id": 1,
      "name": "Alpha Project",
      "description": "A sample project",
      "status": "IN_PROGRESS",
      "startDate": "2026-01-01T00:00:00.000Z",
      "endDate": "2026-12-31T00:00:00.000Z",
      "createdAt": "2026-09-11T10:00:00.000Z",
      "updatedAt": "2026-09-11T10:00:00.000Z",
      "_count": { "tasks": 3 }
    }
  }
}
```

**Errors:** 404 (not found or not owned by user)

---

### POST /projects

🔒 **Auth required**

Create a new project.

**Request Body**
```json
{
  "name": "Alpha Project",
  "description": "Optional description",
  "status": "NOT_STARTED",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | Max 150 chars |
| description | string | No | — |
| status | string | No | `NOT_STARTED` (default), `IN_PROGRESS`, `COMPLETED` |
| startDate | string | No | ISO date `YYYY-MM-DD` |
| endDate | string | No | ISO date `YYYY-MM-DD` |

**Response 201**
```json
{
  "success": true,
  "message": "Project created.",
  "data": { "project": { ... } }
}
```

---

### PUT /projects/:id

🔒 **Auth required**

Update an existing project. All fields are optional — send only what needs to change.

**Request Body** (all optional)
```json
{
  "name": "Updated Name",
  "description": "New description",
  "status": "COMPLETED",
  "startDate": "2026-01-01",
  "endDate": "2026-06-30"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Project updated.",
  "data": { "project": { ... } }
}
```

**Errors:** 404 (not found or not owned)

---

### DELETE /projects/:id

🔒 **Auth required**

Delete a project and all its tasks (cascade).

**Response 200**
```json
{
  "success": true,
  "message": "Project deleted."
}
```

**Errors:** 404 (not found or not owned)

---

## Task Endpoints

All task endpoints require authentication. Tasks are always scoped to the authenticated user. Accessing another user's task returns **404**.

### GET /tasks

🔒 **Auth required**

List tasks owned by the authenticated user.

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| projectId | number | Filter to tasks under a specific project |
| search | string | Filter by name (contains) |
| status | string | `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| priority | string | `LOW`, `MEDIUM`, `HIGH` |

**Example**
```
GET /tasks?projectId=1&status=PENDING&priority=HIGH
```

**Response 200**
```json
{
  "success": true,
  "message": "Tasks retrieved.",
  "data": {
    "tasks": [
      {
        "id": 1,
        "name": "Design database schema",
        "description": "Create ER diagram and Prisma schema",
        "priority": "HIGH",
        "status": "COMPLETED",
        "dueDate": "2026-10-01T00:00:00.000Z",
        "createdAt": "2026-09-11T10:00:00.000Z",
        "updatedAt": "2026-09-11T10:00:00.000Z",
        "projectId": 1
      }
    ]
  }
}
```

---

### GET /tasks/:id

🔒 **Auth required**

Get a single task by ID.

**Response 200** — same shape as individual task object above.

**Errors:** 404 (not found or not owned)

---

### POST /tasks

🔒 **Auth required**

Create a new task. The parent project must be owned by the authenticated user.

**Request Body**
```json
{
  "name": "Write unit tests",
  "description": "Optional description",
  "priority": "MEDIUM",
  "status": "PENDING",
  "dueDate": "2026-10-31",
  "projectId": 1
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | Max 150 chars |
| description | string | No | — |
| priority | string | No | `LOW`, `MEDIUM` (default), `HIGH` |
| status | string | No | `PENDING` (default), `IN_PROGRESS`, `COMPLETED` |
| dueDate | string | No | ISO date `YYYY-MM-DD` |
| projectId | number | Yes | Must be a project owned by the user |

**Response 201**
```json
{
  "success": true,
  "message": "Task created.",
  "data": { "task": { ... } }
}
```

**Errors:** 404 (project not found or not owned), 422 (validation)

---

### PUT /tasks/:id

🔒 **Auth required**

Update a task. All fields optional. Also used to **mark a task as complete**:

```json
{ "status": "COMPLETED" }
```

**Request Body** (all optional)
```json
{
  "name": "Updated task name",
  "description": "Updated description",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "dueDate": "2026-11-15"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Task updated.",
  "data": { "task": { ... } }
}
```

**Errors:** 404 (not found or not owned)

---

### DELETE /tasks/:id

🔒 **Auth required**

Delete a task.

**Response 200**
```json
{
  "success": true,
  "message": "Task deleted."
}
```

**Errors:** 404 (not found or not owned)

---

## Dashboard Endpoint

### GET /dashboard

🔒 **Auth required**

Returns aggregated statistics for the authenticated user. All counts are scoped to the current user's data only.

**Response 200**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved.",
  "data": {
    "stats": {
      "totalProjects": 5,
      "projectsNotStarted": 1,
      "projectsInProgress": 3,
      "projectsCompleted": 1,
      "totalTasks": 18,
      "pendingTasks": 7,
      "inProgressTasks": 4,
      "completedTasks": 7
    }
  }
}
```

**Errors:** 401 (unauthenticated)

---

## Health Check

### GET /health

No auth required. Useful for deployment probes.

**Response 200**
```json
{
  "success": true,
  "message": "API is running."
}
```
