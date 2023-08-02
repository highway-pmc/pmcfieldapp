import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../screens/Dashboard/Dashboard'
import { ScrollView } from 'react-native-gesture-handler'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const AppNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    Container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      paddingTop: 15,
      paddingBottom: 15,
      padding: 15,
    },
    TopMenuIcon: {
      width: 28,
      height: 28,
    },
    MenuContainer: {
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center'
    },
    TextBold: {
      fontWeight: '700',
      fontSize: 14,
    },
    HeaderMenuContainer: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'flex-start'
    },
    HeaderTextBold: {
      fontWeight: '700',
      fontSize: 18,
      color: '#333'
    },
    HeaderTopMenuIcon: {
      width: 24,
      height: 24,
      borderWidth: 1,
      marginRight: 5,
    },
  });

export default AppNavigator
