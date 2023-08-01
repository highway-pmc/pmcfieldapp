import { View, Text, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Screen3 from './Screen3';
import Screen2 from './Screen2';
import Screen1 from './Screen1';
const Bottom = createBottomTabNavigator();
const BottomNavigator = () => {
    return (
        <Bottom.Navigator>
            <Bottom.Screen
                name="Screen1"
                component={Screen1}
                options={{
                    headerShown: false
                }}
            />
            <Bottom.Screen
                name="Screen2"
                component={Screen2}
                options={{
                    headerShown: false
                }}
            />
            <Bottom.Screen
                name="Screen3"
                component={Screen3}
                options={{
                    headerShown: false
                }}
            />
        </Bottom.Navigator>
    );
};

export default BottomNavigator;
