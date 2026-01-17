# Test 02: Registrace rodiče

## Cíl testu
Ověřit, že registrace rodičovského účtu funguje správně.

## Předpoklady
- Test 01 byl úspěšně dokončen (čistá instalace)
- Aplikace je spuštěna

## Kroky testu

### Krok 1: Přechod na registraci
1. Na hlavní obrazovce klikněte na tlačítko **"Registrovat rodiče"** (v dolní části)

**Očekávaný výsledek:**
- Zobrazí se obrazovka registrace
- Je vidět pole pro heslo a potvrzení hesla
- Tlačítka pro zobrazení/skrytí hesla jsou funkční

### Krok 2: Test validace - krátké heslo
1. Zadejte heslo "123" (3 znaky)
2. Zadejte stejné heslo do potvrzení
3. Klikněte na **"Registrovat"**

**Očekávaný výsledek:**
- Zobrazí se chybová hláška (heslo musí mít minimálně 4 znaky)
- Registrace se neprovede

### Krok 3: Test validace - neshodná hesla
1. Zadejte heslo "1234"
2. Zadejte jiné heslo do potvrzení "5678"
3. Klikněte na **"Registrovat"**

**Očekávaný výsledek:**
- Zobrazí se chybová hláška (hesla se neshodují)
- Registrace se neprovede

### Krok 4: Úspěšná registrace
1. Zadejte heslo "1234" (nebo jiné min. 4 znaky)
2. Zadejte stejné heslo do potvrzení "1234"
3. Klikněte na **"Registrovat"**

**Očekávaný výsledek:**
- Registrace proběhne úspěšně
- Automatické přihlášení jako admin
- Zobrazí se Admin Dashboard (přehled pro rodiče)

### Krok 5: Kontrola Admin Dashboard
1. Zkontrolujte obsah Admin Dashboard

**Očekávaný výsledek:**
- Zobrazují se statistické karty (všechny na 0)
- Tlačítko "Přidat úkol" je viditelné
- Tlačítko "Odhlásit" je viditelné
- FAB (plovoucí tlačítko +) je viditelný

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Přechod na registraci | ⬜ Pass / ⬜ Fail | |
| 2. Validace - krátké heslo | ⬜ Pass / ⬜ Fail | |
| 3. Validace - neshodná hesla | ⬜ Pass / ⬜ Fail | |
| 4. Úspěšná registrace | ⬜ Pass / ⬜ Fail | |
| 5. Kontrola Admin Dashboard | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Poznámky:**
