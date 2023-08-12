import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Main from './Main';
import CustomDrawer from './CustomDrawer';
import { ManageUsersStackNavigator, MyTaskStackNavigator, MyWorkStackNavigator, ProfileStackNavigator, ProgressStackNavigator, RFIsStackNavigator, ReportsStackNavigator } from './StackNavigator';
import ForgotPasswordStep3 from '../../screens/ForgotPassword/Step3';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ drawerStyle: { width: '100%' } }} drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Home"
        component={Main}
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="SetPassword"
        component={ForgotPasswordStep3}
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
      <Drawer.Screen
        name="MyTask"
        component={MyTaskStackNavigator}
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="ManageUsers"
        component={ManageUsersStackNavigator}
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsStackNavigator}
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="Progress"
        component={ProgressStackNavigator}
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="RFIs"
        component={RFIsStackNavigator}
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          headerShown: false
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
