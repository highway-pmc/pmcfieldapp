/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { name as appName } from './app.json';
import App from './src/app';


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

// Register kill-state handler
messaging().getInitialNotification(async remoteMessage => {
    console.log('Message handled in the kill state!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
