import React, { useEffect } from 'react'
// import { store } from 'store'
import { Alert, LogBox, Text } from 'react-native'
// import RootNavigator from 'navigator'
import { Provider as ReduxProvider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from '../navigator'
import { store } from '../store'
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging'

LogBox.ignoreAllLogs()

const  App = () =>  {
  //Code for Splash Screen
  useEffect(() => {
    SplashScreen.hide();
    console.log("==================");
    getDeviceToken();

  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const getDeviceToken = async() => {
    let token = await messaging().getToken();
    console.log(token);
  }

  return (
    <SafeAreaProvider>
        {/* <NavigationContainer>
            <RootNavigator />
        </NavigationContainer> */}
        {/* <RootContainer></RootContainer> */}
        <Text>Welcome</Text>
    </SafeAreaProvider>
  )
}

export default () => (
    <ReduxProvider store={store}>
        <App/>
    </ReduxProvider>
)