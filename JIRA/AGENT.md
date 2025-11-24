# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JIRA clone project consisting of a backend API and frontend web application. The goal is to replicate core JIRA functionality including project management, issue tracking, workflows, sprints, and team collaboration features.

## Project Structure

The repository is organized as follows:

- `backend/` - Backend API service
- `frontend/` - Frontend web application
- `docs/` - Project documentation (if needed)

## Technology Stack Decisions

When implementing this project, use the following technology choices unless explicitly instructed otherwise:

### Backend
- **Framework**: Express.js (Node.js) or FastAPI (Python) - choose based on team preference
- **Database**: PostgreSQL for relational data (projects, issues, users, comments)
- **Authentication**: JWT-based authentication
- **ORM**: Prisma (for Node.js) or SQLAlchemy (for Python)
- **API Style**: RESTful API with proper HTTP methods and status codes

### Frontend
- **Framework**: React with TypeScript
- **State Management**: React Context API or Redux Toolkit
- **Routing**: React Router
- **UI Components**: Material-UI or Ant Design (for a professional look similar to JIRA)
- **HTTP Client**: Axios or Fetch API
- **Build Tool**: Vite

## Core Features to Implement

1. **User Management**
   - Authentication and authorization
   - User profiles and roles (Admin, Project Manager, Developer, Viewer)
   - User assignments to projects

2. **Project Management**
   - Create, read, update, delete projects
   - Project settings and configuration
   - Project members and permissions

3. **Issue/Task Management**
   - Issue types (Story, Task, Bug, Epic)
   - Issue states/statuses (To Do, In Progress, Done, etc.)
   - Issue priorities (Highest, High, Medium, Low, Lowest)
   - Issue assignments
   - Issue descriptions with rich text
   - Issue comments and activity history
   - Issue attachments (optional for MVP)

4. **Board Views**
   - Kanban board with drag-and-drop
   - Backlog view
   - Issue filtering and sorting

5. **Sprint Management**
   - Create and manage sprints
   - Sprint planning
   - Sprint reports (optional for MVP)

## Database Schema Considerations

Key entities and relationships:

- **Users** - Authentication, profile information, roles
- **Projects** - Project metadata, settings
- **ProjectMembers** - Junction table for users and projects with roles
- **Issues** - Core issue data (title, description, type, status, priority, assignee, reporter, project)
- **Comments** - Issue comments with user and timestamp
- **Sprints** - Sprint metadata linked to projects
- **SprintIssues** - Junction table for sprints and issues
- **IssueHistory** - Audit trail for issue changes (optional for MVP)

Ensure proper foreign key relationships and indexes for performance.

## Development Commands

### Backend Setup
```bash
cd backend
npm install          # or pip install -r requirements.txt
npm run dev          # or python main.py
npm test             # Run tests
npm run migrate      # Run database migrations
npm run seed         # Seed database with test data (optional)
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
```

## API Design Principles

- Use RESTful conventions: `/api/projects`, `/api/projects/:id`, `/api/projects/:id/issues`
- Return appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Use consistent error response format
- Implement pagination for list endpoints
- Use query parameters for filtering and sorting
- Protect endpoints with authentication middleware

### Example API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/issues
POST   /api/projects/:id/issues
GET    /api/issues/:id
PUT    /api/issues/:id
DELETE /api/issues/:id
POST   /api/issues/:id/comments
GET    /api/sprints
POST   /api/sprints
PUT    /api/sprints/:id
```

## Frontend Architecture

- **Pages**: Login, Projects List, Project Board, Issue Details, Sprint Management
- **Components**: Organize by feature (issues/, projects/, boards/, common/)
- **Context/Store**: Manage authentication state, current project, and board state
- **API Layer**: Centralize API calls in a services/ directory
- **Types**: Define TypeScript interfaces matching backend models

## Implementation Priority

For MVP, implement in this order:
1. Basic authentication (register, login, JWT)
2. User management
3. Project CRUD operations
4. Issue CRUD operations with basic fields
5. Project board view (Kanban)
6. Issue status transitions (drag and drop)
7. Issue comments
8. Sprint management
9. Advanced features (filters, search, attachments, reporting)

## Testing Strategy

- Backend: Write unit tests for business logic, integration tests for API endpoints
- Frontend: Write component tests for key UI components, integration tests for user flows
- E2E: Consider Playwright or Cypress for critical user journeys

## Security Considerations

- Hash passwords using bcrypt
- Validate and sanitize all user inputs
- Implement rate limiting on authentication endpoints
- Use parameterized queries to prevent SQL injection
- Implement proper CORS configuration
- Check user permissions before allowing actions on resources

## State Management Patterns

- Keep authentication state global
- Keep current project/board state in context
- Use local state for UI-only concerns (modals, dropdowns)
- Implement optimistic updates for better UX (e.g., when moving issues)
- Handle loading and error states consistently

## UI/UX Guidelines

- Follow JIRA's general layout: sidebar navigation, main content area
- Use consistent color coding for issue types and priorities
- Implement keyboard shortcuts for power users (optional)
- Provide visual feedback for all user actions
- Use modals for create/edit forms to maintain context
