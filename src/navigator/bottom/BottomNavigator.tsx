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
                    headerShown: false,
                    tabBarLabelStyle: {fontSize: 12, fontWeight: '400'},
                    tabBarIcon: tabInfo => {
                        return (
                          <Image
                            source={require('./../../images/home-icon.png')}
                            style={{
                              width: 24,
                              height: 24,
                              tintColor: tabInfo.focused ? '#1C58C0' : '#7B8D9E',
                            }}
                          />
                        );
                      },
                }}
            />
            <Bottom.Screen
                name="RFIs"
                component={RFIsStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabelStyle: {fontSize: 12, fontWeight: '400'},
                    tabBarIcon: tabInfo => {
                        return (
                          <Image
                            source={require('./../../images/rfi-icon.png')}
                            style={{
                              width: 24,
                              height: 24,
                              tintColor: tabInfo.focused ? '#1C58C0' : '#7B8D9E',
                            }}
                          />
                        );
                      },
                }}
            />
            <Bottom.Screen
                name="Report"
                component={ReportsStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabelStyle: {fontSize: 12, fontWeight: '400'},
                    tabBarIcon: tabInfo => {
                        return (
                          <Image
                            source={require('./../../images/report-icon.png')}
                            style={{
                              width: 24,
                              height: 24,
                              tintColor: tabInfo.focused ? '#1C58C0' : '#7B8D9E',
                            }}
                          />
                        );
                      },
                }}
            />
            <Bottom.Screen
                name="Notifications"
                component={NotificationsStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabelStyle: {fontSize: 12, fontWeight: '400'},
                    tabBarIcon: tabInfo => {
                        return (
                          <Image
                            source={require('./../../images/notification-icon.png')}
                            style={{
                              width: 24,
                              height: 24,
                              tintColor: tabInfo.focused ? '#1C58C0' : '#7B8D9E',
                            }}
                          />
                        );
                      },
                }}
            />
        </Bottom.Navigator>
    );
};

export default BottomNavigator;
