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

LogBox.ignoreAllLogs()

const App = () => {
  //Code for Splash Screen
  useEffect(() => {
    SplashScreen.hide();
    //console.log("==================");
    //getDeviceToken();

  }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);

  // const getDeviceToken = async() => {
  //   let token = await messaging().getToken();
  //   console.log(token);
  // }
  const [generatedLink, setGeneratedLink] = useState("");
  const buildLink = async () => {
    const link = await dynamicLinks().buildLink({
      link: 'https://invertase.io/offer',
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://deeplinkhighwaypmc.page.link',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });

    setGeneratedLink(link);
  }

  const handleDynamicLink = (link: any) => {
    // Handle dynamic link inside your own application
    if (link.url === 'https://invertase.io/offer') {
      // ...navigate to your offers screen
      Alert.alert('Matched 1');
    }
  };

  // Foreground events
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);


  // Background/Quit events
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        if (link.url === 'https://invertase.io/offer') {
          // ...set initial route as offers screen
          Alert.alert('Matched 2');
        }
      });
  }, []);

  return (
    <SafeAreaProvider>
      {/* <NavigationContainer>
            <RootNavigator />
        </NavigationContainer> */}
      {/* <RootContainer></RootContainer> */}
      <Text>Welcome</Text>
      <Text>{generatedLink}</Text>

      <TouchableOpacity onPress={() => {
        buildLink();
      }}>
        <Text >Generate</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        Clipboard.setString(generatedLink);
      }}>
        <Text >Copy</Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  )
}

export default () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
)