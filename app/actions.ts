'use server';

import pool from '@/lib/db';
import { Problem, Difficulty } from '@/lib/types';

// Mapper to convert DB row to Problem object
const startCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1 $2');

function mapRowToProblem(row: any): Problem {
    return {
        id: row.id,
        title: row.title,
        url: row.url,
        difficulty: row.difficulty as Difficulty,
        tags: row.tags || [],
        addedAt: row.added_at.toISOString(),
        notes: row.notes,
        revisions: row.revisions || [],
        confidenceHistory: row.confidence_history || [],
        isArchived: row.is_archived
    };
}

export async function fetchProblems(): Promise<Problem[]> {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM problems ORDER BY added_at DESC');
        return result.rows.map(mapRowToProblem);
    } finally {
        client.release();
    }
}

export async function createProblemAction(problem: Problem): Promise<void> {
    const client = await pool.connect();
    try {
        // Check for duplicate URL to prevent double import
        const existing = await client.query('SELECT 1 FROM problems WHERE url = $1', [problem.url]);
        if (existing.rowCount && existing.rowCount > 0) {
            console.log(`Problem with URL ${problem.url} already exists. Skipping.`);
            return;
        }

        await client.query(
            `INSERT INTO problems (
        id, title, url, difficulty, tags, added_at, notes, revisions, confidence_history, is_archived
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                problem.id,
                problem.title,
                problem.url,
                problem.difficulty,
                problem.tags,
                new Date(problem.addedAt),
                problem.notes,
                JSON.stringify(problem.revisions),
                JSON.stringify(problem.confidenceHistory),
                problem.isArchived
            ]
        );
    } finally {
        client.release();
    }
}

export async function deleteProblemAction(id: string): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM problems WHERE id = $1', [id]);
    } finally {
        client.release();
    }
}

// We can support partial updates, but for now passing the full object is safer/easier with this setup.
// Or we can just handle specific fields. The logic in storage.ts was partial.
// Let's implement specific updates or a full update. Full update is easiest.
export async function updateProblemAction(problem: Problem): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(
            `UPDATE problems SET 
        title = $2,
        url = $3,
        difficulty = $4,
        tags = $5,
        notes = $6,
        revisions = $7,
        confidence_history = $8,
        is_archived = $9
       WHERE id = $1`,
            [
                problem.id,
                problem.title,
                problem.url,
                problem.difficulty,
                problem.tags,
                problem.notes,
                JSON.stringify(problem.revisions),
                JSON.stringify(problem.confidenceHistory),
                problem.isArchived
            ]
        );
    } finally {
        client.release();
    }
}
export async function findProblemByUrl(url: string): Promise<Problem | null> {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM problems WHERE url = $1', [url]);
        if (result.rows.length === 0) return null;
        return mapRowToProblem(result.rows[0]);
    } finally {
        client.release();
    }
}

export async function updateProblemScheduleAction(id: string, addedAt: Date, revisions: any[]): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(
            `UPDATE problems SET 
             added_at = $2,
             revisions = $3
             WHERE id = $1`,
            [id, addedAt, JSON.stringify(revisions)]
        );
    } finally {
        client.release();
    }
}
