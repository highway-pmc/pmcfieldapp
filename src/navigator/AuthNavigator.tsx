import React from 'react'
import { createStackNavigator , TransitionPresets } from '@react-navigation/stack'

import { Login, ForgotPassword } from '../screens'

const AuthNavigator = () => {
    const Stack = createStackNavigator()

    const stackNavigatorOptions = {
        headerShown : null,
        ...TransitionPresets.SlideFromRightIOS
    }

    return (
        <Stack.Navigator screenOptions={stackNavigatorOptions}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
    )
}

export default AuthNavigator