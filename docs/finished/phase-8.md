# Phase 8: Export/Import Functionality

**Status:** COMPLETED

## Goal
Data backup and restore capability in admin panel.

## What Was Done

### 1. Installed File System Dependencies
```bash
npm install react-native-fs react-native-share react-native-document-picker
```

### 2. Created ExportService (`src/services/ExportService.ts`)
```typescript
// Functions implemented:
- generateFilename(): string // tasknotebook_export_YYYYMMDD_HHMMSS.json
- getExportDirectory(): string
- exportTasks(): Promise<ExportData>
- exportReports(): Promise<ExportData>
- exportAll(): Promise<ExportData>
- saveToFile(data: ExportData): Promise<string>
- shareFile(filePath: string): Promise<void>
- exportAndShare(includeTasks, includeReports): Promise<{ filePath, data }>
- getExportSummary(includeTasks, includeReports): Promise<{ tasksCount, statesCount }>
```

### 3. Created ImportService (`src/services/ImportService.ts`)
```typescript
// Functions implemented:
- pickFile(): Promise<string | null>
- readFile(filePath: string): Promise<string>
- validateImportData(data: any): { valid, error?, validTasks, validStates }
- previewImport(filePath: string): Promise<ImportPreview>
- importFromFile(filePath: string): Promise<ImportResult>
- pickAndImport(): Promise<ImportResult | null>
- pickAndPreview(): Promise<{ filePath, preview } | null>

// Types exported:
- ImportResult { success, tasksImported, statesImported, error? }
- ImportPreview { valid, tasksCount, statesCount, error?, data? }
```

### 4. Updated DataManagementScreen
Full implementation replacing placeholder:

**Export Section:**
- Checkboxes to select data to export (tasks, reports)
- Shows count of items that will be exported
- "Exportovat vybrané" main button
- Quick export buttons: Úkoly, Přehledy, Vše
- Uses system share dialog after export

**Import Section:**
- "Vybrat soubor..." button opens document picker
- Preview dialog shows file contents before import
- Confirmation required before actual import
- Shows import results (counts of imported items)
- Skips duplicates automatically

**UI Features:**
- Loading overlay during operations
- Error alerts in Czech
- Info tip about cloud backup
- Disabled states during operations

## Files Created
- `src/services/ExportService.ts`
- `src/services/ImportService.ts`

## Files Updated
- `src/screens/admin/DataManagementScreen.tsx` - Full implementation

## Export Data Structure
```typescript
interface ExportData {
  version: string;          // "1.0"
  exportedAt: string;       // ISO datetime
  tasks?: Task[];           // if exporting tasks
  dailyStates?: DailyTaskState[]; // if exporting reports
}
```

## File Naming
- Format: `tasknotebook_export_YYYYMMDD_HHMMSS.json`
- Example: `tasknotebook_export_20251231_143022.json`

## Import Logic
- Parse JSON file
- Validate structure with detailed validation
- Skip duplicates by UUID (no error, no update)
- Merge with existing data
- Return counts: { tasksImported, statesImported }

## Error Messages (Czech)
- "Neplatný formát dat" - Invalid data format
- "Chybí verze souboru" - Missing file version
- "Neplatný formát úkolů" - Invalid tasks format
- "Neplatný formát záznamů" - Invalid records format
- "Soubor neobsahuje žádná platná data" - File contains no valid data
- "Neplatný JSON soubor" - Invalid JSON file
- "Chyba při čtení souboru" - Error reading file
