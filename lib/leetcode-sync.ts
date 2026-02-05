import { Problem } from '@/lib/types';
import { createProblemAction, findProblemByUrl, updateProblemScheduleAction } from '@/app/actions';
import cron from 'node-cron';

const LEETCODE_USERNAME = 'konhito';

async function fetchRecentSubmissions(username: string) {
    const query = `
    query getRecentSubmissions($username: String!, $limit: Int) {
      recentSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
        url
      }
    }
  `;

    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
            },
            body: JSON.stringify({
                query,
                variables: {
                    username,
                    limit: 15, // Get last 15 to be safe
                },
            }),
        });

        const data = await response.json();
        return data.data?.recentSubmissionList || [];
    } catch (error) {
        console.error("Error fetching LeetCode submissions:", error);
        return [];
    }
}

export async function syncLeetCodeSubmissions() {
    console.log("Syncing LeetCode submissions...");
    // Dynamic import to avoid build-time issues if scheduler uses something server-side (it doesn't, but safe practice)
    const { generateRevisions } = await import('@/lib/scheduler');

    const submissions = await fetchRecentSubmissions(LEETCODE_USERNAME);

    const now = Date.now();
    const twentyFourHoursAgo = now / 1000 - 24 * 60 * 60; // Timestamp in seconds

    // Filter: Accepted only, within last 24h
    const newAc = submissions.filter((sub: any) =>
        sub.statusDisplay === 'Accepted' &&
        parseInt(sub.timestamp) > twentyFourHoursAgo
    );

    console.log(`Found ${newAc.length} new accepted submissions.`);

    for (const sub of newAc) {
        const url = `https://leetcode.com/problems/${sub.titleSlug}/`;
        const solvedAt = new Date(parseInt(sub.timestamp) * 1000);

        try {
            // Check if already exists
            const existing = await findProblemByUrl(url);

            if (existing) {
                console.log(`Processing existing problem: ${sub.title}`);
                // 1. Check if there's an active (incomplete) revision
                const incompleteRevisionIndex = existing.revisions.findIndex(rev => !rev.completedDate);

                if (incompleteRevisionIndex !== -1) {
                    // 2. If yes, mark it as complete
                    console.log(`Marking revision #${incompleteRevisionIndex + 1} as complete for ${sub.title}`);
                    const updatedRevisions = [...existing.revisions];
                    updatedRevisions[incompleteRevisionIndex] = {
                        ...updatedRevisions[incompleteRevisionIndex],
                        completedDate: solvedAt.toISOString(),
                    };
                    // Keep original addedAt, update revisions
                    await updateProblemScheduleAction(existing.id, new Date(existing.addedAt), updatedRevisions);
                } else {
                    // 3. If no incomplete revisions exist (all done), reset the schedule
                    console.log(`All revisions complete for ${sub.title}. Resetting schedule.`);
                    const newRevisions = generateRevisions(solvedAt);
                    await updateProblemScheduleAction(existing.id, solvedAt, newRevisions);
                }
            } else {
                console.log(`Importing new problem: ${sub.title}`);
                const problem: Problem = {
                    id: crypto.randomUUID(),
                    title: sub.title,
                    url: url,
                    difficulty: 'Medium',
                    tags: ['LeetCode', 'Auto-Import'],
                    addedAt: solvedAt.toISOString(),
                    notes: `Auto-imported from LeetCode. Language: ${sub.lang}`,
                    revisions: generateRevisions(solvedAt),
                    confidenceHistory: [],
                    isArchived: false
                };
                await createProblemAction(problem);
            }

        } catch (e) {
            console.error(`Error processing ${sub.title}:`, e);
        }
    }
}

// CRON JOB SETUP
// Run every day at specific time? User asked "in every day at same time".
// We can run this as a standalone script or init it in instrumentation.ts (Next.js feature).
// Next.js instrument function is the best place for cron-like tasks or using a separate worker.
// Since users usually deploy to Vercel/Serverless, persistent node-cron might not work well.
// But for "running locally" or a VPS, it works.
// I will export a function to start the cron.

export function startCronJob() {
    // Run every day at midnight (0 0 * * *) or simply every 24h.
    // User said "every day at same time".
    cron.schedule('0 0 * * *', () => {
        syncLeetCodeSubmissions();
    });
    console.log("LeetCode Sync Cron Job scheduled for 00:00 every day.");
}
