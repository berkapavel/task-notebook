# Test 11: Přehledy a grafy

## Cíl testu
Ověřit, že přehledy zobrazují správné statistiky a grafy.

## Předpoklady
- Existují splněné a nesplněné úkoly za poslední dny
- Pro nejlepší výsledky: mít historii alespoň 2-3 dny

## Kroky testu

### Krok 1: Otevření přehledů
1. Na hlavní obrazovce klikněte na tlačítko **"Přehledy"** (nebo ikonu grafu)

**Očekávaný výsledek:**
- Zobrazí se obrazovka přehledů
- Jsou vidět statistické karty
- Je vidět graf

### Krok 2: Kontrola statistických karet
1. Zkontrolujte zobrazené karty

**Očekávaný výsledek:**
Zobrazují se minimálně:
- **Míra splnění** - procento za posledních 7 dní
- **Celkem úkolů** - počet úkolů
- **Aktuální série** - počet po sobě jdoucích dnů se 100% splněním

### Krok 3: Kontrola koláčového grafu
1. Zkontrolujte koláčový (pie) graf

**Očekávaný výsledek:**
- Graf zobrazuje poměr splněných vs nesplněných úkolů
- Barvy rozlišují splněné (zelená) a nesplněné (červená/šedá)
- Zobrazuje se legenda nebo popisky
- Data odpovídají posledním 7 dnům

### Krok 4: Přechod na detail dne
1. Klikněte na **"Zobrazit detail"** nebo podobné tlačítko

**Očekávaný výsledek:**
- Zobrazí se obrazovka s detailem dne
- Výchozí je dnešní den
- Zobrazují se úkoly pro daný den

### Krok 5: Navigace mezi dny
1. Klikněte na šipku **"Předchozí den"** (←)

**Očekávaný výsledek:**
- Přejde na včerejší den
- Datum se aktualizuje
- Zobrazují se úkoly pro včerejší den
- Splněné úkoly jsou označené (ikona, přeškrtnutí)
- Nesplněné úkoly jsou odlišené

### Krok 6: Kontrola detailu splněného úkolu
1. Najděte splněný úkol

**Očekávaný výsledek:**
- Zobrazuje se ikona/checkbox jako splněný
- Název může být přeškrtnutý
- Zobrazuje se čas splnění (pokud je k dispozici)

### Krok 7: Kontrola detailu nesplněného úkolu
1. Najděte nesplněný úkol (pokud existuje)

**Očekávaný výsledek:**
- Zobrazuje se jako nesplněný
- Bez přeškrtnutí
- Bez času splnění

### Krok 8: Pokus o navigaci do budoucnosti
1. Vraťte se na dnešek
2. Pokuste se kliknout na šipku **"Další den"** (→)

**Očekávaný výsledek:**
- Nelze přejít na zítřek (budoucnost)
- Tlačítko je neaktivní nebo skryté
- Nebo se zobrazí upozornění

### Krok 9: Kontrola prázdného dne
1. Navigujte na den, kdy nebyly žádné úkoly (víkend bez úkolů)

**Očekávaný výsledek:**
- Zobrazí se zpráva "Žádné úkoly pro tento den" nebo podobná
- Prázdný stav je správně ošetřen

### Krok 10: Návrat na přehledy
1. Klikněte na tlačítko zpět

**Očekávaný výsledek:**
- Návrat na hlavní obrazovku přehledů
- Statistiky jsou stále správné

---

## Výpočet statistik

### Míra splnění
```
(počet splněných úkolů za 7 dní) / (celkový počet úkolů za 7 dní) × 100%
```

### Aktuální série (streak)
- Počet po sobě jdoucích dnů, kdy byly splněny **všechny** úkoly (100%)
- Dny bez úkolů se přeskakují
- Série se přeruší nesplněným úkolem

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Otevření přehledů | ⬜ Pass / ⬜ Fail | |
| 2. Statistické karty | ⬜ Pass / ⬜ Fail | |
| 3. Koláčový graf | ⬜ Pass / ⬜ Fail | |
| 4. Detail dne | ⬜ Pass / ⬜ Fail | |
| 5. Navigace mezi dny | ⬜ Pass / ⬜ Fail | |
| 6. Detail splněného úkolu | ⬜ Pass / ⬜ Fail | |
| 7. Detail nesplněného úkolu | ⬜ Pass / ⬜ Fail | |
| 8. Navigace do budoucnosti | ⬜ Pass / ⬜ Fail | |
| 9. Prázdný den | ⬜ Pass / ⬜ Fail | |
| 10. Návrat na přehledy | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Naměřené statistiky:**
- Míra splnění: ___%
- Celkem úkolů: ___
- Aktuální série: ___ dní

**Poznámky:**
