# Phase 4: Child View - Daily To-Do List

**Status:** COMPLETED

## Goal
Main view for completing daily tasks - the primary interface children will use.

## What Was Done

### 1. Created MainScreen (`src/screens/child/MainScreen.tsx`)
- Shows current day's date (formatted in Czech with `formatDateWithDay`)
- Displays task counters at top (incomplete / completed)
- Warning alerts section for tasks without time
- Task list for completable tasks (incomplete only, completed are hidden)
- Login/Register button in bottom-right corner
- All completed celebration message when all tasks done
- Empty state when no tasks for today
- Loading state while tasks are being fetched

### 2. Created WarningAlertsSection (`src/components/WarningAlertsSection.tsx`)
- Yellow/orange warning box with left border accent
- Header with alert icon and title "Nezapomeň!"
- Bullet list of task names (tasks without notificationTime)
- Shows task descriptions if present
- Only renders if there are warning tasks for today
- No checkboxes - these are reminders only

### 3. Created TaskCard (`src/components/TaskCard.tsx`)
- Card layout with:
  - Checkbox on left side (tappable area)
  - Task name (main text, bold)
  - Description below name (smaller, max 2 lines)
  - Time chip in top-right corner (primary color)
  - Postpone count indicator when task has been postponed
- Clicking checkbox → confirmation dialog with Portal
- Clicking card → navigate to TaskDetail
- Uses confirmation dialog: "Opravdu jsi úkol splnil/a?"

### 4. Created TaskCounters (`src/components/TaskCounters.tsx`)
- Two side-by-side boxes with shadow/elevation
- Left: Incomplete count (red/error container background)
- Right: Completed count (green/success container background)
- Large count numbers with labels below
- Updates dynamically as tasks are completed

### 5. Implemented Completion Flow
- Confirmation dialog in TaskCard using React Native Paper Portal
- Dialog text: "Opravdu jsi úkol splnil/a?"
- Yes → calls `completeTask()` from TaskContext, task hidden from list
- No → closes dialog, no action
- Completed tasks immediately hidden from task list

### 6. Updated App.tsx
- Replaced placeholder MainScreen with new implementation from `src/screens/child/MainScreen`
- Added TaskDetail screen navigation (placeholder for Phase 5)
- Removed unused styles from old placeholder
- Cleaned up imports

## Files Created
- `src/screens/child/MainScreen.tsx`
- `src/components/WarningAlertsSection.tsx`
- `src/components/TaskCard.tsx`
- `src/components/TaskCounters.tsx`

## Files Updated
- `App.tsx` - replaced placeholder, added TaskDetail navigation, cleaned up

## Key Behaviors Implemented
- Tasks appear only if `createdAt <= today`
- Tasks appear only if today's day-of-week is in `daysOfWeek`
- Completed tasks are HIDDEN (per user requirement)
- Tasks sorted: by time ascending, then by name (via getDailyTasks)
- Warning tasks (no time) shown only in warning box, not in main task list
- All tasks completed shows celebration UI with checkmark icon
