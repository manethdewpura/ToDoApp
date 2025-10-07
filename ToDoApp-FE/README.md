# ToDoApp Frontend

A beautiful and modern To-Do application built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ **Add Tasks**: Create new tasks with title and description
- 📋 **Task List**: View the 5 most recent incomplete tasks
- ✅ **Complete Tasks**: Mark tasks as done with a single click
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📱 **Responsive**: Works on all device sizes
- 🚀 **Real-time Updates**: UI updates immediately after actions

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Fast development and build tool

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend is running on port 3000

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`
In Docker, the frontend is served at `http://localhost:8080`.

## Build

Create a production build:

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api`.
You can override the base URL via the `VITE_API_URL` environment variable used in `src/services/api.ts`.

### Endpoints Used

- `GET /api/tasks` - Fetch 5 most recent incomplete tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id/complete` - Mark a task as complete

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── index.css        # Global styles and Tailwind imports
└── types.ts         # TypeScript type definitions
```

## Usage

### Adding a Task

1. Enter a task title (required)
2. Optionally add a description
3. Click "Add Task" button
4. The task will appear in the list below

### Completing a Task

1. Find the task in the list
2. Click the "Done" button
3. The task will be removed from the list (marked as complete)

## UI Features

- **Gradient Background**: Smooth blue to purple gradient
- **Card Design**: Modern card-based layout
- **Animations**: Smooth fade-in animations for new elements
- **Loading States**: Visual feedback during API calls
- **Success/Error Messages**: Clear user feedback
- **Empty State**: Helpful message when no tasks exist

## Troubleshooting

### Backend Connection Issues

If you see "Failed to fetch tasks" error:

1. Make sure the backend is running on port 3000
2. Check that CORS is enabled in the backend
3. Verify the API base URL via `VITE_API_URL` or the default in `src/services/api.ts`

### CORS Errors

If you encounter CORS errors, ensure the backend allows requests from the frontend origin (default: `http://localhost:5173`).
