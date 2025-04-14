import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from './Main';
import CustomDrawer from './CustomDrawer';
import {
  ChangePasswordStackNavigator,
  ManageUsersStackNavigator,
  MyTaskStackNavigator,
  MyQualityWorksStackNavigator,
  MyWorkPHStackNavigator,
  MyWorkStackNavigator,
  ProfileStackNavigator,
  ProgressStackNavigator,
  ProjectInfoStackNavigator,
  RFIsStackNavigator,
  ReportsStackNavigator,
  MixDesignStackNavigator,
  EquipmentStackNavigator,
} from './StackNavigator';
import ForgotPasswordStep3 from '../../screens/ForgotPassword/Step3';
import {useSelector} from 'react-redux';
import {ROLES} from '../../constants/constants';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const [projectHead, setProjectHead] = useState(false);

  useEffect(() => {
    if (loggedInUser.roles) {
      if (
        loggedInUser.roles
          .split(',')
          .find((role: any) => role === ROLES.PROJECT_HEAD)
      ) {
        setProjectHead(true);
      }
    }
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{drawerStyle: {width: '100%'}}}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Home"
        component={Main}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="SetPassword"
        component={ForgotPasswordStep3}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MyWorkType"
        component={MyWorkStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      {/* {
        !projectHead ? 
        <Drawer.Screen
        name="MyWork"
        component={MyWorkStackNavigator}
        options={{
          headerShown: false
        }}
      />
      :
      <Drawer.Screen
        name="MyWork"
        component={MyWorkPHStackNavigator}
        options={{
          headerShown: false
        }}
      />
      } */}

      <Drawer.Screen
        name="MyTask"
        component={MyTaskStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MyQualityWorks"
        component={MyQualityWorksStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MixDesignListing"
        component={MixDesignStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="EquipmentListing"
        component={EquipmentStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ManageUsers"
        component={ManageUsersStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ReportsDashboard"
        component={ReportsStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Progress"
        component={ProgressStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="RFIsHome"
        component={RFIsStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ProjectInfo"
        component={ProjectInfoStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePasswordStackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
