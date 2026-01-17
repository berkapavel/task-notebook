# Test 10: Notifikace

## Cíl testu
Ověřit, že aplikace správně odesílá notifikace v nastavený čas.

## Předpoklady
- Aplikace má povolení pro notifikace
- Existují úkoly s nastaveným časem
- Telefon není v režimu "Nerušit"

## Příprava
1. Přihlaste se jako rodič
2. Vytvořte testovací úkol:
   - Název: "Test notifikace"
   - Čas: **aktuální čas + 2 minuty** (např. pokud je 14:30, nastavte 14:32)
   - Dny: včetně dnešního dne
3. Odhlaste se

## Kroky testu

### Krok 1: Kontrola nastavení notifikací
1. Otevřete nastavení Android > Aplikace > TaskNotebook > Notifikace

**Očekávaný výsledek:**
- Notifikace jsou povolené
- Kanál notifikací existuje

### Krok 2: Čekání na notifikaci
1. Minimalizujte aplikaci nebo zamkněte obrazovku
2. Počkejte na nastavený čas notifikace

**Očekávaný výsledek:**
- V nastaveném čase se zobrazí notifikace
- Notifikace obsahuje název úkolu
- Notifikace má ikonu aplikace
- Může být zvuk nebo vibrace (podle nastavení)

### Krok 3: Kliknutí na notifikaci
1. Klikněte na zobrazenou notifikaci

**Očekávaný výsledek:**
- Aplikace se otevře
- Zobrazí se hlavní obrazovka nebo detail úkolu

### Krok 4: Test notifikace po odložení
1. Vytvořte nový úkol s časem za 3 minuty
2. Odložte úkol o 2 minuty (nový čas = původní + 2 min)
3. Čekejte na nový čas

**Očekávaný výsledek:**
- Notifikace přijde v **novém** čase (po odložení)
- Ne v původním čase

### Krok 5: Test zrušení notifikace po splnění
1. Vytvořte úkol s časem za 5 minut
2. Splňte úkol **před** nastaveným časem
3. Počkejte na původně nastavený čas

**Očekávaný výsledek:**
- Notifikace **nepřijde** (byla zrušena po splnění)

---

## Troubleshooting

Pokud notifikace nepřichází:
1. Zkontrolujte oprávnění aplikace
2. Zkontrolujte, že není aktivní režim "Nerušit"
3. Zkontrolujte optimalizaci baterie (zakažte pro TaskNotebook)
4. Zkontrolujte, že hodiny na telefonu jsou správné

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Kontrola nastavení | ⬜ Pass / ⬜ Fail | |
| 2. Čekání na notifikaci | ⬜ Pass / ⬜ Fail | |
| 3. Kliknutí na notifikaci | ⬜ Pass / ⬜ Fail | |
| 4. Notifikace po odložení | ⬜ Pass / ⬜ Fail | |
| 5. Zrušení po splnění | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Čas vytvoření testovacího úkolu:** _______________

**Čas příchodu notifikace:** _______________

**Poznámky:**
