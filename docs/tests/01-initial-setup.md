# Test 01: Prvotní nastavení a vymazání dat

## Cíl testu
Ověřit, že aplikace správně funguje při prvním spuštění a že lze vymazat všechna data.

## Předpoklady
- Aplikace je nainstalována na zařízení
- Žádná předchozí data v aplikaci (nebo budou vymazána)

## Kroky testu

### Krok 1: Vymazání dat aplikace
1. Otevřete nastavení Android zařízení
2. Přejděte do **Aplikace** > **TaskNotebook**
3. Klikněte na **Úložiště**
4. Klikněte na **Vymazat data** a potvrďte

**Očekávaný výsledek:**
- Všechna data aplikace jsou vymazána

### Krok 2: Spuštění aplikace
1. Spusťte aplikaci TaskNotebook

**Očekávaný výsledek:**
- Aplikace se spustí bez chyby
- Zobrazí se hlavní obrazovka pro dítě (prázdná - žádné úkoly)
- V dolní části je tlačítko "Registrovat rodiče"
- Není vidět žádný úkol ani upozornění

### Krok 3: Kontrola prázdného stavu
1. Zkontrolujte hlavní obrazovku

**Očekávaný výsledek:**
- Zobrazuje se aktuální datum s názvem dne (v češtině)
- Progress bar ukazuje 0% nebo není vidět
- Není žádný úkol v seznamu
- Sekce "Upozornění" je prázdná nebo skrytá

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Vymazání dat | ⬜ Pass / ⬜ Fail | |
| 2. Spuštění aplikace | ⬜ Pass / ⬜ Fail | |
| 3. Kontrola prázdného stavu | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Verze aplikace:** _______________

**Poznámky:**
