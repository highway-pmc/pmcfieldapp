import { View, Text, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardListing from '../../screens/Dashboard/DashboardListing';
import { NotificationsStackNavigator, RFIsStackNavigator, ReportsStackNavigator } from '../drawer/StackNavigator';
const Bottom = createBottomTabNavigator();
const BottomNavigator = () => {
    return (
        <Bottom.Navigator>
            <Bottom.Screen
                name="Home"
                component={DashboardListing}
                options={{
                    headerShown: false
                }}
            />
            <Bottom.Screen
                name="RFIs"
                component={RFIsStackNavigator}
                options={{
                    headerShown: false
                }}
            />
            <Bottom.Screen
                name="Report"
                component={ReportsStackNavigator}
                options={{
                    headerShown: false
                }}
            />
            <Bottom.Screen
                name="Notifications"
                component={NotificationsStackNavigator}
                options={{
                    headerShown: false
                }}
            />
        </Bottom.Navigator>
    );
};

export default BottomNavigator;
