import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyWork from "../../screens/MyWork/MyWork";
import MyWork2 from "../../screens/MyWork/MyWork2";
import MyWork3 from "../../screens/MyWork/MyWork3";
import ManageUsers from "../../screens/ManageUsers/ManageUsers";
import Notifications from "../../screens/Notifications/Notifications";
import Progress from "../../screens/Progress/Progress";
import Reports from "../../screens/Reports/Reports";
import RFIsHome from "../../screens/RFIs/RFIsHome";
import Profile from "../../screens/Profile/Profile";
import MyTask from "../../screens/MyTask/MyTask";
import AssignWork from "../../screens/ManageUsers/AssignWork";
import SegmentsList from "../../screens/ManageUsers/SegmentsList";
import ProjectInfo from "../../screens/ProjectInfo/ProjectInfo";
import MyTest from "../../screens/MyTest/MyTest";
import ChangePassword from "../../screens/ChangePassword/ChangePassword";
import SubSegmentsList from "../../screens/ManageUsers/SubSegmentsList";
import MyProjectType from "../../screens/ManageUsers/MyProjectType";
import AssignTasks from "../../screens/ManageUsers/AssignTasks";
import PHMyProjectType from "../../screens/MyWorkProjectHead/PHMyProjectType";
import PHAssignedWork from "../../screens/MyWorkProjectHead/PHAssignedWork";
import PHAssignedTasks from "../../screens/MyWorkProjectHead/PHAssignedTasks";
import PHAssignedSubSegments from "../../screens/MyWorkProjectHead/PHAssignedSubSegments";
import PHAssignedSegments from "../../screens/MyWorkProjectHead/PHAssignedSegments";
import MyWorkProjectType from "../../screens/MyWork/MyWorkProjectType";
import RFIsDashboard from "../../screens/RFIs/RFIsDashboard";
import RFIsUserCategorySelection from "../../screens/RFIs/RFIsUserCategorySelection";

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
      <Stack.Screen name="MyWorkProjectType1" component={MyWorkProjectType} options={{headerShown: false}} />
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

const MyTestStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="MyTest" component={MyTest} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const ManageUsersStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="ManageUsers" component={ManageUsers} options={{headerShown: false}} />
      <Stack.Screen name="MyProjectType" component={MyProjectType} options={{headerShown: false}} />
      <Stack.Screen name="AssignWork" component={AssignWork} options={{headerShown: false}} />
      <Stack.Screen name="SegmentsList" component={SegmentsList} options={{headerShown: false}} />
      <Stack.Screen name="SubSegmentsList" component={SubSegmentsList} options={{headerShown: false}} />
      <Stack.Screen name="AssignTasks" component={AssignTasks} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const MyWorkPHStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="PHMyProjectType" component={PHMyProjectType} options={{headerShown: false}} />
      <Stack.Screen name="PHAssignedWork" component={PHAssignedWork} options={{headerShown: false}} />
      <Stack.Screen name="PHAssignedSegments" component={PHAssignedSegments} options={{headerShown: false}} />
      <Stack.Screen name="PHAssignedSubSegments" component={PHAssignedSubSegments} options={{headerShown: false}} />
      <Stack.Screen name="PHAssignedTasks" component={PHAssignedTasks} options={{headerShown: false}} />
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
      <Stack.Screen name="RFIsHome" component={RFIsHome} options={{headerShown: false}} />
      <Stack.Screen name="RFIsDashboard" component={RFIsDashboard} options={{headerShown: false}} />
      <Stack.Screen name="RFIsUserCategorySelection" component={RFIsUserCategorySelection} options={{headerShown: false}} />
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

const ProjectInfoStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="ProjectInfo" component={ProjectInfo} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const ChangePasswordStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export { MyWorkStackNavigator, MyWorkPHStackNavigator, MyTaskStackNavigator, MyTestStackNavigator, ManageUsersStackNavigator, NotificationsStackNavigator,
  ProgressStackNavigator, ReportsStackNavigator, RFIsStackNavigator, ProfileStackNavigator, ProjectInfoStackNavigator, ChangePasswordStackNavigator };
