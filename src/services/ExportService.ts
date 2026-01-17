/**
 * Export Service - handles file export operations
 * Saves data to file and shares via system share dialog
 */

import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Platform } from 'react-native';
import { ExportData } from '../types';
import { DataExportImport } from './StorageService';

/**
 * Generate export filename with timestamp
 * Format: tasknotebook_export_YYYYMMDD_HHMMSS.json
 */
function generateFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `tasknotebook_export_${year}${month}${day}_${hours}${minutes}${seconds}.json`;
}

/**
 * Get the directory for saving export files
 */
function getExportDirectory(): string {
  return Platform.OS === 'android'
    ? RNFS.DownloadDirectoryPath
    : RNFS.DocumentDirectoryPath;
}

/**
 * Export tasks only
 */
export async function exportTasks(): Promise<ExportData> {
  return DataExportImport.exportData(true, false);
}

/**
 * Export reports/daily states only
 */
export async function exportReports(): Promise<ExportData> {
  return DataExportImport.exportData(false, true);
}

/**
 * Export all data (tasks + reports)
 */
export async function exportAll(): Promise<ExportData> {
  return DataExportImport.exportData(true, true);
}

/**
 * Save export data to a file
 * Returns the file path
 */
export async function saveToFile(data: ExportData): Promise<string> {
  const filename = generateFilename();
  const directory = getExportDirectory();
  const filePath = `${directory}/${filename}`;

  const jsonContent = JSON.stringify(data, null, 2);
  await RNFS.writeFile(filePath, jsonContent, 'utf8');

  return filePath;
}

/**
 * Share a file using system share dialog
 */
export async function shareFile(filePath: string): Promise<void> {
  const filename = filePath.split('/').pop() || 'export.json';

  await Share.open({
    url: `file://${filePath}`,
    type: 'application/json',
    filename: filename,
    title: 'Exportovat data',
    subject: 'Zápisník úkolů - Export dat',
  });
}

/**
 * Export and share in one step
 * Combines export, save, and share operations
 */
export async function exportAndShare(
  includeTasks: boolean,
  includeReports: boolean
): Promise<{ filePath: string; data: ExportData }> {
  // Get export data
  const data = await DataExportImport.exportData(includeTasks, includeReports);

  // Save to file
  const filePath = await saveToFile(data);

  // Share the file
  await shareFile(filePath);

  return { filePath, data };
}

/**
 * Get summary of what will be exported
 */
export async function getExportSummary(
  includeTasks: boolean,
  includeReports: boolean
): Promise<{ tasksCount: number; statesCount: number }> {
  const data = await DataExportImport.exportData(includeTasks, includeReports);
  return {
    tasksCount: data.tasks?.length || 0,
    statesCount: data.dailyStates?.length || 0,
  };
}
