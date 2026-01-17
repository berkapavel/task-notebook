# Test 07: Zobrazení úkolů v dětském režimu

## Cíl testu
Ověřit, že dítě vidí správné úkoly pro dnešní den.

## Předpoklady
- Test 06 byl úspěšně dokončen (jste odhlášeni z admin)
- Existují úkoly z testů 03-05
- Dnešní den odpovídá některému z naplánovaných dnů

## Důležité
**Pokud dnes je víkend (So/Ne):**
- Úkol "Snídaně" a "Nezapomenout svačinu" nebudou vidět (jsou pouze Po-Pá)
- Úkol "Čištění zubů ráno" bude vidět (je na celý týden)

**Pokud dnes je pracovní den (Po-Pá):**
- Všechny tři úkoly by měly být vidět

## Kroky testu

### Krok 1: Kontrola hlavní obrazovky
1. Zkontrolujte hlavní obrazovku dětského režimu

**Očekávaný výsledek:**
- Zobrazuje se dnešní datum (formát: den v týdnu, datum)
- Progress bar ukazuje 0% (žádný úkol nesplněn)
- Počítadlo úkolů ukazuje správný počet

### Krok 2: Kontrola sekce upozornění
1. Najděte sekci **"Upozornění"** (nebo podobnou)

**Očekávaný výsledek:**
- Zobrazuje se úkol "Nezapomenout svačinu" (pokud je dnes Po-Pá)
- Upozornění jsou vizuálně odlišná od běžných úkolů
- Nemají checkbox pro splnění (nelze je "dokončit")

### Krok 3: Kontrola seznamu úkolů s časem
1. Najděte seznam běžných úkolů

**Očekávaný výsledek:**
- Úkoly jsou seřazené podle času
- "Snídaně" (07:00) je první (pokud je dnes Po-Pá)
- "Čištění zubů ráno" (07:30) je druhý
- Každý úkol má checkbox
- Zobrazuje se čas úkolu
- Zobrazuje se název a popis (pokud existuje)

### Krok 4: Kontrola detailu úkolu s popisem
1. Klikněte na úkol **"Čištění zubů ráno"**

**Očekávaný výsledek:**
- Otevře se detail úkolu
- Zobrazuje se název: "Čištění zubů ráno"
- Zobrazuje se popis: "Nezapomeň vyčistit zuby alespoň 2 minuty"
- Zobrazuje se čas: 07:30
- Tlačítko "Odložit" je viditelné
- Tlačítko "Splnit úkol" je viditelné

### Krok 5: Kontrola detailu úkolu bez popisu
1. Vraťte se zpět
2. Klikněte na úkol **"Snídaně"** (pokud je dnes Po-Pá)

**Očekávaný výsledek:**
- Otevře se detail úkolu
- Zobrazuje se název: "Snídaně"
- Popis není zobrazen (nebo "Bez popisu")
- Zobrazuje se čas: 07:00

### Krok 6: Návrat na hlavní obrazovku
1. Klikněte na tlačítko zpět

**Očekávaný výsledek:**
- Návrat na hlavní dětskou obrazovku
- Stav úkolů nezměněn

---

## Očekávané úkoly podle dne

| Den | Čištění zubů ráno | Snídaně | Nezapomenout svačinu |
|-----|-------------------|---------|----------------------|
| Po  | ✅ | ✅ | ✅ (upozornění) |
| Út  | ✅ | ✅ | ✅ (upozornění) |
| St  | ✅ | ✅ | ✅ (upozornění) |
| Čt  | ✅ | ✅ | ✅ (upozornění) |
| Pá  | ✅ | ✅ | ✅ (upozornění) |
| So  | ✅ | ❌ | ❌ |
| Ne  | ✅ | ❌ | ❌ |

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Kontrola hlavní obrazovky | ⬜ Pass / ⬜ Fail | |
| 2. Kontrola sekce upozornění | ⬜ Pass / ⬜ Fail | |
| 3. Kontrola seznamu úkolů | ⬜ Pass / ⬜ Fail | |
| 4. Detail úkolu s popisem | ⬜ Pass / ⬜ Fail | |
| 5. Detail úkolu bez popisu | ⬜ Pass / ⬜ Fail | |
| 6. Návrat na hlavní obrazovku | ⬜ Pass / ⬜ Fail | |

**Dnešní den:** _______________

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Poznámky:**
