import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from './Main';
import CustomDrawer from './CustomDrawer';
import { MyWorkStackNavigator } from './StackNavigator';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}></CustomDrawer>}>
      <Drawer.Screen
        name="Home"
        component={Main}
        options={{
           headerShown: false
        }}
    />
      <Drawer.Screen
        name="MyWork"
        component={MyWorkStackNavigator}
        options={{
          headerShown: false
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
