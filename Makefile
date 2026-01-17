# TaskNotebook Makefile
# For WSL development with Windows Android emulator

# Windows paths
WIN_ADB := /mnt/c/Users/berka/AppData/Local/Android/Sdk/platform-tools/adb.exe
WIN_EMU := /mnt/c/Users/berka/AppData/Local/Android/Sdk/emulator/emulator.exe
AVD_NAME := Pixel_6

# Project paths
PROJECT_DIR := /home/berkic/projects/soukrome/TaskNotebook
APK_PATH := $(PROJECT_DIR)/android/app/build/outputs/apk/debug/app-debug.apk
APK_RELEASE_PATH := $(PROJECT_DIR)/android/app/build/outputs/apk/release/app-release.apk
PACKAGE_NAME := com.tasknotebook

.PHONY: help emulator devices port-forward metro build build-release build-bundle install install-release launch start restart stop clean logs status

# Default target
help:
	@echo "TaskNotebook Development Commands"
	@echo "================================="
	@echo ""
	@echo "Quick Start:"
	@echo "  make start      - Full setup: emulator, metro, build, install, launch"
	@echo "  make restart    - Rebuild, reinstall, and launch app"
	@echo "  make reload     - Just restart the app (no rebuild)"
	@echo ""
	@echo "Individual Commands:"
	@echo "  make emulator   - Start Android emulator"
	@echo "  make devices    - List connected devices"
	@echo "  make port       - Setup port forwarding for Metro"
	@echo "  make metro      - Start Metro bundler"
	@echo "  make build      - Build debug APK"
	@echo "  make install    - Install APK on emulator"
	@echo "  make launch     - Launch app on emulator"
	@echo ""
	@echo "Release Builds (for physical devices):"
	@echo "  make build-release   - Build release APK for sideloading"
	@echo "  make build-bundle    - Build AAB bundle for Play Store"
	@echo "  make install-release - Install release APK on connected device"
	@echo ""
	@echo "Utilities:"
	@echo "  make stop       - Stop app and Metro"
	@echo "  make clean      - Clean build files"
	@echo "  make logs       - View React Native logs"
	@echo "  make status     - Check emulator and Metro status"
	@echo "  make uninstall  - Uninstall app from emulator"

# Start Android emulator
emulator:
	@echo "Starting emulator $(AVD_NAME)..."
	@"$(WIN_EMU)" -avd $(AVD_NAME) &
	@echo "Waiting for emulator to boot..."
	@sleep 15
	@"$(WIN_ADB)" wait-for-device
	@echo "Emulator ready!"

# List connected devices
devices:
	@"$(WIN_ADB)" devices -l

# Setup port forwarding
port port-forward:
	@"$(WIN_ADB)" reverse --remove-all 2>/dev/null || true
	@"$(WIN_ADB)" reverse tcp:8081 tcp:8081
	@echo "Port forwarding configured (8081)"

# Start Metro bundler
metro:
	@echo "Starting Metro bundler..."
	@cd $(PROJECT_DIR) && npx react-native start --host 0.0.0.0

# Start Metro in background
metro-bg:
	@echo "Starting Metro bundler in background..."
	@cd $(PROJECT_DIR) && npx react-native start --host 0.0.0.0 &
	@sleep 8
	@echo "Metro started in background"

# Build debug APK
build:
	@echo "Building debug APK..."
	@cd $(PROJECT_DIR)/android && ./gradlew assembleDebug
	@echo "Build complete: $(APK_PATH)"

# Build release APK
build-release:
	@echo "Building release APK..."
	@cd $(PROJECT_DIR)/android && ./gradlew assembleRelease
	@echo "Build complete: $(PROJECT_DIR)/android/app/build/outputs/apk/release/app-release.apk"

# Build release bundle (AAB) for Play Store
build-bundle:
	@echo "Building release bundle (AAB)..."
	@cd $(PROJECT_DIR)/android && ./gradlew bundleRelease
	@echo "Build complete: $(PROJECT_DIR)/android/app/build/outputs/bundle/release/app-release.aab"

# Install APK on emulator
install:
	@echo "Installing APK..."
	@"$(WIN_ADB)" install -r "$$(wslpath -w $(APK_PATH))"
	@echo "App installed!"

# Install release APK on connected device
install-release:
	@echo "Installing release APK..."
	@"$(WIN_ADB)" install -r "$$(wslpath -w $(APK_RELEASE_PATH))"
	@echo "Release app installed!"

# Launch app
launch:
	@echo "Launching app..."
	@"$(WIN_ADB)" shell am start -n $(PACKAGE_NAME)/.MainActivity
	@echo "App launched!"

# Force stop and launch
reload:
	@"$(WIN_ADB)" shell am force-stop $(PACKAGE_NAME)
	@"$(WIN_ADB)" shell am start -n $(PACKAGE_NAME)/.MainActivity
	@echo "App reloaded!"

# Full start: everything from scratch
start:
	@echo "=== Full Start Sequence ==="
	@make devices 2>/dev/null || (echo "Starting emulator..." && make emulator)
	@make port
	@make metro-bg
	@make build
	@make install
	@make launch
	@echo "=== App is running! ==="

# Restart: rebuild and reinstall
restart: build install reload
	@echo "App restarted with fresh build!"

# Stop everything
stop:
	@echo "Stopping app..."
	@"$(WIN_ADB)" shell am force-stop $(PACKAGE_NAME) 2>/dev/null || true
	@echo "Stopping Metro..."
	@pgrep -f "[r]eact-native start" | xargs -r kill 2>/dev/null || true
	@echo "Killing port 8081..."
	@fuser -k 8081/tcp 2>/dev/null || true
	@echo "Stopped!"

# Clean build files
clean:
	@echo "Cleaning build files..."
	@cd $(PROJECT_DIR)/android && ./gradlew clean
	@rm -rf $(PROJECT_DIR)/node_modules/.cache
	@echo "Clean complete!"

# Deep clean (includes node_modules reinstall)
clean-all: clean
	@echo "Removing node_modules..."
	@rm -rf $(PROJECT_DIR)/node_modules
	@echo "Reinstalling dependencies..."
	@cd $(PROJECT_DIR) && npm install
	@echo "Deep clean complete!"

# View logs
logs:
	@"$(WIN_ADB)" logcat *:S ReactNative:V ReactNativeJS:V

# View all logs (verbose)
logs-all:
	@"$(WIN_ADB)" logcat | grep -E "(ReactNative|TaskNotebook)"

# Check status
status:
	@echo "=== Status ==="
	@echo ""
	@echo "Emulator:"
	@"$(WIN_ADB)" devices -l 2>/dev/null || echo "  Not connected"
	@echo ""
	@echo "Port forwarding:"
	@"$(WIN_ADB)" reverse --list 2>/dev/null || echo "  None"
	@echo ""
	@echo "Metro bundler:"
	@curl -s http://localhost:8081/status 2>/dev/null || echo "  Not running"
	@echo ""

# Uninstall app
uninstall:
	@"$(WIN_ADB)" uninstall $(PACKAGE_NAME)
	@echo "App uninstalled!"

# Reset Metro cache
reset-cache:
	@echo "Resetting Metro cache..."
	@cd $(PROJECT_DIR) && npx react-native start --host 0.0.0.0 --reset-cache

# Open React Native dev menu on device
menu:
	@"$(WIN_ADB)" shell input keyevent 82

# Shake device (opens dev menu)
shake: menu
