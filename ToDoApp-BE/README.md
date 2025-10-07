# ToDoApp Backend

A simple and robust backend API for a Todo application built with Node.js, Express, TypeScript, and Sequelize.

## Features

- **RESTful API** for task management
- **TypeScript** for type safety and better development experience
- **Sequelize ORM** with PostgreSQL database
- **Comprehensive testing** with Jest
- **Error handling** with custom error classes
- **Input validation** with DTOs
- **Logging** utilities
- **Docker** support for containerization

## API Endpoints

### Tasks
- `GET /api/tasks` - Get recent non-completed tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PATCH /api/tasks/:id/complete` - Mark task as completed

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database configuration.

4. Initialize database schema:
   - If using Docker (recommended), the `src/init.sql` is mounted and executed automatically by `docker-compose`.
   - For local DB setup, run the SQL in `src/init.sql` against your `todos` database.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

This project includes comprehensive test coverage with Jest.

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run tests for CI
npm run test:ci

# Run specific test suites
npm run test:models      # Model tests
npm run test:services    # Service tests
npm run test:controllers # Controller tests
npm run test:middleware  # Middleware tests
npm run test:utils       # Utility tests
```

### Test Structure

```
src/__tests__/
├── common/
│   └── errors/
│       └── app-error.test.ts
├── controllers/
│   └── task.controller.test.ts
├── dao/
│   └── task.dao.test.ts
├── dtos/
│   └── task.dto.test.ts
├── integration/
│   └── task.integration.test.ts
├── middleware/
│   ├── async-handler.middleware.test.ts
│   ├── error-handler.middleware.test.ts
│   └── validate-request.middleware.test.ts
├── models/
│   └── task.model.test.ts
├── services/
│   └── task.service.test.ts
├── utils/
│   ├── logger.util.test.ts
│   └── response.util.test.ts
└── setup.ts
```

### Test Coverage

The test suite covers:
- **Unit Tests**: Individual components and functions
- **Integration Tests**: Component interactions
- **Error Handling**: Custom error classes and middleware
- **Validation**: DTO validation and request validation
- **Database Operations**: DAO layer with mocked database
- **API Endpoints**: Controller layer with mocked services

## Project Structure

```
src/
├── common/
│   ├── constants/     # Application constants
│   ├── enums/         # TypeScript enums
│   └── errors/        # Custom error classes
├── config/            # Configuration files
├── controllers/       # Request handlers
├── dao/              # Data Access Objects
├── dtos/             # Data Transfer Objects
├── interfaces/       # TypeScript interfaces
├── middleware/       # Express middleware
├── models/           # Sequelize models
├── routes/           # API routes
├── services/         # Business logic
├── types/            # Type definitions
├── utils/            # Utility functions
└── server.ts         # Application entry point
```

## Development

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Jest for testing

### Database

The application uses PostgreSQL with Sequelize ORM. Database configuration is in `src/config/database.config.ts`.

### Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development, production, test)
- `PORT` - Server port (default: 3000)

## Docker

### Development

```bash
# Build and run with docker-compose
docker-compose up --build
```

### Production

```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up --build
```

## API Documentation

### Create Task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "is_completed": false,
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### Get Recent Tasks

```http
GET /api/tasks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Task title",
      "description": "Task description",
      "is_completed": false,
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Complete Task

```http
PATCH /api/tasks/1/complete
```

**Response:**
```json
{
  "success": true,
  "message": "Task completed successfully",
  "data": {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "is_completed": true,
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## Error Handling

The API uses custom error classes for consistent error responses:

- `ValidationError` (400) - Invalid input data
- `NotFoundError` (404) - Resource not found
- `DatabaseError` (500) - Database operation failed
- `AppError` (500) - Generic application error
