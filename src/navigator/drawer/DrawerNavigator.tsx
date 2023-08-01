import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from './Main';
import DashboardListing from '../../screens/Dashboard/DashboardListing';
import CustomDrawer from './CustomDrawer';
import MyWork from '../../screens/MyWork/MyWork';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    // drawerContent={props => <CustomDrawer {...props} />}
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={DashboardListing}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="MyWork"
        component={MyWork}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
