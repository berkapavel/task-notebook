# Test 04: Vytvoření úkolu s notifikací bez popisu

## Cíl testu
Ověřit, že lze vytvořit úkol pouze s časem notifikace, bez popisu.

## Předpoklady
- Test 03 byl úspěšně dokončen
- Jste přihlášeni jako rodič

## Kroky testu

### Krok 1: Otevření formuláře pro nový úkol
1. Klikněte na FAB (+) nebo **"Přidat úkol"**

**Očekávaný výsledek:**
- Zobrazí se formulář pro vytvoření úkolu

### Krok 2: Vyplnění pouze názvu
1. Do pole **"Název úkolu"** zadejte: `Snídaně`
2. Pole **"Popis"** ponechte prázdné

**Očekávaný výsledek:**
- Název je vyplněn
- Popis zůstává prázdný

### Krok 3: Výběr dnů v týdnu
1. Vyberte pouze pracovní dny: **Po, Út, St, Čt, Pá**

**Očekávaný výsledek:**
- Pouze pracovní dny jsou označené
- So, Ne nejsou vybrané

### Krok 4: Nastavení času notifikace
1. Ujistěte se, že přepínač **"Úkol s časem"** je zapnutý
2. Nastavte čas na **07:00**

**Očekávaný výsledek:**
- Čas 07:00 je zobrazen

### Krok 5: Uložení úkolu
1. Klikněte na tlačítko **"Uložit"**

**Očekávaný výsledek:**
- Úkol je úspěšně uložen
- Není chyba kvůli prázdnému popisu

### Krok 6: Ověření v seznamu úkolů
1. Přejděte na **"Seznam úkolů"**
2. Najděte úkol "Snídaně"

**Očekávaný výsledek:**
- Úkol je v seznamu
- Zobrazuje se čas 07:00
- Popis není zobrazen (nebo prázdný)
- Zobrazují se pouze Po-Pá

---

## Testovací data

| Pole | Hodnota |
|------|---------|
| Název | Snídaně |
| Popis | (prázdný) |
| Dny | Po, Út, St, Čt, Pá |
| Čas | 07:00 |

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Otevření formuláře | ⬜ Pass / ⬜ Fail | |
| 2. Vyplnění pouze názvu | ⬜ Pass / ⬜ Fail | |
| 3. Výběr dnů | ⬜ Pass / ⬜ Fail | |
| 4. Nastavení času | ⬜ Pass / ⬜ Fail | |
| 5. Uložení úkolu | ⬜ Pass / ⬜ Fail | |
| 6. Ověření v seznamu | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Poznámky:**
