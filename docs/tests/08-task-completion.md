# Test 08: Splnění úkolu

## Cíl testu
Ověřit, že dítě může označit úkol jako splněný a systém správně reaguje.

## Předpoklady
- Test 07 byl úspěšně dokončen
- Jste v dětském režimu
- Existují nesplněné úkoly pro dnešní den

## Kroky testu

### Krok 1: Splnění úkolu přes checkbox
1. Na hlavní obrazovce najděte úkol **"Snídaně"** (nebo jiný dostupný)
2. Klikněte na checkbox vedle úkolu

**Očekávaný výsledek:**
- Zobrazí se potvrzovací dialog
- Dialog obsahuje text "Opravdu jsi splnil/a tento úkol?"

### Krok 2: Potvrzení splnění
1. V dialogu klikněte na **"Ano"** / **"Splnit"**

**Očekávaný výsledek:**
- Úkol je označen jako splněný
- Spustí se animace konfet
- Zobrazí se povzbudivá zpráva (např. "Skvělá práce!", "Výborně!" apod.)
- Progress bar se aktualizuje
- Úkol zmizí ze seznamu nebo je přeškrtnutý

### Krok 3: Kontrola progress baru
1. Zkontrolujte progress bar

**Očekávaný výsledek:**
- Progress bar ukazuje vyšší procento
- Počítadlo úkolů se aktualizovalo (např. "1/2 splněno")

### Krok 4: Splnění úkolu přes detail
1. Klikněte na další nesplněný úkol (např. "Čištění zubů ráno")
2. V detailu klikněte na tlačítko **"Splnit úkol"**
3. Potvrďte v dialogu

**Očekávaný výsledek:**
- Úkol je označen jako splněný
- Konfety a povzbudivá zpráva
- Návrat na hlavní obrazovku (nebo aktualizace detailu)

### Krok 5: Kontrola po splnění všech úkolů
1. Splňte všechny zbývající úkoly s časem

**Očekávaný výsledek:**
- Progress bar ukazuje 100%
- Zobrazí se speciální gratulační zpráva
- Všechny úkoly jsou splněny

### Krok 6: Kontrola, že upozornění nelze splnit
1. Najděte sekci upozornění
2. Pokuste se kliknout na upozornění "Nezapomenout svačinu"

**Očekávaný výsledek:**
- Upozornění nemá checkbox
- Nelze ho označit jako splněné
- Slouží pouze jako připomínka

---

## Povzbudivé zprávy (v češtině)
Aplikace by měla zobrazovat různé povzbudivé zprávy, např.:
- "Skvělá práce!"
- "Výborně!"
- "Jsi hvězda!"
- "Tak to je paráda!"
- (a další...)

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Splnění přes checkbox | ⬜ Pass / ⬜ Fail | |
| 2. Potvrzení splnění | ⬜ Pass / ⬜ Fail | |
| 3. Kontrola progress baru | ⬜ Pass / ⬜ Fail | |
| 4. Splnění přes detail | ⬜ Pass / ⬜ Fail | |
| 5. Splnění všech úkolů | ⬜ Pass / ⬜ Fail | |
| 6. Upozornění nelze splnit | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Zobrazené povzbudivé zprávy:**

**Poznámky:**
