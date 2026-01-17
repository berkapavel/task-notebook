# TaskNotebook - Testovací scénáře

Tento adresář obsahuje kompletní end-to-end testovací scénáře pro aplikaci TaskNotebook.

## Přehled testů

| # | Test | Popis | Závislosti |
|---|------|-------|------------|
| 01 | [Prvotní nastavení](01-initial-setup.md) | Vymazání dat, první spuštění | - |
| 02 | [Registrace rodiče](02-parent-registration.md) | Vytvoření rodičovského účtu | 01 |
| 03 | [Úkol s notifikací a popisem](03-task-with-notification-and-description.md) | Kompletní úkol se všemi parametry | 02 |
| 04 | [Úkol s notifikací bez popisu](04-task-with-notification-no-description.md) | Úkol pouze s časem | 02 |
| 05 | [Upozornění (bez notifikace)](05-warning-task-no-notification.md) | Úkol typu warning | 02 |
| 06 | [Odhlášení admina](06-admin-logout.md) | Přepnutí do dětského režimu | 03-05 |
| 07 | [Zobrazení úkolů (dítě)](07-child-view-tasks.md) | Kontrola dětského zobrazení | 06 |
| 08 | [Splnění úkolu](08-task-completion.md) | Označení úkolu jako splněného | 07 |
| 09 | [Odložení úkolu](09-task-postponement.md) | Postpone funkcionalita | 07 |
| 10 | [Notifikace](10-notifications.md) | Push notifikace | 03-05 |
| 11 | [Přehledy a grafy](11-reports-and-graphs.md) | Statistiky a vizualizace | 08 |
| 12 | [Úspěchy](12-achievements.md) | Achievement systém | 08 |
| 13 | [Export/Import dat](13-data-export-import.md) | Záloha a obnova dat | 02 |

## Jak provádět testy

### Příprava
1. Nainstalujte aplikaci na Android zařízení
2. Ujistěte se, že máte povolené notifikace
3. Mějte připravené místo pro ukládání exportů (email, cloud)

### Pořadí testování
Testy jsou navrženy pro sekvenční provádění v pořadí 01 → 13. Některé testy závisí na výsledcích předchozích.

### Doporučený postup
1. Začněte testem 01 (vymazání dat)
2. Postupujte podle pořadí
3. U každého testu vyplňte výsledky přímo v markdown souboru
4. Pokud test selže, zaznamenejte detaily do poznámek
5. Po dokončení všech testů vytvořte souhrn

## Testovací data

Pro testy 03-05 se vytvoří následující úkoly:

| Úkol | Typ | Čas | Dny | Popis |
|------|-----|-----|-----|-------|
| Čištění zubů ráno | S notifikací | 07:30 | Celý týden | Ano |
| Snídaně | S notifikací | 07:00 | Po-Pá | Ne |
| Nezapomenout svačinu | Upozornění | - | Po-Pá | Ano |

## Dlouhodobé testy

Některé testy vyžadují delší časové období:

- **Test 12 - Úspěchy:**
  - 3denní série: 3 dny
  - Týdenní šampion: 7 dní
  - Měsíční hvězda: 30 dní
  - Pokročilý: 50 splněných úkolů
  - Mistr úkolů: 100 splněných úkolů

## Souhrn výsledků

Po dokončení testů vyplňte tento souhrn:

| Test | Výsledek | Datum |
|------|----------|-------|
| 01 - Prvotní nastavení | ⬜ Pass / ⬜ Fail | |
| 02 - Registrace rodiče | ⬜ Pass / ⬜ Fail | |
| 03 - Úkol s notifikací a popisem | ⬜ Pass / ⬜ Fail | |
| 04 - Úkol s notifikací bez popisu | ⬜ Pass / ⬜ Fail | |
| 05 - Upozornění | ⬜ Pass / ⬜ Fail | |
| 06 - Odhlášení admina | ⬜ Pass / ⬜ Fail | |
| 07 - Zobrazení úkolů | ⬜ Pass / ⬜ Fail | |
| 08 - Splnění úkolu | ⬜ Pass / ⬜ Fail | |
| 09 - Odložení úkolu | ⬜ Pass / ⬜ Fail | |
| 10 - Notifikace | ⬜ Pass / ⬜ Fail | |
| 11 - Přehledy a grafy | ⬜ Pass / ⬜ Fail | |
| 12 - Úspěchy | ⬜ Pass / ⬜ Fail | |
| 13 - Export/Import dat | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ___ / 13 testů prošlo

**Testováno verzí:** _______________

**Testované zařízení:** _______________

**Android verze:** _______________

**Testoval:** _______________

**Datum:** _______________

---

## Nalezené chyby

| # | Test | Popis chyby | Priorita | Stav |
|---|------|-------------|----------|------|
| | | | | |

---

*Vygenerováno pro TaskNotebook v1.0*
