# Test 12: Úspěchy (Achievements)

## Cíl testu
Ověřit, že systém úspěchů správně odemyká odznaky za dosažení cílů.

## Předpoklady
- Čistá instalace (nebo vymazaná data úspěchů)
- Možnost splnit alespoň jeden úkol

## Seznam úspěchů v aplikaci

| # | Název | Podmínka |
|---|-------|----------|
| 1 | První úkol | Splnit první úkol vůbec |
| 2 | 3denní série | 3 po sobě jdoucí dny se 100% splněním |
| 3 | Týdenní šampion | 7 po sobě jdoucích dnů se 100% splněním |
| 4 | Měsíční hvězda | 30 po sobě jdoucích dnů se 100% splněním |
| 5 | Perfektní den | Splnit všechny úkoly v jednom dni |
| 6 | Ranní ptáče | Splnit úkol před 8:00 ráno |
| 7 | Noční sova | Splnit úkol po 20:00 večer |
| 8 | Začátečník | Splnit celkem 10 úkolů |
| 9 | Pokročilý | Splnit celkem 50 úkolů |
| 10 | Mistr úkolů | Splnit celkem 100 úkolů |

## Kroky testu

### Krok 1: Test úspěchu "První úkol"
1. Ujistěte se, že máte čistou instalaci (žádné splněné úkoly)
2. Splňte libovolný úkol

**Očekávaný výsledek:**
- Zobrazí se toast/notifikace "Odemčen úspěch: První úkol!"
- Nebo podobná zpráva v češtině

### Krok 2: Test úspěchu "Perfektní den"
1. Splňte **všechny** úkoly naplánované na dnešní den

**Očekávaný výsledek:**
- Po splnění posledního úkolu se zobrazí úspěch "Perfektní den"
- Progress bar ukazuje 100%

### Krok 3: Test úspěchu "Ranní ptáče"
**Tento test vyžaduje specifické podmínky:**
1. Vytvořte úkol s časem před 8:00 (např. 07:00)
2. Ráno před 8:00 splňte tento úkol

**Očekávaný výsledek:**
- Odemkne se úspěch "Ranní ptáče"

### Krok 4: Test úspěchu "Noční sova"
**Tento test vyžaduje specifické podmínky:**
1. Vytvořte úkol s časem po 20:00 (např. 21:00)
2. Večer po 20:00 splňte tento úkol

**Očekávaný výsledek:**
- Odemkne se úspěch "Noční sova"

### Krok 5: Test úspěchu "Začátečník"
**Vyžaduje splnění 10 úkolů celkem:**
1. Splňujte úkoly postupně
2. Po 10. splněném úkolu zkontrolujte notifikaci

**Očekávaný výsledek:**
- Po 10. úkolu se odemkne "Začátečník"

### Krok 6: Test úspěchu "3denní série"
**Vyžaduje 3 po sobě jdoucí perfektní dny:**
1. Den 1: Splňte 100% úkolů
2. Den 2: Splňte 100% úkolů
3. Den 3: Splňte 100% úkolů

**Očekávaný výsledek:**
- Po splnění posledního úkolu 3. dne se odemkne "3denní série"

---

## Poznámky k testování

- Úspěchy se ukládají trvale
- Každý úspěch lze získat pouze jednou
- Pro testování některých úspěchů je třeba manipulovat s časem nebo čekat více dní
- Úspěchy "Pokročilý" (50) a "Mistr úkolů" (100) vyžadují dlouhodobé testování
- Úspěchy "Týdenní šampion" (7 dní) a "Měsíční hvězda" (30 dní) vyžadují dlouhodobé testování

---

## Výsledek testu

| Úspěch | Testováno | Stav | Poznámky |
|--------|-----------|------|----------|
| První úkol | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| Perfektní den | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| Ranní ptáče | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| Noční sova | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| Začátečník | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| 3denní série | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| Týdenní šampion | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| Pokročilý | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| Mistr úkolů | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |
| Měsíční hvězda | ⬜ Ano / ⬜ Přeskočeno | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Poznámky:**
