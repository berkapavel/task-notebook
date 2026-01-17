# Test 13: Export a import dat

## Cíl testu
Ověřit, že lze exportovat a importovat data aplikace.

## Předpoklady
- Jste přihlášeni jako rodič
- Existují úkoly a historie splnění
- Přístup k souborovému systému nebo emailu

## Kroky testu

### Krok 1: Přechod na správu dat
1. V Admin Dashboard klikněte na **"Správa dat"** nebo podobné tlačítko

**Očekávaný výsledek:**
- Zobrazí se obrazovka správy dat
- Viditelné sekce pro export a import

### Krok 2: Export pouze úkolů
1. Vyberte možnost exportu **"Pouze úkoly"**
2. Klikněte na **"Exportovat"**

**Očekávaný výsledek:**
- Zobrazí se náhled počtu položek k exportu
- Otevře se systémový dialog pro sdílení
- Soubor má formát: `tasknotebook_export_YYYYMMDD_HHMMSS.json`

### Krok 3: Uložení exportu
1. Vyberte místo uložení (Stahování, Email, Cloud)
2. Uložte soubor

**Očekávaný výsledek:**
- Soubor je úspěšně uložen
- Potvrzující zpráva

### Krok 4: Export všech dat
1. Vyberte možnost **"Všechna data"**
2. Klikněte na **"Exportovat"**

**Očekávaný výsledek:**
- Export obsahuje úkoly I historii
- Náhled ukazuje větší počet položek

### Krok 5: Kontrola struktury exportovaného souboru
1. Otevřete exportovaný JSON soubor v editoru

**Očekávaný výsledek:**
```json
{
  "version": "1.0",
  "exportedAt": "2024-XX-XXTXX:XX:XX.XXXZ",
  "tasks": [
    {
      "id": "uuid",
      "name": "Název úkolu",
      "description": "Popis",
      "daysOfWeek": [1, 2, 3, 4, 5],
      "notificationTime": "07:30",
      "createdAt": "2024-XX-XX",
      "isActive": true
    }
  ],
  "dailyStates": [
    {
      "id": "uuid",
      "taskId": "uuid",
      "date": "2024-XX-XX",
      "completed": true,
      "completedAt": "2024-XX-XXTXX:XX:XX",
      "postponeCount": 0,
      "currentTime": "07:30"
    }
  ]
}
```

### Krok 6: Příprava na import
1. Vytvořte si kopii exportovaného souboru
2. (Volitelné) Upravte název jednoho úkolu v JSON souboru pro ověření importu

### Krok 7: Import dat
1. Vraťte se do aplikace > Správa dat
2. Klikněte na **"Importovat"**
3. Vyberte exportovaný soubor

**Očekávaný výsledek:**
- Zobrazí se náhled dat k importu
- Počet úkolů a záznamů

### Krok 8: Potvrzení importu
1. Klikněte na **"Potvrdit import"**

**Očekávaný výsledek:**
- Import proběhne úspěšně
- Zobrazí se počet importovaných položek
- Duplicity jsou přeskočeny (úkoly se stejným ID)

### Krok 9: Ověření importovaných dat
1. Přejděte na seznam úkolů
2. Zkontrolujte, že úkoly existují

**Očekávaný výsledek:**
- Všechny úkoly jsou na místě
- Data odpovídají exportovanému souboru

### Krok 10: Test importu nevalidního souboru
1. Vytvořte textový soubor s neplatným JSON
2. Pokuste se ho importovat

**Očekávaný výsledek:**
- Zobrazí se chybová hláška
- Import se neprovede
- Aplikace nezpadne

---

## Formát exportovaného souboru

```
tasknotebook_export_YYYYMMDD_HHMMSS.json
```

Příklad: `tasknotebook_export_20240115_143022.json`

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Přechod na správu dat | ⬜ Pass / ⬜ Fail | |
| 2. Export pouze úkolů | ⬜ Pass / ⬜ Fail | |
| 3. Uložení exportu | ⬜ Pass / ⬜ Fail | |
| 4. Export všech dat | ⬜ Pass / ⬜ Fail | |
| 5. Kontrola struktury | ⬜ Pass / ⬜ Fail | |
| 6. Příprava na import | ⬜ Pass / ⬜ Fail | |
| 7. Import dat | ⬜ Pass / ⬜ Fail | |
| 8. Potvrzení importu | ⬜ Pass / ⬜ Fail | |
| 9. Ověření dat | ⬜ Pass / ⬜ Fail | |
| 10. Nevalidní soubor | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Počet exportovaných úkolů:** ___

**Počet exportovaných záznamů:** ___

**Poznámky:**
