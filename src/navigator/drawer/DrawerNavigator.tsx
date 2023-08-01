import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from './Main';
import DashboardListing from '../../screens/Dashboard/DashboardListing';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    // drawerContent={props => <CustomDrawer {...props} />}
    <Drawer.Navigator>
      <Drawer.Screen
        name="Main"
        component={Main}
        options={{headerShown: true}}
      />
      <Drawer.Screen
        name="Dashboard"
        component={DashboardListing}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
