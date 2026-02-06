# Testing Plan - Spaced Revision App Improvements

## Quick Start
```bash
npm run dev
# Navigate to http://localhost:3000
```

## Test Scenarios

### 1. Sync Without Reload ✅
**Steps**:
1. Open the app
2. Click the sync button (refresh icon in top-right)
3. Observe the spinning animation
4. Wait for completion

**Expected**:
- ✅ Page does NOT reload
- ✅ Toast notification appears at top-center
- ✅ Toast shows "Sync completed successfully!" in emerald green
- ✅ Toast auto-dismisses after 3 seconds
- ✅ Data refreshes without page flash

**Edge Case**:
- Click sync while offline → Should show error toast in red

---

### 2. Day-Wise Scheduling ✅
**Steps**:
1. Add a new problem at any time (e.g., 11:30 PM)
2. Check the problem's first revision date
3. Mark a revision as complete
4. Check the completion date

**Expected**:
- ✅ New problem's first revision is scheduled for next day at 00:00:00
- ✅ Completion date is recorded as current day at 00:00:00
- ✅ No hour-based timestamps visible in UI
- ✅ All dates show as "MMM d, yyyy" format

**Verification**:
```javascript
// In browser console
localStorage.getItem('problems')
// Check that dates end with T00:00:00.000Z
```

---

### 3. Excel-Style Library ✅
**Steps**:
1. Navigate to "Library" tab
2. Click on different column headers
3. Use the search bar
4. Hover over rows
5. Try inline actions

**Expected**:
- ✅ Full-width table with all columns visible
- ✅ Columns: Status | Title | Difficulty | Added | Last Practiced | Next Due | Actions
- ✅ Clicking headers sorts ascending/descending
- ✅ Search filters problems by title
- ✅ Row hover shows subtle highlight
- ✅ Actions (link, delete) appear on hover
- ✅ Difficulty badges are color-coded
- ✅ Status icons show completion state

---

### 4. Progress View - Next Due Column ✅
**Steps**:
1. Navigate to "Progress" tab
2. Scroll to "All Problems" table
3. Check the columns

**Expected**:
- ✅ "Next Due" column is visible
- ✅ Shows next scheduled revision date
- ✅ Shows "-" if no upcoming revisions
- ✅ Dates formatted consistently (MMM d, yyyy)

---

### 5. Daily Focus - Day-Wise Completion ✅
**Steps**:
1. Navigate to "Daily Focus" tab
2. Click "Start Review" on a due problem
3. Click "Mark Done"

**Expected**:
- ✅ Problem opens in new tab
- ✅ "Mark Done" button appears
- ✅ Completion recorded at 00:00:00 of current day
- ✅ Problem disappears from due list
- ✅ Next revision becomes available

---

### 6. Heatmap Accuracy ✅
**Steps**:
1. Complete revisions on different days
2. Navigate to "Progress" tab
3. Check the activity heatmap

**Expected**:
- ✅ Each day shows correct activity count
- ✅ Hover shows "X submissions on YYYY-MM-DD"
- ✅ Colors indicate activity level
- ✅ No duplicate entries for same day

---

### 7. Mobile Responsiveness 📱
**Steps**:
1. Open browser DevTools
2. Switch to mobile view (375px width)
3. Test all views

**Expected**:
- ✅ Library table scrolls horizontally
- ✅ Toast notification is readable
- ✅ Buttons are touch-friendly
- ✅ Text is legible
- ✅ No layout breaks

---

## Edge Cases to Test

### Rapid Sync Clicks
**Steps**: Click sync button multiple times rapidly

**Expected**:
- Button disables during sync
- Only one sync operation runs
- Toast doesn't stack (latest replaces previous)

### Offline Sync
**Steps**: Disconnect internet, click sync

**Expected**:
- Error toast appears
- No data corruption
- Graceful error handling

### Empty States
**Steps**: Test with no problems

**Expected**:
- Library shows "No problems added yet"
- Daily Focus shows "All Caught Up"
- Progress shows empty heatmap
- No errors in console

### Sorting Edge Cases
**Steps**: Sort by each column with mixed data

**Expected**:
- Null values handled correctly
- Dates sort chronologically
- Difficulty sorts Easy → Medium → Hard
- Stable sort (maintains order for equal values)

---

## Performance Checks

### Load Time
- Initial page load < 2 seconds
- Sync operation < 3 seconds
- State updates feel instant

### Memory
- No memory leaks after multiple syncs
- Browser console shows no warnings
- Smooth animations

---

## Browser Compatibility

Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)

---

## Known Issues / Limitations

1. **Build Warning**: Next.js build may show font optimization warnings (non-critical)
2. **Toast Stacking**: Multiple rapid toasts will replace each other (by design)
3. **Offline Sync**: Requires manual retry (no queue system yet)

---

## Success Criteria

All tests pass with:
- ✅ No console errors
- ✅ Smooth UX (no jarring reloads)
- ✅ Consistent date handling
- ✅ Clear user feedback
- ✅ Data integrity maintained

---

## Quick Verification Commands

```bash
# TypeScript check
npx tsc --noEmit

# Run dev server
npm run dev

# Build (may have font warnings, but should compile)
npm run build

# Check for lint errors
npm run lint
```

---

**Last Updated**: 2026-02-06
**Status**: Ready for Testing ✅
