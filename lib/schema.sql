-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id UUID PRIMARY KEY, -- We will generate UUIDs in the app or let DB do it, but usually app generates for optimistic UI
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    tags TEXT[] NOT NULL DEFAULT '{}',
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NOT NULL DEFAULT '',
    revisions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Stores array of { number, scheduledDate, completedDate }
    confidence_history JSONB NOT NULL DEFAULT '[]'::jsonb, -- Stores array of { date, level }
    is_archived BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index for faster queries
CREATE INDEX idx_problems_added_at ON problems(added_at);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
