import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../screens/Dashboard/Dashboard'
import MyWork from '../screens/MyWork/MyWork'

const AppNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}} />
            <Stack.Screen name="MyWork" component={MyWork} options={{headerShown: true}} />
        </Stack.Navigator>
    )
}

export default AppNavigator
