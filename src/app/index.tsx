import React, { useEffect } from 'react'
// import { store } from 'store'
import { LogBox } from 'react-native'
// import RootNavigator from 'navigator'
import { Provider as ReduxProvider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from '../navigator'
import { store } from '../store'
import SplashScreen from 'react-native-splash-screen';

LogBox.ignoreAllLogs()

const  App = () =>  {
  //Code for Splash Screen
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <SafeAreaProvider>
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default () => (
    <ReduxProvider store={store}>
        <App/>
    </ReduxProvider>
)