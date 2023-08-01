import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from './Main';
import DashboardListing from '../../screens/Dashboard/DashboardListing';
import CustomDrawer from './CustomDrawer';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    // drawerContent={props => <CustomDrawer {...props} />}
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={DashboardListing}
        options={{headerShown: true}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
