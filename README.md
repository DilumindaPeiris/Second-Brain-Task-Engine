# Second Brain — Context-Aware Task Engine

A Kanban-based task management system that surfaces the exact files, links, and context needed to complete each task.

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port 27017

### Backend
```bash
cd server
npm install
npm run dev
```

The server starts at `http://localhost:5000`. Verify with:
```bash
curl http://localhost:5000/api/health
```

### Frontend
```bash
cd client
npm install
npm run dev
```

The client starts at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Create account |
| POST | `/api/auth/login` | ✗ | Login |
| GET | `/api/auth/me` | ✓ | Current user profile |
| GET | `/api/tasks` | ✓ | List all tasks |
| POST | `/api/tasks` | ✓ | Create a task |
| PUT | `/api/tasks/:id` | ✓ | Update a task |
| DELETE | `/api/tasks/:id` | ✓ | Delete a task |
| PATCH | `/api/tasks/reorder` | ✓ | Batch reorder tasks |
| POST | `/api/tasks/:id/snippets` | ✓ | Add context snippet |
| DELETE | `/api/tasks/:id/snippets/:sid` | ✓ | Remove context snippet |
