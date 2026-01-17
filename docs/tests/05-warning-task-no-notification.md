# Test 05: Vytvoření upozornění (úkol bez notifikace)

## Cíl testu
Ověřit, že lze vytvořit úkol typu "upozornění" bez času notifikace.

## Předpoklady
- Testy 03-04 byly úspěšně dokončeny
- Jste přihlášeni jako rodič

## Kroky testu

### Krok 1: Otevření formuláře pro nový úkol
1. Klikněte na FAB (+) nebo **"Přidat úkol"**

**Očekávaný výsledek:**
- Zobrazí se formulář pro vytvoření úkolu

### Krok 2: Vyplnění údajů
1. Do pole **"Název úkolu"** zadejte: `Nezapomenout svačinu`
2. Do pole **"Popis"** zadejte: `Zkontroluj, že máš v tašce svačinu do školy`

**Očekávaný výsledek:**
- Oba texty jsou správně zadány

### Krok 3: Výběr dnů v týdnu
1. Vyberte pouze školní dny: **Po, Út, St, Čt, Pá**

**Očekávaný výsledek:**
- Pouze pracovní dny jsou označené

### Krok 4: Vypnutí času notifikace
1. Vypněte přepínač **"Úkol s časem"** (nebo podobný přepínač)
2. Alternativně: Nevyberte žádný čas

**Očekávaný výsledek:**
- Pole pro výběr času je skryté nebo neaktivní
- Úkol bude typu "upozornění" (warning)

### Krok 5: Uložení úkolu
1. Klikněte na tlačítko **"Uložit"**

**Očekávaný výsledek:**
- Úkol je úspěšně uložen
- Bez času notifikace

### Krok 6: Ověření v seznamu úkolů
1. Přejděte na **"Seznam úkolů"**
2. Najděte úkol "Nezapomenout svačinu"

**Očekávaný výsledek:**
- Úkol je v seznamu
- Místo času je zobrazen badge/ikona "Upozornění" (warning)
- Vizuálně odlišný od úkolů s časem

### Krok 7: Kontrola na Admin Dashboard
1. Přejděte na Admin Dashboard

**Očekávaný výsledek:**
- Statistika "Úkoly bez času" ukazuje 1 (nebo více)
- Úkol je započítán správně

---

## Testovací data

| Pole | Hodnota |
|------|---------|
| Název | Nezapomenout svačinu |
| Popis | Zkontroluj, že máš v tašce svačinu do školy |
| Dny | Po, Út, St, Čt, Pá |
| Čas | (žádný - upozornění) |

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Otevření formuláře | ⬜ Pass / ⬜ Fail | |
| 2. Vyplnění údajů | ⬜ Pass / ⬜ Fail | |
| 3. Výběr dnů | ⬜ Pass / ⬜ Fail | |
| 4. Vypnutí času | ⬜ Pass / ⬜ Fail | |
| 5. Uložení úkolu | ⬜ Pass / ⬜ Fail | |
| 6. Ověření v seznamu | ⬜ Pass / ⬜ Fail | |
| 7. Kontrola Dashboard | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Poznámky:**
