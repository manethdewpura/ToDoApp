# ToDoApp - Full Stack Task Management Application

A modern, full-stack todo application built with React, Express, TypeScript, and PostgreSQL, fully containerized with Docker.

## 🌟 Features

- ✨ **Modern UI** - Beautiful React frontend with Tailwind CSS
- 🎯 **Task Management** - Create, view, and complete tasks
- 🔄 **Real-time Updates** - UI updates immediately after actions
- 🐳 **Fully Dockerized** - One-command deployment
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Type-Safe** - Full TypeScript coverage
- 🚀 **Production Ready** - Optimized builds with health checks

## 🏗️ Architecture

```
Frontend (React + Vite + Nginx)
        ↓
Backend (Express + TypeScript)
        ↓
Database (PostgreSQL)
```

## 🚀 Quick Start (Docker)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
 

### Start the Application

```bash
# Clone the repository
git clone https://github.com/manethdewpura/ToDoApp.git
cd ToDoApp

# Start all services
docker-compose up -d
```

That's it! 🎉

### Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

### Stop the Application

```bash
docker-compose down
```

## 📋 Useful Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose build` | Build Docker images |
| `docker-compose logs -f <service>` | View logs |
| `docker-compose restart` | Restart services |

## 🛠️ Development Setup (Without Docker)

### Backend

```bash
cd ToDoApp-BE

# Install dependencies
npm install

# Set up PostgreSQL database
# Create database named 'todos'
# Run src/init.sql to create tables

# Create .env file
cp .env
# Edit .env with your database credentials
#server
PORT=
API_PREFIX=
NODE_ENV=
CORS_ORIGIN=

#database
DB_USER=
DB_HOST=
DB_NAME=
DB_PASS=
DB_PORT=


# Start development server
npm run dev
```

Backend runs on http://localhost:3000

### Frontend

```bash
cd ToDoApp-FE

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on http://localhost:5173

## 📁 Project Structure

```
ToDoApp/
├── ToDoApp-BE/              # Backend (Express + TypeScript + Sequelize)
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── dao/             # Database access
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Sequelize models
│   │   └── init.sql         # DB init script
│   ├── Dockerfile           # Backend Docker config
│   └── package.json
├── ToDoApp-FE/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   └── types.ts         # TypeScript types
│   ├── Dockerfile           # Frontend Docker config
│   ├── nginx.conf           # Nginx configuration
│   └── package.json
├── docker-compose.yml       # Docker Compose config
├── Makefile                 # Easy commands
└── README.md                # This file
```

## 🐳 Docker Services

### 1. Database (PostgreSQL)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Auto-initialization**: Creates tables on first run
- **Data persistence**: Named volume

### 2. Backend (Express API)
- **Build**: Multi-stage Dockerfile
- **Port**: 3000
- **Health checks**: Enabled
- **Dependencies**: Production-only in final image

### 3. Frontend (React + Nginx)
- **Build**: Multi-stage Dockerfile (build + serve)
- **Port**: 80
- **Features**: Gzip, caching, security headers
- **Routing**: Client-side routing support

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | Get recent tasks (5 max) |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/:id` | Get task by ID |
| PATCH | `/api/tasks/:id/complete` | Mark task complete |

## 📖 Documentation

This README includes the steps to build and run with Docker and to develop locally.

## 🧪 Testing

### Backend Tests
```bash
cd ToDoApp-BE
npm test
```

### Frontend Tests
```bash
cd ToDoApp-FE
npm test
```

### Integration Test (cypress)
```bash
# Ensure the stack is running (backend/db via Docker)
docker-compose up -d

# From the frontend folder, install deps (first time only)
cd ToDoApp-FE
npm ci

# Headless run
npm run cy:run

# Or open the Cypress runner
npm run cy:open

# Alternatively, start the dev server and run tests automatically
npm run e2e
```

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Custom hooks for state management

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize + sequelize-typescript

### DevOps
- Docker
- Docker Compose
- Nginx
- Multi-stage builds
- Health checks


```bash
docker-compose up -d
```

Then visit http://localhost:8080
