/**
 * @format
 */

import { AppRegistry, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { name as appName } from './app.json';
import App from './src/app';

/*
{notification:{
    body:"",
        title:""
}}
*/
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    Alert.alert('RFIs Notification', remoteMessage.notification?.body);
});

// Register kill-state handler
messaging().getInitialNotification(async remoteMessage => {
    Alert.alert('RFIs Notification', remoteMessage.notification?.body);
});

messaging().onMessage(async remoteMessage => {
    //console.log('Additional data==============', remoteMessage.data?.data);
    Alert.alert('RFIs Notification', remoteMessage.notification?.body);
});

AppRegistry.registerComponent(appName, () => App);
