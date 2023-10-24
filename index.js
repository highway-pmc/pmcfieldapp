/**
 * @format
 */

import { AppRegistry, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { name as appName } from './app.json';
import App from './src/app';
import { useEffect } from 'react';

/*
{notification:{
    body:"",
        title:""
}}
*/
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    Alert.alert('Message handled in the background!', JSON.stringify(remoteMessage));
});

// Register kill-state handler
messaging().getInitialNotification(async remoteMessage => {
    Alert.alert('Message handled in the kill state!', JSON.stringify(remoteMessage));
});

messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
});

AppRegistry.registerComponent(appName, () => App);
