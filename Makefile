# TaskNotebook Makefile
# For WSL development with Windows Android emulator or physical device

# Windows paths
WIN_ADB := /mnt/c/Users/berka/AppData/Local/Android/Sdk/platform-tools/adb.exe
WIN_EMU := /mnt/c/Users/berka/AppData/Local/Android/Sdk/emulator/emulator.exe
AVD_NAME := Pixel_6

# Project paths
PROJECT_DIR := /home/berkic/projects/soukrome/TaskNotebook
APK_PATH := $(PROJECT_DIR)/android/app/build/outputs/apk/debug/app-debug.apk
APK_RELEASE_PATH := $(PROJECT_DIR)/android/app/build/outputs/apk/release/app-release.apk
PACKAGE_NAME := com.tasknotebook

# Device selection (set DEVICE=<serial> to target specific device)
# Leave empty to auto-select first available device
DEVICE ?=

# ADB command with optional device selection
ifdef DEVICE
  ADB := $(WIN_ADB) -s $(DEVICE)
else
  ADB := $(WIN_ADB)
endif

.PHONY: help emulator emu physical devices device-info phone port-forward metro build build-release build-bundle install install-release launch start restart stop clean logs status

# Default target
help:
	@echo "TaskNotebook Development Commands"
	@echo "================================="
	@echo ""
	@echo "Quick Start:"
	@echo "  make start       - Start app: metro, build, install, launch (requires device)"
	@echo "  make restart     - Rebuild, reinstall, and launch app"
	@echo "  make reload      - Just restart the app (no rebuild)"
	@echo ""
	@echo "Device/Emulator Setup (run BEFORE 'make start'):"
	@echo "  make emu         - Start Android Studio emulator"
	@echo "  make emulator    - Alias for 'make emu'"
	@echo "  make physical    - Setup physical device (USB debugging)"
	@echo "  make devices     - List all connected devices"
	@echo "  make device-info - Show detailed info about current target device"
	@echo ""
	@echo "Individual Commands:"
	@echo "  make port        - Setup port forwarding for Metro"
	@echo "  make metro       - Start Metro bundler"
	@echo "  make build       - Build debug APK"
	@echo "  make install     - Install APK on device"
	@echo "  make launch      - Launch app on device"
	@echo ""
	@echo "Release Builds:"
	@echo "  make build-release   - Build release APK for sideloading"
	@echo "  make build-bundle    - Build AAB bundle for Play Store"
	@echo "  make install-release - Install release APK on connected device"
	@echo ""
	@echo "Utilities:"
	@echo "  make stop        - Stop app and Metro"
	@echo "  make clean       - Clean build files"
	@echo "  make logs        - View React Native logs"
	@echo "  make status      - Check device and Metro status"
	@echo "  make uninstall   - Uninstall app from device"
	@echo ""
	@echo "Device Selection:"
	@echo "  Use DEVICE=<serial> to target a specific device when multiple are connected"
	@echo "  Example: make install DEVICE=emulator-5554"
	@echo "  Example: make install DEVICE=RFXXXXXXXX (physical device serial)"
	@echo ""
	@echo "Typical Workflow:"
	@echo "  1. make emu          # Start emulator (or 'make physical' for phone)"
	@echo "  2. make start        # Build and run app"
	@echo "  3. make restart      # After code changes"

# Start Android Studio emulator
emu emulator:
	@echo "=== Starting Android Studio Emulator ==="
	@echo "AVD: $(AVD_NAME)"
	@echo ""
	@# Check if emulator is already running
	@if "$(WIN_ADB)" devices | grep -q "emulator-"; then \
		echo "Emulator already running!"; \
		"$(WIN_ADB)" devices -l | grep "emulator-"; \
	else \
		echo "Starting emulator..."; \
		"$(WIN_EMU)" -avd $(AVD_NAME) & \
		echo "Waiting for emulator to boot..."; \
		sleep 15; \
		"$(WIN_ADB)" wait-for-device; \
		echo ""; \
		echo "Emulator ready!"; \
	fi
	@echo ""
	@echo "Next step: run 'make start' to build and launch the app"

# Setup physical device connection (USB debugging)
physical phone:
	@echo "=== Physical Device Setup ==="
	@echo ""
	@echo "Prerequisites:"
	@echo "  1. Enable Developer Options on your phone"
	@echo "  2. Enable USB Debugging in Developer Options"
	@echo "  3. Connect phone via USB cable"
	@echo "  4. Accept 'Allow USB debugging' prompt on phone"
	@echo ""
	@echo "Starting ADB server..."
	@"$(WIN_ADB)" start-server
	@echo ""
	@echo "Connected devices:"
	@"$(WIN_ADB)" devices -l
	@echo ""
	@if "$(WIN_ADB)" devices | grep -q "device$$"; then \
		echo "✓ Device connected and ready!"; \
		echo ""; \
		echo "Device info:"; \
		"$(WIN_ADB)" shell getprop ro.product.model 2>/dev/null | xargs -I {} echo "  Model: {}"; \
		"$(WIN_ADB)" shell getprop ro.build.version.release 2>/dev/null | xargs -I {} echo "  Android: {}"; \
		echo ""; \
		echo "Next step: run 'make start' to build and launch the app"; \
	else \
		echo "✗ No device found. Please check:"; \
		echo "  - USB cable is connected"; \
		echo "  - USB debugging is enabled"; \
		echo "  - You accepted the debugging prompt on phone"; \
	fi

# Show detailed device info
device-info:
	@echo "=== Device Information ==="
ifdef DEVICE
	@echo "Target device: $(DEVICE)"
else
	@echo "Target device: auto (first available)"
endif
	@echo ""
	@if "$(ADB)" get-state 1>/dev/null 2>&1; then \
		echo "Status: Connected"; \
		echo ""; \
		echo "Details:"; \
		"$(ADB)" shell getprop ro.product.model 2>/dev/null | xargs -I {} echo "  Model: {}"; \
		"$(ADB)" shell getprop ro.product.manufacturer 2>/dev/null | xargs -I {} echo "  Manufacturer: {}"; \
		"$(ADB)" shell getprop ro.build.version.release 2>/dev/null | xargs -I {} echo "  Android Version: {}"; \
		"$(ADB)" shell getprop ro.build.version.sdk 2>/dev/null | xargs -I {} echo "  API Level: {}"; \
		"$(ADB)" shell getprop ro.serialno 2>/dev/null | xargs -I {} echo "  Serial: {}"; \
		TRANSPORT=$$("$(ADB)" devices -l | grep -E "^[^ ]+" | head -1); \
		if echo "$$TRANSPORT" | grep -q "emulator"; then \
			echo "  Type: Emulator"; \
		else \
			echo "  Type: Physical Device"; \
		fi; \
	else \
		echo "Status: Not connected"; \
		echo "Run 'make devices' to see available devices"; \
	fi

# List connected devices
devices:
	@echo "=== Connected Devices ==="
	@"$(WIN_ADB)" devices -l
	@echo ""
	@DEVICE_COUNT=$$("$(WIN_ADB)" devices | grep -c "device$$" || echo 0); \
	if [ "$$DEVICE_COUNT" -eq 0 ]; then \
		echo "No devices connected."; \
		echo "  - Run 'make emulator' to start the emulator"; \
		echo "  - Run 'make phone' to setup a physical device"; \
	elif [ "$$DEVICE_COUNT" -gt 1 ]; then \
		echo "Multiple devices connected ($$DEVICE_COUNT)."; \
		echo "Use DEVICE=<serial> to target a specific device."; \
	fi

# Setup port forwarding
port port-forward:
	@"$(ADB)" reverse --remove-all 2>/dev/null || true
	@"$(ADB)" reverse tcp:8081 tcp:8081
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

# Install APK on device (auto-selects emulator if multiple devices and no DEVICE specified)
install:
	@echo "Installing APK..."
ifndef DEVICE
	@if [ $$($(WIN_ADB) devices | grep -c "device$$") -gt 1 ]; then \
		EMU=$$($(WIN_ADB) devices | grep "emulator-" | head -1 | cut -f1); \
		echo "Multiple devices, using emulator: $$EMU"; \
		$(WIN_ADB) -s $$EMU install -r "$$(wslpath -w $(APK_PATH))"; \
	else \
		$(ADB) install -r "$$(wslpath -w $(APK_PATH))"; \
	fi
else
	@"$(ADB)" install -r "$$(wslpath -w $(APK_PATH))"
endif
	@echo "App installed!"

# Install release APK on device
install-release:
	@echo "Installing release APK..."
	@"$(ADB)" install -r "$$(wslpath -w $(APK_RELEASE_PATH))"
	@echo "Release app installed!"

# Launch app (auto-selects emulator if multiple devices)
launch:
	@echo "Launching app..."
ifndef DEVICE
	@if [ $$($(WIN_ADB) devices | grep -c "device$$") -gt 1 ]; then \
		EMU=$$($(WIN_ADB) devices | grep "emulator-" | head -1 | cut -f1); \
		$(WIN_ADB) -s $$EMU shell am start -n $(PACKAGE_NAME)/.MainActivity; \
	else \
		$(ADB) shell am start -n $(PACKAGE_NAME)/.MainActivity; \
	fi
else
	@"$(ADB)" shell am start -n $(PACKAGE_NAME)/.MainActivity
endif
	@echo "App launched!"

# Force stop and launch (auto-selects emulator if multiple devices)
reload:
ifndef DEVICE
	@if [ $$($(WIN_ADB) devices | grep -c "device$$") -gt 1 ]; then \
		EMU=$$($(WIN_ADB) devices | grep "emulator-" | head -1 | cut -f1); \
		$(WIN_ADB) -s $$EMU shell am force-stop $(PACKAGE_NAME); \
		$(WIN_ADB) -s $$EMU shell am start -n $(PACKAGE_NAME)/.MainActivity; \
	else \
		$(ADB) shell am force-stop $(PACKAGE_NAME); \
		$(ADB) shell am start -n $(PACKAGE_NAME)/.MainActivity; \
	fi
else
	@"$(ADB)" shell am force-stop $(PACKAGE_NAME)
	@"$(ADB)" shell am start -n $(PACKAGE_NAME)/.MainActivity
endif
	@echo "App reloaded!"

# Start app (requires device/emulator to be already running)
# Run 'make emu' or 'make physical' first
start:
	@echo "=== Starting App ==="
	@# Check if any device is connected
	@if ! "$(WIN_ADB)" devices | grep -q "device$$"; then \
		echo "Error: No device connected!"; \
		echo ""; \
		echo "Please connect a device first:"; \
		echo "  make emu       - Start Android Studio emulator"; \
		echo "  make physical  - Setup physical device (USB)"; \
		exit 1; \
	fi
	@# Show connected device
	@echo "Device:"
	@"$(WIN_ADB)" devices -l | grep "device " | head -1
	@echo ""
	@# Stop any existing Metro
	@pgrep -f "[r]eact-native start" | xargs -r kill 2>/dev/null || true
	@fuser -k 8081/tcp 2>/dev/null || true
	@sleep 1
	@# Setup port forwarding
	@"$(ADB)" reverse --remove-all 2>/dev/null || true
	@"$(ADB)" reverse tcp:8081 tcp:8081
	@echo "Port forwarding configured"
	@# Start Metro in background
	@echo "Starting Metro bundler..."
	@cd $(PROJECT_DIR) && npx react-native start --host 0.0.0.0 &
	@sleep 8
	@echo "Metro started"
	@# Build and install
	@make build
	@make install
	@make launch
	@echo ""
	@echo "=== App is running! ==="

# Restart: rebuild and reinstall (auto-selects emulator if multiple devices)
restart:
	@make build
	@# If multiple devices, target emulator by default
	@if [ $$($(WIN_ADB) devices | grep -c "device$$") -gt 1 ]; then \
		EMU=$$($(WIN_ADB) devices | grep "emulator-" | head -1 | cut -f1); \
		echo "Multiple devices detected, using emulator: $$EMU"; \
		$(WIN_ADB) -s $$EMU install -r "$$(wslpath -w $(APK_PATH))"; \
		$(WIN_ADB) -s $$EMU shell am force-stop $(PACKAGE_NAME); \
		$(WIN_ADB) -s $$EMU shell am start -n $(PACKAGE_NAME)/.MainActivity; \
	else \
		$(ADB) install -r "$$(wslpath -w $(APK_PATH))"; \
		$(ADB) shell am force-stop $(PACKAGE_NAME); \
		$(ADB) shell am start -n $(PACKAGE_NAME)/.MainActivity; \
	fi
	@echo "App restarted with fresh build!"

# Stop everything
stop:
	@echo "Stopping app..."
	@"$(ADB)" shell am force-stop $(PACKAGE_NAME) 2>/dev/null || true
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
	@"$(ADB)" logcat *:S ReactNative:V ReactNativeJS:V

# View all logs (verbose)
logs-all:
	@"$(ADB)" logcat | grep -E "(ReactNative|TaskNotebook)"

# Check status
status:
	@echo "=== Status ==="
	@echo ""
	@echo "Connected Devices:"
	@"$(WIN_ADB)" devices -l 2>/dev/null || echo "  None"
	@echo ""
ifdef DEVICE
	@echo "Target device: $(DEVICE)"
else
	@echo "Target device: auto (first available)"
endif
	@echo ""
	@echo "Port forwarding:"
	@"$(ADB)" reverse --list 2>/dev/null || echo "  None"
	@echo ""
	@echo "Metro bundler:"
	@curl -s http://localhost:8081/status 2>/dev/null || echo "  Not running"
	@echo ""

# Uninstall app
uninstall:
	@"$(ADB)" uninstall $(PACKAGE_NAME)
	@echo "App uninstalled!"

# Reset Metro cache
reset-cache:
	@echo "Resetting Metro cache..."
	@cd $(PROJECT_DIR) && npx react-native start --host 0.0.0.0 --reset-cache

# Open React Native dev menu on device
menu:
	@"$(ADB)" shell input keyevent 82

# Shake device (opens dev menu)
shake: menu
