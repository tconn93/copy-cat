# JIRA Clone

A full-stack project management application inspired by JIRA, featuring a React + TypeScript frontend and Express.js backend.

## Features

- User authentication (JWT-based)
- Project management
- Issue tracking with Kanban board
- Drag-and-drop issue status updates
- Issue types: Story, Task, Bug, Epic
- Priority levels and assignees
- Sprint management
- Comments on issues
- Responsive design

## Tech Stack

### Backend
- Node.js + Express.js
- Prisma ORM
- SQLite (easily switchable to PostgreSQL)
- JWT authentication
- Bcrypt for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- @dnd-kit for drag-and-drop
- React Toastify for notifications

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (already done):
```bash
npm install
```

3. The database is already set up with migrations and seed data

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Demo Accounts

The database comes pre-seeded with test accounts:

- **Admin**: admin@example.com / password123
- **Developer**: dev@example.com / password123
- **Project Manager**: pm@example.com / password123

## Project Structure

```
JIRA/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── config/             # Database config
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth & error handling
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Helper functions
│   │   └── server.js           # Express app
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── contexts/           # Auth context
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   └── package.json
│
└── CLAUDE.md                   # Development guide
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Issues
- `GET /api/issues/project/:projectId` - Get project issues
- `POST /api/issues/project/:projectId` - Create issue
- `GET /api/issues/:id` - Get issue by ID
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `POST /api/issues/:id/comments` - Add comment

### Sprints
- `GET /api/sprints/project/:projectId` - Get project sprints
- `POST /api/sprints/project/:projectId` - Create sprint
- `PUT /api/sprints/:id` - Update sprint
- `POST /api/sprints/:id/start` - Start sprint
- `POST /api/sprints/:id/complete` - Complete sprint

## Database

The application uses SQLite by default. To switch to PostgreSQL:

1. Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `backend/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/jira_clone"
```

3. Run migrations:
```bash
cd backend
npx prisma migrate dev
npm run seed
```

## Development Commands

### Backend
```bash
npm run dev          # Start dev server with nodemon
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database with test data
npm run studio       # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Features Implemented

✅ User authentication and authorization
✅ Project CRUD operations
✅ Issue management with Kanban board
✅ Drag-and-drop issue status updates
✅ Issue comments
✅ Sprint management
✅ User assignments
✅ Multiple issue types and priorities
✅ Responsive design

## Future Enhancements

- [ ] Sprint reports and burndown charts
- [ ] Issue attachments
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Activity timeline
- [ ] Backlog management
- [ ] Epic tracking
- [ ] Time tracking
- [ ] Custom workflows
- [ ] Dashboard with analytics

## License

MIT
