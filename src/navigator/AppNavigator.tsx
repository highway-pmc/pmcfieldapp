import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

// import { DashBoard } from '../screens'
import Home from '../screens/home'
import Dashboard from '../screens/Dashboard/Dashboard'

const AppNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
    )
}

export default AppNavigator
