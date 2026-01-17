# Phase 3: Admin Panel - Task Management

**Status:** COMPLETED

## Goal
Full CRUD operations for tasks in admin view with filtering capabilities.

## What Was Done

### 1. TaskContext Implementation
- Global task state management
- CRUD operations: `addTask()`, `updateTask()`, `deleteTask()`
- Daily state operations: `completeTask()`, `postponeTask()`
- Helper: `getDailyTasks(date)` - returns tasks for specific day with states
- Auto-loads tasks from storage on mount

### 2. Components Created

**DaySelector** (`src/components/DaySelector.tsx`)
- 7 circular buttons for Po-Ne (Mon-Sun)
- Multi-select with visual feedback
- "Vybrat všechny dny" option
- Minimum 1 day required

**TimePicker** (`src/components/TimePicker.tsx`)
- Main time display with +/- buttons (5-min increments)
- Quick select buttons: 07:00, 12:00, 17:00, 20:00
- Full modal picker with all 5-minute intervals
- 288 time options (24h × 12 intervals)

**TaskForm** (`src/components/TaskForm.tsx`)
- Reusable for add and edit
- Fields: name (required), description (optional)
- Day selector integration
- Time toggle (with/without notification)
- Time picker (when enabled)
- Validation with Czech error messages

### 3. Admin Screens Created

**AdminDashboard** (`src/screens/admin/AdminDashboard.tsx`)
- Stats cards: Total tasks, With time, Warnings (bez času)
- Tasks per day visualization (7 day badges)
- Quick action buttons: All tasks, Add task, Data management
- Logout button
- FAB for quick task creation

**TaskListScreen** (`src/screens/admin/TaskListScreen.tsx`)
- Horizontal filter chips: Všechny, Pondělí-Neděle
- Task cards with: name, time/warning chip, description, day badges
- 3-dot menu per task: Edit, Delete
- Delete confirmation dialog
- FAB for adding tasks
- Empty state when no tasks

**TaskFormScreen** (`src/screens/admin/TaskFormScreen.tsx`)
- Dynamic title: "Nový úkol" or "Upravit úkol"
- Pre-populates form when editing
- Handles save with loading state
- Error alert on failure

**DataManagementScreen** (`src/screens/admin/DataManagementScreen.tsx`)
- Placeholder for Phase 8
- Preview of export/import buttons (disabled)

### Files Created

| File | Purpose |
|------|---------|
| `src/context/TaskContext.tsx` | Task state management |
| `src/components/DaySelector.tsx` | Day selection component |
| `src/components/TimePicker.tsx` | Time selection with 5-min intervals |
| `src/components/TaskForm.tsx` | Reusable task form |
| `src/screens/admin/AdminDashboard.tsx` | Main admin view |
| `src/screens/admin/TaskListScreen.tsx` | Task list with filtering |
| `src/screens/admin/TaskFormScreen.tsx` | Add/edit task screen |
| `src/screens/admin/DataManagementScreen.tsx` | Placeholder for Phase 8 |

### Files Updated

| File | Changes |
|------|---------|
| `App.tsx` | Added TaskProvider, admin navigation stack with 4 screens |

## Navigation Structure (Admin)
```
Admin (Dashboard)
├── AdminTaskList
├── AdminTaskForm (with optional taskId param)
└── AdminDataManagement
```

## Task Features
- Tasks without time = "Upozornění" (warning alerts, no completion checkbox)
- Tasks with time = completable with notification
- Multiple days per task supported
- Duplicate names allowed (different times/days)
- CreatedAt tracked for report filtering
