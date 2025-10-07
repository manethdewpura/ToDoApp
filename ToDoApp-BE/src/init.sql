-- Create the task table if it doesn't exist
CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_task_created_at ON task(created_at DESC);

-- Create index on is_completed for faster filtering
CREATE INDEX IF NOT EXISTS idx_task_is_completed ON task(is_completed);

