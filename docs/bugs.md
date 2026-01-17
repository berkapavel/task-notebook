# Bug Report & Fixes

## Fixed Issues

### 1. Icons Not Displaying (FIXED)

**Symptom:** Icons appear as blank squares or question marks throughout the app.

**Cause:** React Native Vector Icons fonts were not properly included in the Android build.

**Solution:**
1. Created fonts directory:
   ```bash
   mkdir -p android/app/src/main/assets/fonts
   ```

2. Copied font files:
   ```bash
   cp node_modules/react-native-vector-icons/Fonts/*.ttf android/app/src/main/assets/fonts/
   ```

3. Created `react-native.config.js` to link assets:
   ```javascript
   module.exports = {
     project: {
       ios: {},
       android: {},
     },
     assets: ['./node_modules/react-native-vector-icons/Fonts'],
   };
   ```

4. Clean rebuild:
   ```bash
   make clean
   make restart
   ```

**Files Changed:**
- `android/app/src/main/assets/fonts/` - Added 19 font files
- `react-native.config.js` - Created new file

---

### 2. Metro Bundler Connection Issues in WSL (FIXED)

**Symptom:** App shows "Unable to load script" error on emulator.

**Cause:** Metro bundler binds to `localhost` by default, which is not accessible from the Windows emulator through WSL.

**Solution:** Start Metro with `--host 0.0.0.0`:
```bash
npx react-native start --host 0.0.0.0
```

**Files Changed:**
- `docs/test.md` - Updated documentation
- `Makefile` - Uses correct Metro command

---

### 3. Task Creation Fails with Error (FIXED)

**Symptom:** Adding a new task from admin panel shows "Nepodařilo se uložit úkol. Zkuste to znovu."

**Cause:** The `uuid` package (v13) requires `crypto.getRandomValues()` which is not available in React Native's JavaScript engine by default.

**Solution:**
1. Install the polyfill:
   ```bash
   npm install react-native-get-random-values
   ```

2. Add import at the VERY TOP of `index.js` (must be first import):
   ```javascript
   // Must be first import - provides crypto.getRandomValues() for uuid
   import 'react-native-get-random-values';
   ```

3. Restart Metro with cache reset:
   ```bash
   npx react-native start --host 0.0.0.0 --reset-cache
   ```

**Files Changed:**
- `package.json` - Added react-native-get-random-values dependency
- `index.js` - Added polyfill import as first line

---

## Known Issues / Limitations

### 1. Gradle Deprecation Warnings
**Status:** Not critical
**Description:** Build shows deprecation warnings about Gradle 9.0 compatibility.
**Impact:** None currently. Will need attention when upgrading to Gradle 9.

### 2. Notifee Deprecation Warning
**Status:** Not critical
**Description:** `onCatalystInstanceDestroy()` deprecated in Notifee library.
**Impact:** None. Waiting for library update.

---

## Testing Checklist

### Main Screen (Child View)
- [ ] Date displays correctly in Czech
- [ ] Task counters show correct numbers
- [ ] Progress bar updates on task completion
- [ ] Warning alerts section displays tasks without time
- [ ] Task cards show time chip
- [ ] Completing task triggers confetti animation
- [ ] Completing task shows encouragement message
- [ ] "All completed" message shows when all tasks done
- [ ] Reports button navigates to reports
- [ ] Login/Register button works

### Task Detail Screen
- [ ] Task name and description display
- [ ] Time shows correctly
- [ ] Postpone buttons work (max 2 times)
- [ ] Complete button works with confirmation
- [ ] Back navigation works

### Admin Panel
- [ ] Login with password works
- [ ] Dashboard stats are accurate
- [ ] Task list shows all tasks
- [ ] Day filter works
- [ ] Add new task works
- [ ] Edit task works
- [ ] Delete task works with confirmation
- [ ] Logout works

### Notifications
- [ ] Notification permission requested
- [ ] Notifications fire at scheduled time
- [ ] Tapping notification opens task detail
- [ ] Notifications cancelled when task completed

### Reports
- [ ] Completion stats calculate correctly
- [ ] Pie chart displays
- [ ] Day navigation works
- [ ] Streak counter is accurate

### Export/Import
- [ ] Export creates valid JSON file
- [ ] Share dialog opens
- [ ] Import reads file correctly
- [ ] Import preview shows counts
- [ ] Data imports successfully
