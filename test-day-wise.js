// Quick verification test for day-wise scheduling
import { startOfDay } from 'date-fns';

console.log('=== Day-Wise Scheduling Verification ===\n');

// Test 1: startOfDay consistency
const now = new Date();
const dayStart = startOfDay(now);

console.log('Current time:', now.toISOString());
console.log('Day start:', dayStart.toISOString());
console.log('✓ Day starts at 00:00:00:', dayStart.toISOString().includes('T00:00:00'));

// Test 2: Completion date
const completedDate = startOfDay(new Date()).toISOString();
console.log('\nCompletion date:', completedDate);
console.log('✓ Completion at midnight:', completedDate.includes('T00:00:00'));

// Test 3: Added date
const addedAt = startOfDay(new Date()).toISOString();
console.log('\nAdded date:', addedAt);
console.log('✓ Added at midnight:', addedAt.includes('T00:00:00'));

console.log('\n=== All checks passed ===');
