/**
 * @format
 */

// Must be first import - provides crypto.getRandomValues() for uuid
import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Register background notification handler
// This handles notification events when app is in background or killed
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    // The app will handle navigation when it opens
    // The notification data is available via getInitialNotification()
    console.log('Background notification pressed:', detail.notification?.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
