/**
 * Import Service - handles file import operations
 * Picks file via document picker and imports data
 */

import RNFS from 'react-native-fs';
import { pick, types } from '@react-native-documents/picker';
import { ExportData, Task, DailyTaskState } from '../types';
import { DataExportImport } from './StorageService';

/**
 * Import result with counts
 */
export interface ImportResult {
  success: boolean;
  tasksImported: number;
  statesImported: number;
  error?: string;
}

/**
 * Import preview before actual import
 */
export interface ImportPreview {
  valid: boolean;
  tasksCount: number;
  statesCount: number;
  error?: string;
  data?: ExportData;
}

/**
 * Pick a JSON file using document picker
 * Returns the file URI or null if cancelled
 */
export async function pickFile(): Promise<string | null> {
  try {
    const result = await pick({
      type: [types.json, types.allFiles],
      copyTo: 'cachesDirectory',
    });

    if (result && result.length > 0) {
      // Use the copied file path for reading
      return result[0].fileCopyUri || result[0].uri;
    }

    return null;
  } catch (error: any) {
    // User cancelled - this is not an error
    if (error.code === 'DOCUMENT_PICKER_CANCELED') {
      return null;
    }
    throw error;
  }
}

/**
 * Read file content as string
 */
export async function readFile(filePath: string): Promise<string> {
  // Handle file:// prefix
  const cleanPath = filePath.replace('file://', '');
  return RNFS.readFile(cleanPath, 'utf8');
}

/**
 * Validate a single task object
 */
function isValidTask(task: any): task is Task {
  return (
    typeof task === 'object' &&
    task !== null &&
    typeof task.id === 'string' &&
    typeof task.name === 'string' &&
    Array.isArray(task.daysOfWeek) &&
    typeof task.createdAt === 'string' &&
    typeof task.isActive === 'boolean'
  );
}

/**
 * Validate a single daily state object
 */
function isValidDailyState(state: any): state is DailyTaskState {
  return (
    typeof state === 'object' &&
    state !== null &&
    typeof state.id === 'string' &&
    typeof state.taskId === 'string' &&
    typeof state.date === 'string' &&
    typeof state.completed === 'boolean' &&
    typeof state.postponeCount === 'number' &&
    typeof state.currentTime === 'string'
  );
}

/**
 * Validate import data structure
 */
export function validateImportData(data: any): {
  valid: boolean;
  error?: string;
  validTasks: Task[];
  validStates: DailyTaskState[];
} {
  if (typeof data !== 'object' || data === null) {
    return { valid: false, error: 'Neplatný formát dat', validTasks: [], validStates: [] };
  }

  if (typeof data.version !== 'string') {
    return { valid: false, error: 'Chybí verze souboru', validTasks: [], validStates: [] };
  }

  const validTasks: Task[] = [];
  const validStates: DailyTaskState[] = [];

  // Validate tasks if present
  if (data.tasks !== undefined) {
    if (!Array.isArray(data.tasks)) {
      return { valid: false, error: 'Neplatný formát úkolů', validTasks: [], validStates: [] };
    }
    for (const task of data.tasks) {
      if (isValidTask(task)) {
        validTasks.push(task);
      }
    }
  }

  // Validate daily states if present
  if (data.dailyStates !== undefined) {
    if (!Array.isArray(data.dailyStates)) {
      return { valid: false, error: 'Neplatný formát záznamů', validTasks: [], validStates: [] };
    }
    for (const state of data.dailyStates) {
      if (isValidDailyState(state)) {
        validStates.push(state);
      }
    }
  }

  // Check if there's any data to import
  if (validTasks.length === 0 && validStates.length === 0) {
    return { valid: false, error: 'Soubor neobsahuje žádná platná data', validTasks: [], validStates: [] };
  }

  return { valid: true, validTasks, validStates };
}

/**
 * Preview import data without actually importing
 */
export async function previewImport(filePath: string): Promise<ImportPreview> {
  try {
    const content = await readFile(filePath);

    let data: any;
    try {
      data = JSON.parse(content);
    } catch {
      return { valid: false, tasksCount: 0, statesCount: 0, error: 'Neplatný JSON soubor' };
    }

    const validation = validateImportData(data);
    if (!validation.valid) {
      return { valid: false, tasksCount: 0, statesCount: 0, error: validation.error };
    }

    return {
      valid: true,
      tasksCount: validation.validTasks.length,
      statesCount: validation.validStates.length,
      data: {
        version: data.version,
        exportedAt: data.exportedAt,
        tasks: validation.validTasks,
        dailyStates: validation.validStates,
      },
    };
  } catch (error: any) {
    return {
      valid: false,
      tasksCount: 0,
      statesCount: 0,
      error: error.message || 'Chyba při čtení souboru',
    };
  }
}

/**
 * Import data from file
 */
export async function importFromFile(filePath: string): Promise<ImportResult> {
  try {
    const preview = await previewImport(filePath);

    if (!preview.valid || !preview.data) {
      return {
        success: false,
        tasksImported: 0,
        statesImported: 0,
        error: preview.error,
      };
    }

    const result = await DataExportImport.importData(preview.data);

    return {
      success: true,
      tasksImported: result.tasksImported,
      statesImported: result.statesImported,
    };
  } catch (error: any) {
    return {
      success: false,
      tasksImported: 0,
      statesImported: 0,
      error: error.message || 'Chyba při importu',
    };
  }
}

/**
 * Pick and import file in one step
 * Returns null if cancelled
 */
export async function pickAndImport(): Promise<ImportResult | null> {
  const filePath = await pickFile();

  if (!filePath) {
    return null; // User cancelled
  }

  return importFromFile(filePath);
}

/**
 * Pick file and get preview (for showing confirmation dialog)
 */
export async function pickAndPreview(): Promise<{
  filePath: string;
  preview: ImportPreview;
} | null> {
  const filePath = await pickFile();

  if (!filePath) {
    return null; // User cancelled
  }

  const preview = await previewImport(filePath);

  return { filePath, preview };
}
