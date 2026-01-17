# Phase 7: Reports & Statistics

**Status:** COMPLETED

## Goal
Visual reports of task completion history with charts and day navigation.

## What Was Done

### 1. Installed Chart Library
```bash
npm install react-native-chart-kit react-native-svg
```

### 2. Created ReportsScreen (`src/screens/ReportsScreen.tsx`)
- Summary stats at top:
  - Completion rate percentage
  - Total active tasks count
  - Current streak (consecutive days with all tasks done) with fire icon
- Pie chart showing completed vs incomplete for last 7 days
- "Zobrazit detaily" button → navigates to DayDetailScreen
- Summary card with completed/incomplete/total counts

### 3. Created DayDetailScreen (`src/screens/DayDetailScreen.tsx`)
- Header with date (formatted in Czech) with capitalized day name
- Left/Right arrows to navigate days
- "Today" badge when viewing current day
- Stats summary showing incomplete/completed counts
- Three sections:
  1. Warning tasks (tasks without time) - Nezapomeň!
  2. Nesplněné úkoly (incomplete)
  3. Splněné úkoly (completed)
- Each task shows:
  - Name
  - Scheduled time
  - Completion time (if completed)
  - Description (if present)
- Empty state if no tasks for that day

### 4. Created CompletionChart (`src/components/CompletionChart.tsx`)
- Pie chart component using react-native-chart-kit
- Props: completed count, incomplete count
- Colors: green for complete, red for incomplete
- Legend with counts
- Empty state when no data

### 5. Data Aggregation Functions
Added to TaskContext:
```typescript
- getCompletionStats(startDate, endDate): CompletionStats
- getDailyStats(date): DailyStats
- getStreak(): number // consecutive days with 100% completion
```

### 6. Report Filtering Logic
- Uses existing task filtering logic from getDailyTasks()
- Only counts completable tasks (with notification time)
- Streak skips days with no tasks (doesn't break streak)

### 7. Navigation
- Added Reports and DayDetail screens to child navigation stack
- Added "Přehledy" button to MainScreen (bottom-left)
- Navigation between days works with left/right arrows
- Can't navigate to future days

## Files Created
- `src/screens/ReportsScreen.tsx`
- `src/screens/DayDetailScreen.tsx`
- `src/components/CompletionChart.tsx`

## Files Updated
- `App.tsx` - added Reports and DayDetail to navigation
- `src/screens/child/MainScreen.tsx` - added Reports button
- `src/types/index.ts` - added CompletionStats and DailyStats interfaces
- `src/context/TaskContext.tsx` - added data aggregation functions

## UI Layout

**ReportsScreen:**
```
┌─────────────────────────┐
│ Přehled úkolů           │
├─────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │ 85% │ │ 120 │ │ 5d  │ │
│ │Rate │ │Total│ │Strk │ │
│ └─────┘ └─────┘ └─────┘ │
├─────────────────────────┤
│                         │
│     [PIE CHART]         │
│   Complete vs Incompl   │
│                         │
├─────────────────────────┤
│ [Zobrazit detaily →]    │
└─────────────────────────┘
```

**DayDetailScreen:**
```
┌─────────────────────────┐
│ ← Pondělí, 15. ledna →  │
├─────────────────────────┤
│ Nesplněné (2)           │
│ ┌─────────────────────┐ │
│ │ Úkol 1      14:00   │ │
│ │ Úkol 2      18:00   │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ Splněné (3)             │
│ ┌─────────────────────┐ │
│ │ ✓ Úkol 3    08:00   │ │
│ │ ✓ Úkol 4    12:00   │ │
│ │ ✓ Úkol 5    16:00   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## Files To Create
- `src/screens/ReportsScreen.tsx`
- `src/screens/DayDetailScreen.tsx`
- `src/components/CompletionChart.tsx`

## Files To Update
- `App.tsx` - add Reports and DayDetail to navigation
- `src/screens/child/MainScreen.tsx` - add Reports menu item
- `src/types/index.ts` - add Reports route params

## Route Params
```typescript
Reports: undefined
DayDetail: { date: string } // YYYY-MM-DD
```
