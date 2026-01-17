/**
 * Data Management Screen (Admin)
 * Export and import data functionality
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Button,
  Checkbox,
  Portal,
  Dialog,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CzechText } from '../../theme';
import {
  exportAndShare,
  getExportSummary,
} from '../../services/ExportService';
import {
  pickAndPreview,
  importFromFile,
  ImportPreview,
} from '../../services/ImportService';
import { DataExportImport } from '../../services/StorageService';
import { useTasks } from '../../context/TaskContext';

export default function DataManagementScreen() {
  const theme = useTheme();
  const { refreshTasks } = useTasks();

  // Export state
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeReports, setIncludeReports] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSummary, setExportSummary] = useState<{
    tasksCount: number;
    statesCount: number;
  } | null>(null);

  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    filePath: string;
    preview: ImportPreview;
  } | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Clear data state
  const [isClearing, setIsClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Load export summary when checkboxes change
  const loadExportSummary = useCallback(async () => {
    if (!includeTasks && !includeReports) {
      setExportSummary(null);
      return;
    }
    try {
      const summary = await getExportSummary(includeTasks, includeReports);
      setExportSummary(summary);
    } catch {
      setExportSummary(null);
    }
  }, [includeTasks, includeReports]);

  // Load summary on mount and when options change
  React.useEffect(() => {
    loadExportSummary();
  }, [loadExportSummary]);

  // Handle export
  const handleExport = async () => {
    if (!includeTasks && !includeReports) {
      Alert.alert('Chyba', 'Vyberte alespoň jednu kategorii dat k exportu.');
      return;
    }

    setIsExporting(true);
    try {
      await exportAndShare(includeTasks, includeReports);
      // Share dialog was shown, no need for additional alert
    } catch (error: any) {
      // User cancelled share dialog - not an error
      if (error.message?.includes('cancelled') || error.message?.includes('canceled')) {
        return;
      }
      Alert.alert('Chyba', 'Nepodařilo se exportovat data. Zkuste to znovu.');
    } finally {
      setIsExporting(false);
    }
  };

  // Quick export functions
  const handleExportTasks = async () => {
    setIsExporting(true);
    try {
      await exportAndShare(true, false);
    } catch (error: any) {
      if (!error.message?.includes('cancel')) {
        Alert.alert('Chyba', 'Nepodařilo se exportovat úkoly.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportReports = async () => {
    setIsExporting(true);
    try {
      await exportAndShare(false, true);
    } catch (error: any) {
      if (!error.message?.includes('cancel')) {
        Alert.alert('Chyba', 'Nepodařilo se exportovat přehledy.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await exportAndShare(true, true);
    } catch (error: any) {
      if (!error.message?.includes('cancel')) {
        Alert.alert('Chyba', 'Nepodařilo se exportovat data.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Handle import file selection
  const handleSelectFile = async () => {
    setIsImporting(true);
    try {
      const result = await pickAndPreview();

      if (!result) {
        // User cancelled
        setIsImporting(false);
        return;
      }

      if (!result.preview.valid) {
        Alert.alert('Chyba', result.preview.error || 'Neplatný soubor');
        setIsImporting(false);
        return;
      }

      // Show confirmation dialog
      setImportPreview(result);
      setShowImportDialog(true);
    } catch (error: any) {
      Alert.alert('Chyba', 'Nepodařilo se načíst soubor.');
    } finally {
      setIsImporting(false);
    }
  };

  // Confirm import
  const handleConfirmImport = async () => {
    if (!importPreview) return;

    setShowImportDialog(false);
    setIsImporting(true);

    try {
      const result = await importFromFile(importPreview.filePath);

      if (result.success) {
        Alert.alert(
          CzechText.importSuccess,
          `Importováno:\n${result.tasksImported} úkolů\n${result.statesImported} záznamů`
        );
      } else {
        Alert.alert(CzechText.importError, result.error || 'Neznámá chyba');
      }
    } catch {
      Alert.alert(CzechText.importError, 'Nepodařilo se importovat data.');
    } finally {
      setIsImporting(false);
      setImportPreview(null);
    }
  };

  // Cancel import
  const handleCancelImport = () => {
    setShowImportDialog(false);
    setImportPreview(null);
  };

  // Handle clear data
  const handleClearData = async () => {
    setShowClearDialog(false);
    setIsClearing(true);

    try {
      const success = await DataExportImport.clearAppData();
      if (success) {
        await refreshTasks();
        await loadExportSummary();
        Alert.alert(CzechText.clearDataSuccess);
      } else {
        Alert.alert('Chyba', CzechText.clearDataError);
      }
    } catch {
      Alert.alert('Chyba', CzechText.clearDataError);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <ScrollView style={styles.content}>
        {/* Export Section */}
        <Card style={styles.card}>
          <Card.Title
            title={CzechText.exportData}
            titleVariant="titleLarge"
            left={(props) => (
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text style={{ fontSize: 20 }}>📤</Text>
              </View>
            )}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Vyberte, co chcete exportovat:
            </Text>

            {/* Export checkboxes */}
            <View style={styles.checkboxRow}>
              <Checkbox
                status={includeTasks ? 'checked' : 'unchecked'}
                onPress={() => setIncludeTasks(!includeTasks)}
                disabled={isExporting}
              />
              <Text
                variant="bodyLarge"
                style={styles.checkboxLabel}
                onPress={() => setIncludeTasks(!includeTasks)}
              >
                Úkoly a nastavení
              </Text>
              {exportSummary && includeTasks && (
                <Text variant="bodySmall" style={styles.countBadge}>
                  ({exportSummary.tasksCount})
                </Text>
              )}
            </View>

            <View style={styles.checkboxRow}>
              <Checkbox
                status={includeReports ? 'checked' : 'unchecked'}
                onPress={() => setIncludeReports(!includeReports)}
                disabled={isExporting}
              />
              <Text
                variant="bodyLarge"
                style={styles.checkboxLabel}
                onPress={() => setIncludeReports(!includeReports)}
              >
                Historie a přehledy
              </Text>
              {exportSummary && includeReports && (
                <Text variant="bodySmall" style={styles.countBadge}>
                  ({exportSummary.statesCount})
                </Text>
              )}
            </View>

            <Button
              mode="contained"
              icon="export"
              onPress={handleExport}
              loading={isExporting}
              disabled={isExporting || (!includeTasks && !includeReports)}
              style={styles.mainButton}
            >
              Exportovat vybrané
            </Button>

            <Divider style={styles.divider} />

            <Text
              variant="bodySmall"
              style={[styles.quickExportLabel, { color: theme.colors.onSurfaceVariant }]}
            >
              Rychlý export:
            </Text>

            <View style={styles.quickButtons}>
              <Button
                mode="outlined"
                icon="file-document"
                onPress={handleExportTasks}
                disabled={isExporting}
                compact
                style={styles.quickButton}
              >
                Úkoly
              </Button>
              <Button
                mode="outlined"
                icon="chart-line"
                onPress={handleExportReports}
                disabled={isExporting}
                compact
                style={styles.quickButton}
              >
                Přehledy
              </Button>
              <Button
                mode="outlined"
                icon="database"
                onPress={handleExportAll}
                disabled={isExporting}
                compact
                style={styles.quickButton}
              >
                Vše
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Import Section */}
        <Card style={styles.card}>
          <Card.Title
            title={CzechText.importData}
            titleVariant="titleLarge"
            left={(props) => (
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}
              >
                <Text style={{ fontSize: 20 }}>📥</Text>
              </View>
            )}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Importujte data z dříve exportovaného souboru. Duplicitní záznamy
              budou přeskočeny.
            </Text>

            <Button
              mode="contained"
              icon="file-import"
              onPress={handleSelectFile}
              loading={isImporting}
              disabled={isImporting}
              style={styles.mainButton}
              buttonColor={theme.colors.secondary}
            >
              Vybrat soubor...
            </Button>
          </Card.Content>
        </Card>

        {/* Clear Data Section */}
        <Card style={[styles.card, styles.dangerCard]}>
          <Card.Title
            title={CzechText.clearData}
            titleVariant="titleLarge"
            left={(props) => (
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.errorContainer },
                ]}
              >
                <Text style={{ fontSize: 20 }}>🗑️</Text>
              </View>
            )}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              {CzechText.clearDataDescription}
            </Text>

            <Button
              mode="contained"
              icon="delete-forever"
              onPress={() => setShowClearDialog(true)}
              loading={isClearing}
              disabled={isClearing || isExporting || isImporting}
              style={styles.mainButton}
              buttonColor={theme.colors.error}
            >
              {CzechText.clearData}
            </Button>
          </Card.Content>
        </Card>

        {/* Info Card */}
        <Card style={[styles.card, styles.infoCard]}>
          <Card.Content>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              💡 Tip: Exportovaný soubor můžete uložit do cloudového úložiště
              nebo poslat e-mailem pro zálohu.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Import Confirmation Dialog */}
      <Portal>
        <Dialog visible={showImportDialog} onDismiss={handleCancelImport}>
          <Dialog.Title>Potvrdit import</Dialog.Title>
          <Dialog.Content>
            {importPreview?.preview && (
              <View>
                <Text variant="bodyLarge">
                  Soubor obsahuje:
                </Text>
                <View style={styles.previewList}>
                  <Text variant="bodyMedium">
                    • {importPreview.preview.tasksCount} úkolů
                  </Text>
                  <Text variant="bodyMedium">
                    • {importPreview.preview.statesCount} záznamů historie
                  </Text>
                </View>
                <Text
                  variant="bodySmall"
                  style={{ marginTop: 12, color: theme.colors.onSurfaceVariant }}
                >
                  Duplicitní záznamy budou přeskočeny.
                </Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancelImport}>{CzechText.cancel}</Button>
            <Button onPress={handleConfirmImport} mode="contained">
              Importovat
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Clear Data Confirmation Dialog */}
        <Dialog visible={showClearDialog} onDismiss={() => setShowClearDialog(false)}>
          <Dialog.Title>{CzechText.clearDataConfirmTitle}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {CzechText.clearDataConfirmMessage}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDialog(false)}>{CzechText.cancel}</Button>
            <Button
              onPress={handleClearData}
              mode="contained"
              buttonColor={theme.colors.error}
            >
              {CzechText.clearData}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Loading Overlay */}
      {(isExporting || isImporting || isClearing) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.7,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxLabel: {
    flex: 1,
  },
  countBadge: {
    opacity: 0.6,
    marginLeft: 8,
  },
  mainButton: {
    marginTop: 16,
  },
  divider: {
    marginVertical: 16,
  },
  quickExportLabel: {
    marginBottom: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    flex: 1,
    minWidth: 80,
  },
  infoCard: {
    opacity: 0.8,
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#E57373',
  },
  previewList: {
    marginTop: 8,
    marginLeft: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
