# Testing TaskNotebook

Guide for running the app on Android emulator from WSL (Windows Subsystem for Linux).

## Quick Start with Makefile

```bash
# Step 1: Start emulator OR setup physical device
make emu          # Start Android Studio emulator
# OR
make physical     # Setup physical device (USB debugging)

# Step 2: Build and run the app
make start        # metro, build, install, launch

# After code changes
make restart      # Rebuild and restart app

# Just reload the app (no rebuild)
make reload

# See all available commands
make help
```

## Prerequisites

- Windows with WSL2 (Debian/Ubuntu)
- Android Studio installed on Windows with an AVD (Android Virtual Device) configured
- Node.js and npm installed in WSL
- Android SDK installed in WSL (`~/android-sdk`)

## Setup Paths

```bash
# Windows ADB path
WIN_ADB="/mnt/c/Users/berka/AppData/Local/Android/Sdk/platform-tools/adb.exe"

# Windows Emulator path
WIN_EMU="/mnt/c/Users/berka/AppData/Local/Android/Sdk/emulator/emulator.exe"
```

## Step 1: Start the Android Emulator

List available emulators:
```bash
"$WIN_EMU" -list-avds
```

Start emulator (replace `Pixel_6` with your AVD name):
```bash
"$WIN_EMU" -avd Pixel_6 &
```

Wait for emulator to boot, then verify it's connected:
```bash
"$WIN_ADB" devices -l
```

You should see something like:
```
emulator-5554          device product:sdk_gphone64_x86_64 model:sdk_gphone64_x86_64
```

## Step 2: Set Up Port Forwarding

Metro bundler runs on port 8081 in WSL. Forward this port so the emulator can access it:

```bash
"$WIN_ADB" reverse tcp:8081 tcp:8081
```

## Step 3: Start Metro Bundler

In the project root directory. **Important:** Use `--host 0.0.0.0` to bind to all interfaces (required for WSL → Windows emulator connection):

```bash
cd /home/berkic/projects/soukrome/TaskNotebook
npx react-native start --host 0.0.0.0
```

Keep this terminal open. You should see:
```
Starting dev server on http://0.0.0.0:8081
...
Dev server ready.
```

## Step 4: Build and Install the App

Open a new terminal and build the debug APK:
```bash
cd /home/berkic/projects/soukrome/TaskNotebook/android
./gradlew assembleDebug
```

Install on emulator using Windows ADB:
```bash
APK_PATH="/home/berkic/projects/soukrome/TaskNotebook/android/app/build/outputs/apk/debug/app-debug.apk"
"$WIN_ADB" install -r "$(wslpath -w $APK_PATH)"
```

## Step 5: Launch the App

```bash
"$WIN_ADB" shell am start -n com.tasknotebook/.MainActivity
```

## Quick Reference Commands

| Action | Command |
|--------|---------|
| Check connected devices | `"$WIN_ADB" devices -l` |
| Reinstall app | `"$WIN_ADB" install -r "$(wslpath -w $APK_PATH)"` |
| Launch app | `"$WIN_ADB" shell am start -n com.tasknotebook/.MainActivity` |
| View app logs | `"$WIN_ADB" logcat *:S ReactNative:V ReactNativeJS:V` |
| Uninstall app | `"$WIN_ADB" uninstall com.tasknotebook` |
| Reset port forwarding | `"$WIN_ADB" reverse tcp:8081 tcp:8081` |

## One-Liner Setup Script

After emulator is running, execute all steps at once:

```bash
WIN_ADB="/mnt/c/Users/berka/AppData/Local/Android/Sdk/platform-tools/adb.exe" && \
"$WIN_ADB" reverse tcp:8081 tcp:8081 && \
cd /home/berkic/projects/soukrome/TaskNotebook && \
npx react-native start --host 0.0.0.0 &
sleep 10 && \
cd android && ./gradlew assembleDebug && \
"$WIN_ADB" install -r "$(wslpath -w /home/berkic/projects/soukrome/TaskNotebook/android/app/build/outputs/apk/debug/app-debug.apk)" && \
"$WIN_ADB" shell am start -n com.tasknotebook/.MainActivity
```

## Troubleshooting

### No devices found
- Make sure Android emulator is running in Android Studio
- Check if Windows ADB can see the device: `"$WIN_ADB" devices`

### App shows "Unable to load script" error
This means the emulator can't connect to Metro bundler. Fix:

1. Make sure Metro is started with `--host 0.0.0.0`:
   ```bash
   npx react-native start --host 0.0.0.0
   ```

2. Reset port forwarding:
   ```bash
   "$WIN_ADB" reverse --remove-all
   "$WIN_ADB" reverse tcp:8081 tcp:8081
   ```

3. Force restart the app:
   ```bash
   "$WIN_ADB" shell am force-stop com.tasknotebook
   "$WIN_ADB" shell am start -n com.tasknotebook/.MainActivity
   ```

### App shows white screen / doesn't load
- Check Metro bundler is running: `curl http://localhost:8081/status`
- Verify port forwarding: `"$WIN_ADB" reverse --list`
- Reset port forwarding: `"$WIN_ADB" reverse tcp:8081 tcp:8081`

### Build fails
- Make sure `android/local.properties` has correct SDK path:
  ```
  sdk.dir=/home/berkic/android-sdk
  ```
- Run `./gradlew clean` and try again

### Metro bundler connection refused
- Kill any existing Metro processes: `pkill -f metro`
- Restart with cache reset: `make reset-cache`

## Makefile Commands Reference

### Device/Emulator Setup

| Command | Description |
|---------|-------------|
| `make emu` | Start Android Studio emulator |
| `make emulator` | Alias for `make emu` |
| `make physical` | Setup physical device (USB debugging) |
| `make devices` | List all connected devices |
| `make device-info` | Show detailed info about target device |

### App Commands

| Command | Description |
|---------|-------------|
| `make start` | Start app: metro, build, install, launch (requires device) |
| `make restart` | Rebuild, reinstall, and launch app |
| `make reload` | Just restart the app (no rebuild) |
| `make metro` | Start Metro bundler (foreground) |
| `make metro-bg` | Start Metro bundler (background) |
| `make build` | Build debug APK |
| `make install` | Install APK on device |
| `make launch` | Launch app on device |
| `make port` | Setup port forwarding |

### Release Builds

| Command | Description |
|---------|-------------|
| `make build-release` | Build release APK for sideloading |
| `make build-bundle` | Build AAB bundle for Play Store |
| `make install-release` | Install release APK on device |

### Utilities

| Command | Description |
|---------|-------------|
| `make stop` | Stop app and Metro |
| `make clean` | Clean build files |
| `make clean-all` | Deep clean (reinstall node_modules) |
| `make logs` | View React Native logs |
| `make status` | Check device and Metro status |
| `make uninstall` | Uninstall app from device |
| `make menu` | Open React Native dev menu |
| `make reset-cache` | Reset Metro cache |
