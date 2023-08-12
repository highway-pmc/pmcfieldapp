import React, { useEffect, useState } from 'react'
// import { store } from 'store'
import { Alert, LogBox, Text, TouchableOpacity } from 'react-native'
// import RootNavigator from 'navigator'
import { Provider as ReduxProvider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from '../navigator'
import { store } from '../store'
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from '@react-native-clipboard/clipboard'
import {dbMigrations} from '../database/dbmigrations'
import { schema } from '../database/schema'
import { db } from '../database/db'
import { users } from '../models/users'

LogBox.ignoreAllLogs()

const App = () => {
  useEffect(() => {
    setUpDb();
  }, []);

  const setUpDb = () => {
    schema.connect(dbMigrations.config).runMigrations(() => {
      SplashScreen.hide();
      console.log("Db migrations scripts executed!");
    });

    //schema.resetDb(dbMigrations.config);
  }

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
    <App />
  </ReduxProvider>
)