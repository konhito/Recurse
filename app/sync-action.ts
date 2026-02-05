'use server';

import { syncLeetCodeSubmissions } from '@/lib/leetcode-sync';

export async function syncLeetCodeAction() {
    await syncLeetCodeSubmissions();
}
