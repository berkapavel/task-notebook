# TaskNotebook

A React Native mobile application for family task management, designed primarily for children with parent administration capabilities.

## Overview

TaskNotebook helps parents create and manage daily tasks for their children while providing children with an engaging, gamified experience to complete their responsibilities. The app features push notifications, achievement systems, and visual progress tracking.

## Features

- **Daily Task List** - View and complete tasks scheduled for the current day
- **Postpone Feature** - Delay tasks up to 2 times (10-minute increments)
- **Progress Tracking** - Visual progress bar showing daily completion
- **Gamification** - Confetti animations, encouraging messages, and achievements
- **Reports** - View completion history with charts and statistics
- **Admin Panel** - Password-protected parent access for task management
- **Export/Import** - Backup and restore task data as JSON files

## Tech Stack

- React Native 0.83.1 with TypeScript
- React Native Paper (Material Design)
- React Navigation
- AsyncStorage
- Notifee (notifications)
- react-native-chart-kit

## Prerequisites

- Node.js >= 20
- Android SDK
- Java JDK 17+
- For WSL: Windows Android SDK with emulator

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd TaskNotebook

# Install dependencies
npm install
```

## Development

### Using Makefile (WSL)

```bash
# Show all available commands
make help

# Full development setup (emulator + metro + build + install)
make start

# Start Metro bundler
make metro

# Build debug APK
make build

# Install on emulator
make install
```

### Standard Commands

```bash
# Start Metro bundler
npm start

# Run on Android emulator
npm run android

# Run linter
npm run lint

# Run tests
npm test
```

## Building Release APK for Physical Device

### Step 1: Build the Release APK

```bash
# Using Makefile
make build-release

# Or manually
cd android && ./gradlew assembleRelease
```

The APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Step 2: Prepare Your Android Phone

1. **Enable Developer Options:**
   - Go to **Settings > About phone**
   - Tap **Build number** 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Go to **Settings > Developer options**
   - Enable **USB debugging**

3. **Allow Unknown Apps Installation:**
   - Go to **Settings > Security** (or **Privacy**)
   - Enable **Install unknown apps** for your file manager or browser

### Step 3: Transfer and Install APK

#### Option A: Using ADB (Recommended)

Connect your phone via USB cable:

```bash
# Using Makefile (WSL)
make install-release

# Or using adb directly
adb install android/app/build/outputs/apk/release/app-release.apk
```

#### Option B: Manual Transfer

1. Connect phone via USB in **File Transfer** mode
2. Copy `app-release.apk` to your phone (e.g., Downloads folder)
3. On your phone, open a file manager
4. Navigate to the APK file and tap to install
5. Accept any security prompts

#### Option C: Wireless Transfer

1. Upload APK to Google Drive, email, or cloud storage
2. Download it on your phone
3. Tap the downloaded file to install

### Step 4: Launch the App

After installation, find **TaskNotebook** in your app drawer and tap to open.

## Building for Play Store

```bash
# Build AAB bundle
make build-bundle

# Or manually
cd android && ./gradlew bundleRelease
```

The bundle will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Troubleshooting

### "App not installed" error
- Ensure you have enough storage space
- Uninstall any previous version first: `adb uninstall com.tasknotebook`

### USB debugging not showing device
- Try different USB cable (some cables are charge-only)
- Install device-specific USB drivers on Windows
- Revoke USB debugging authorizations and re-enable

### Build fails
```bash
# Clean and rebuild
make clean
make build-release
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/
│   ├── admin/        # Parent admin screens
│   └── child/        # Child view screens
├── services/         # Business logic
├── context/          # React Context providers
├── utils/            # Utility functions
├── types/            # TypeScript interfaces
└── theme/            # Theming and translations
```

## Language

The app is fully localized in Czech.

## License

Private project.
