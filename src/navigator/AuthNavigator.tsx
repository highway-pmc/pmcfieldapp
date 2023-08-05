import React from 'react'
import { createStackNavigator , TransitionPresets } from '@react-navigation/stack'

import { Login, ForgotPassword } from '../screens'
import ForgotPasswordStep1 from '../screens/ForgotPassword/Step1'
import ForgotPasswordStep2 from '../screens/ForgotPassword/Step2'
import ForgotPasswordStep3 from '../screens/ForgotPassword/Step3'

const AuthNavigator = () => {
    const Stack = createStackNavigator()

    const stackNavigatorOptions = {
        headerShown : null,
        ...TransitionPresets.SlideFromRightIOS
    }

    return (
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
            <Stack.Screen name="ForgotPasswordStep1" component={ForgotPasswordStep1} options={{title: "Back"}} />
            <Stack.Screen name="ForgotPasswordStep2" component={ForgotPasswordStep2} options={{title: "Back"}} />
            <Stack.Screen name="ForgotPasswordStep3" component={ForgotPasswordStep3} options={{title: "Back"}} />
        </Stack.Navigator>
    )
}

export default AuthNavigator