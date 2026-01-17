# Test 06: Odhlášení z admin režimu

## Cíl testu
Ověřit, že odhlášení rodiče funguje správně a přepne aplikaci do dětského režimu.

## Předpoklady
- Testy 03-05 byly úspěšně dokončeny
- Jste přihlášeni jako rodič (Admin Dashboard)
- Existují vytvořené úkoly z předchozích testů

## Kroky testu

### Krok 1: Kontrola stavu před odhlášením
1. Ověřte, že jste na Admin Dashboard
2. Zkontrolujte statistiky úkolů

**Očekávaný výsledek:**
- Dashboard zobrazuje správný počet úkolů
- Minimálně 3 úkoly (z testů 03-05)

### Krok 2: Odhlášení
1. Klikněte na tlačítko **"Odhlásit"** (nebo ikonu odhlášení)

**Očekávaný výsledek:**
- Proběhne odhlášení
- Přesměrování na hlavní obrazovku pro dítě

### Krok 3: Kontrola dětské obrazovky
1. Ověřte, že jste na hlavní obrazovce pro dítě

**Očekávaný výsledek:**
- Zobrazuje se dnešní datum s názvem dne
- Admin Dashboard není přístupný
- Tlačítko změněno na "Přihlásit rodiče" (místo "Registrovat")
- Není vidět admin menu

### Krok 4: Pokus o přístup do admin bez přihlášení
1. Klikněte na **"Přihlásit rodiče"**

**Očekávaný výsledek:**
- Zobrazí se přihlašovací obrazovka
- Vyžaduje heslo

### Krok 5: Zrušení přihlášení
1. Klikněte na **"Zpět"** nebo **"Zrušit"**

**Očekávaný výsledek:**
- Návrat na hlavní dětskou obrazovku
- Zůstáváte nepřihlášeni

---

## Výsledek testu

| Krok | Stav | Poznámky |
|------|------|----------|
| 1. Kontrola před odhlášením | ⬜ Pass / ⬜ Fail | |
| 2. Odhlášení | ⬜ Pass / ⬜ Fail | |
| 3. Kontrola dětské obrazovky | ⬜ Pass / ⬜ Fail | |
| 4. Pokus o přístup do admin | ⬜ Pass / ⬜ Fail | |
| 5. Zrušení přihlášení | ⬜ Pass / ⬜ Fail | |

**Celkový výsledek:** ⬜ Pass / ⬜ Fail

**Testováno dne:** _______________

**Testoval:** _______________

**Poznámky:**
