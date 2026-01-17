# Test 03: Vytvoření úkolu s notifikací a popisem

## Cíl testu
Ověřit, že lze vytvořit kompletní úkol se všemi parametry (čas notifikace + popis).

## Předpoklady
- Test 02 byl úspěšně dokončen
- Jste přihlášeni jako rodič (Admin Dashboard)

## Kroky testu

### Krok 1: Otevření formuláře pro nový úkol
1. Klikněte na tlačítko **"Přidat úkol"** nebo FAB (+)

**Očekávaný výsledek:**
- Zobrazí se formulář pro vytvoření úkolu
- Pole jsou prázdná
- Sekce šablon je viditelná (pro rychlé vyplnění)

### Krok 2: Vyplnění základních údajů
1. Do pole **"Název úkolu"** zadejte: `Čištění zubů ráno`
2. Do pole **"Popis"** zadejte: `Nezapomeň vyčistit zuby alespoň 2 minuty`

**Očekávaný výsledek:**
- Text je správně zadán do obou polí

### Krok 3: Výběr dnů v týdnu
1. Klikněte na všechny dny: **Po, Út, St, Čt, Pá, So, Ne** (celý týden)

**Očekávaný výsledek:**
- Všechny dny jsou označené/vybrané
- Vizuální indikace výběru (změna barvy)

### Krok 4: Nastavení času notifikace
1. Ujistěte se, že přepínač **"Úkol s časem"** je zapnutý
2. Klikněte na pole času
3. Nastavte čas na **07:30**
4. Potvrďte výběr

**Očekávaný výsledek:**
- Čas 07:30 je zobrazen ve formuláři
- Formát je HH:mm

### Krok 5: Uložení úkolu
1. Klikněte na tlačítko **"Uložit"**

**Očekávaný výsledek:**
- Úkol je uložen
- Přesměrování zpět na seznam úkolů nebo dashboard
- Zobrazí se potvrzující zpráva (toast/snackbar)

### Krok 6: Ověření v seznamu úkolů
1. Přejděte na **"Seznam úkolů"**
2. Najděte úkol "Čištění zubů ráno"

**Očekávaný výsledek:**
- Úkol je v seznamu
- Zobrazuje se čas 07:30
- Zobrazuje se ikona notifikace (není warning)
- Zobrazují se všechny dny týdne

---

## Testovací data

| Pole | Hodnota |
|------|---------|
| Název | Čištění zubů ráno |
| Popis | Nezapomeň vyčistit zuby alespoň 2 minuty |
| Dny | Po, Út, St, Čt, Pá, So, Ne |
| Čas | 07:30 |

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Otevření formuláře | ⬜ Pass / ⬜ Fail | |
| 2. Základní údaje | ⬜ Pass / ⬜ Fail | |
| 3. Výběr dnů | ⬜ Pass / ⬜ Fail | |
| 4. Nastavení času | ⬜ Pass / ⬜ Fail | |
| 5. Uložení úkolu | ⬜ Pass / ⬜ Fail | |
| 6. Ověření v seznamu | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Poznámky:**
