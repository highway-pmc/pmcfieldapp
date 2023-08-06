import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyWork from "../../screens/MyWork/MyWork";
import MyWork2 from "../../screens/MyWork/MyWork2";
import MyWork3 from "../../screens/MyWork/MyWork3";
import ManageUsers from "../../screens/ManageUsers/ManageUsers";
import Notifications from "../../screens/Notifications/Notifications";
import Progress from "../../screens/Progress/Progress";
import Reports from "../../screens/Reports/Reports";
import RFIs from "../../screens/RFIs/RFIs";
import Profile from "../../screens/Profile/Profile";
import MyTask from "../../screens/MyTask/MyTask";

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const MyWorkStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="MyWork" component={MyWork} options={{headerShown: false}} />
      <Stack.Screen name="MyWork2" component={MyWork2} options={{headerShown: false}} />
      <Stack.Screen name="MyWork3" component={MyWork3} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const MyTaskStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="MyTask" component={MyTask} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const ManageUsersStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="ManageUsers" component={ManageUsers} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const NotificationsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Notifications" component={Notifications} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const ProgressStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Progress" component={Progress} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const ReportsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Reports" component={Reports} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const RFIsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="RFIs" component={RFIs} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export { MyWorkStackNavigator, MyTaskStackNavigator, ManageUsersStackNavigator, NotificationsStackNavigator,
  ProgressStackNavigator, ReportsStackNavigator, RFIsStackNavigator, ProfileStackNavigator };
