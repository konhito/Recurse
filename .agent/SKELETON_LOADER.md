# Better Skeleton Loader

## What Changed
Replaced the basic "Syncing..." text with a proper skeleton loader.

## Files Modified
1. **components/DailyFocus.tsx** - Added skeleton cards with shimmer effect
2. **app/globals.css** - Added shimmer animation keyframes

## Why This Matters
- **Platform agnostic** - Works for LeetCode, TakeUForward, GeeksforGeeks, NeetCode, etc.
- **Better UX** - Shows the structure while loading instead of just text
- **Smooth** - Shimmer animation gives visual feedback

## What It Looks Like
Instead of:
```
Syncing...
```

Now shows:
```
Today's Focus                    Loading...

┌─────────────────────────────────────┐
│ [difficulty badge]                  │
│ [problem title ████████]            │
│                           [Rev #█]  │
│ [#tag] [#tag]        [Start █████]  │
└─────────────────────────────────────┘
  ↑ with shimmer animation
```

3 skeleton cards appear while loading, matching the actual problem card layout.

## Technical Details
- Uses Tailwind's `animate-pulse` for subtle pulsing
- Custom shimmer animation sweeps left-to-right
- Matches actual card structure (difficulty, title, revision, tags, button)
- Responsive (works on mobile)

## No Bloat
- ~40 lines of JSX
- 1 CSS animation
- No new dependencies
- Works for all platforms (not just LeetCode)
