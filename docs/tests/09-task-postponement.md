# Test 09: Odložení úkolu

## Cíl testu
Ověřit, že dítě může odložit úkol na pozdější čas (max 2x denně).

## Předpoklady
- Pro tento test je potřeba mít nesplněný úkol
- Pokud byly úkoly splněny v testu 08, vytvořte nový úkol nebo vyčkejte na další den
- Alternativně: Vymažte data aplikace a opakujte testy 01-07

## Příprava (pokud potřeba)
1. Přihlaste se jako rodič
2. Vytvořte nový úkol:
   - Název: "Úklid pokoje"
   - Čas: aktuální čas + 1 hodina
   - Dny: včetně dnešního dne
3. Odhlaste se

## Kroky testu

### Krok 1: Otevření detailu úkolu
1. Na hlavní obrazovce klikněte na nesplněný úkol

**Očekávaný výsledek:**
- Zobrazí se detail úkolu
- Tlačítko "Odložit" je viditelné a aktivní
- Zobrazuje se aktuální čas úkolu

### Krok 2: První odložení
1. Klikněte na tlačítko **"Odložit"**

**Očekávaný výsledek:**
- Zobrazí se výběr nového času
- Nabízí se časové možnosti (např. +15 min, +30 min, +1 hodina, vlastní čas)

### Krok 3: Výběr nového času
1. Vyberte nový čas (např. +30 minut)
2. Potvrďte výběr

**Očekávaný výsledek:**
- Čas úkolu se aktualizoval
- Zobrazuje se nový čas
- Původní čas je zobrazen přeškrtnutý (nebo jako "Původně: XX:XX")
- Informace "Úkol byl odložen 1x"
- Tlačítko "Odložit" je stále aktivní

### Krok 4: Kontrola na hlavní obrazovce
1. Vraťte se na hlavní obrazovku

**Očekávaný výsledek:**
- Úkol se přesunul v seznamu podle nového času
- Zobrazuje se informace o odložení

### Krok 5: Druhé odložení
1. Znovu otevřete detail úkolu
2. Klikněte na **"Odložit"**
3. Vyberte nový čas

**Očekávaný výsledek:**
- Čas se znovu aktualizoval
- Informace "Úkol byl odložen 2x"
- Tlačítko "Odložit" je nyní **neaktivní** nebo skryté

### Krok 6: Pokus o třetí odložení
1. Zkontrolujte tlačítko "Odložit"

**Očekávaný výsledek:**
- Tlačítko je neaktivní/disabled
- Nebo zobrazuje zprávu "Maximální počet odložení dosažen"
- Nelze odložit více než 2x za den

### Krok 7: Splnění odloženého úkolu
1. Klikněte na **"Splnit úkol"**
2. Potvrďte

**Očekávaný výsledek:**
- Úkol je splněn
- Odložení se správně zaznamenalo

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Otevření detailu | ⬜ Pass / ⬜ Fail | |
| 2. První odložení | ⬜ Pass / ⬜ Fail | |
| 3. Výběr nového času | ⬜ Pass / ⬜ Fail | |
| 4. Kontrola na hlavní | ⬜ Pass / ⬜ Fail | |
| 5. Druhé odložení | ⬜ Pass / ⬜ Fail | |
| 6. Pokus o třetí odložení | ⬜ Pass / ⬜ Fail | |
| 7. Splnění odloženého úkolu | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Poznámky:**
