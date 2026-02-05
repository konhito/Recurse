import { addDays, nextSunday, lastDayOfMonth, addMonths, isBefore, isSameDay, parseISO, startOfDay } from "date-fns";
import { Problem, Revision } from "./types";

/**
 * Calculates the Schedule for a new problem.
 * Rev 1: Next Day
 * Rev 2: Next Sunday (Weekly consolidation)
 * Rev 3: Last day of the NEXT month (Monthly retention)
 */
export function generateRevisions(startDate: Date): Revision[] {
    const start = startOfDay(startDate);

    // 1. Retention: Next Day
    const rev1 = addDays(start, 1);

    // 2. Weekly: Next Surrounding Sunday (Consolidation)
    // If today is Friday, next Sunday is in 2 days.
    const rev2 = nextSunday(start);

    // 3. Weekly: Following Sunday (Reinforcement)
    const rev3 = addDays(rev2, 7);

    // 4. Monthly: End of current month (if in future substantially) or next month
    let rev4 = lastDayOfMonth(start);
    if (isBefore(rev4, rev3) || isSameDay(rev4, rev3)) {
        rev4 = lastDayOfMonth(addMonths(start, 1));
    }

    // 5. Monthly: Next Month End
    const rev5 = lastDayOfMonth(addMonths(rev4, 1));

    // Sort and filtering is good practice but let's strictly follow the sequence logic
    // We want unique dates in ascending order.
    const rawDates = [rev1, rev2, rev3, rev4, rev5];
    const uniqueDates = Array.from(new Set(rawDates.map(d => d.toISOString()))).sort();

    return uniqueDates.map((dateStr, index) => ({
        number: index + 1,
        scheduledDate: dateStr
    }));
}

/**
 * Determines the status of a specific revision.
 */
export function getRevisionStatus(revision: Revision): 'locked' | 'due' | 'completed' | 'overdue' {
    if (revision.completedDate) return 'completed';

    const scheduled = startOfDay(parseISO(revision.scheduledDate));
    const today = startOfDay(new Date());

    if (isSameDay(today, scheduled) || isBefore(scheduled, today)) {
        // It's due or overdue
        // If it was scheduled for yesterday and not done, strictly it's "overdue", 
        // but for UI simplicity we might just call it "due" or handle "overdue" styling.
        // Let's distinguish overdue for UI urgency.
        if (isBefore(scheduled, today)) return 'overdue';
        return 'due';
    }

    return 'locked';
}

/**
 * Get the next immediate active revision for a problem.
 */
export function getNextRevision(problem: Problem): Revision | null {
    // Find the first revision that is NOT completed
    const next = problem.revisions.find(r => !r.completedDate);
    return next || null;
}
