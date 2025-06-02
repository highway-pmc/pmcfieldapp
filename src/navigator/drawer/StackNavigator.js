import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MyWork from '../../screens/MyWork/MyWork';
import MyWork2 from '../../screens/MyWork/MyWork2';
import MyWork3 from '../../screens/MyWork/MyWork3';
import ManageUsers from '../../screens/ManageUsers/ManageUsers';
import Notifications from '../../screens/Notifications/Notifications';
import Progress from '../../screens/Progress/Progress';
import Reports from '../../screens/Reports/ReportsFieldWork';
import RFIsHome from '../../screens/RFIs/RFIsHome';
import Profile from '../../screens/Profile/Profile';
import MyTask from '../../screens/MyTask/MyTask';
import AssignWork from '../../screens/ManageUsers/AssignWork';
import SegmentsList from '../../screens/ManageUsers/SegmentsList';
import ProjectInfo from '../../screens/ProjectInfo/ProjectInfo';
import ChangePassword from '../../screens/ChangePassword/ChangePassword';
import ComponentsList from '../../screens/ManageUsers/ComponentsList';
import WorkType from '../../screens/ManageUsers/WorkType';
import AssignTasks from '../../screens/ManageUsers/AssignTasks';
import PHWorkType from '../../screens/MyWorkProjectHead/PHWorkType';
import PHAssignedWork from '../../screens/MyWorkProjectHead/PHAssignedWork';
import PHAssignedTasks from '../../screens/MyWorkProjectHead/PHAssignedTasks';
import PHAssignedComponents from '../../screens/MyWorkProjectHead/PHAssignedComponents';
import PHAssignedSegments from '../../screens/MyWorkProjectHead/PHAssignedSegments';
import MyWorkType from '../../screens/MyWork/MyWorkType';
import RFIsDashboard from '../../screens/RFIs/RFIsDashboard';
import RFIsGenerateMyWork from '../../screens/RFIs/RFIsGenerateMyWork';
import SubComponentsList from '../../screens/ManageUsers/SubComponentsList';
import MyQualityWorks from '../../screens/MyWork/MyQualityWorks';
import MixDesign from '../../screens/MyWork/MixDesign';
import MixDesignListing from '../../screens/MyWork/MixDesignListing';
import EquipmentCalibration from '../../screens/ManageUsers/QualityWorks/Equipment/EquipmentCalibration';
import AssignTestWorkCategory from '../../screens/ManageUsers/QualityWorks/AssignTestWorkCategory';
import AssignTestMaterials from '../../screens/ManageUsers/QualityWorks/AssignTestMaterials';
import AssignTestTypes from '../../screens/ManageUsers/QualityWorks/AssignTestTypes';
import SourceApprovals from '../../screens/ManageUsers/QualityWorks/SourceApprovals';
import Procurements from '../../screens/ManageUsers/QualityWorks/Procurements';
import ReportsDashboard from '../../screens/Reports/ReportDashboard';
import ReportsFieldWork from '../../screens/Reports/ReportsFieldWork';
import SelectTestWorkCategory from '../../screens/ManageUsers/QualityWorks/SelectTestWorkCategory';
import ProcurementsBitnumiousWork from '../../screens/ManageUsers/QualityWorks/ProcurementsBitnumiousWork';
import ProcurementsEarthWork from '../../screens/ManageUsers/QualityWorks/ProcurementsEarthWork';
import RFIsGenerateMyQuality from '../../screens/RFIs/RFIsGenerateMyQuality';
import ProcurementsBearings from '../../screens/ManageUsers/QualityWorks/ProcurementsBearing';
import ProcurementsSteel from '../../screens/ManageUsers/QualityWorks/ProcurementsSteel';
import ProcurementsExpansionJoints from '../../screens/ManageUsers/QualityWorks/ProcurementsExpansionJoint';
import ProcurementsPrestressing from '../../screens/ManageUsers/QualityWorks/ProcurementsPreStressing';
import EquipmentCalibrationListing from '../../screens/ManageUsers/QualityWorks/Equipment/EquipmentCalibrationListing';
import Equipment from '../../screens/ManageUsers/QualityWorks/Equipment/EquipmentAdd';
import EquipmentListing from '../../screens/ManageUsers/QualityWorks/Equipment/EquipmentListing';
import StoreHome from '../../screens/Store/StoreHome';
import AddPurchase from '../../screens/Store/AddPurchase';
import MixDesignCategoryList from '../../screens/MyWork/MixDesignCategory';
const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#9AC4F8',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const MyWorkStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="MyWorkType1"
        component={MyWorkType}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyWork"
        component={MyWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyWork2"
        component={MyWork2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyWork3"
        component={MyWork3}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const MyTaskStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="MyTask"
        component={MyTask}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const MyQualityWorksStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="MyQualityWorks"
        component={MyQualityWorks}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectTestWorkCategory"
        component={SelectTestWorkCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssignTestMaterialsPurchage"
        component={AssignTestMaterials}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SourceApprovals"
        component={SourceApprovals}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Procurements"
        component={Procurements}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProcurementsBitnumiousWork"
        component={ProcurementsBitnumiousWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProcurementsEarthWork"
        component={ProcurementsEarthWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProcurementsBearings"
        component={ProcurementsBearings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProcurementsSteel"
        component={ProcurementsSteel}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProcurementsExpansionJoints"
        component={ProcurementsExpansionJoints}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProcurementsPrestressing"
        component={ProcurementsPrestressing}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const EquipmentStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="EquipmentListing"
        component={EquipmentListing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Equipment"
        component={Equipment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EquipmentCalibration"
        component={EquipmentCalibration}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EquipmentCalibrationListing"
        component={EquipmentCalibrationListing}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
const StoreStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Store"
        component={StoreHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddPurchase"
        component={AddPurchase}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
const MixDesignStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="MixDesignListing"
        component={MixDesignListing}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="MixDesign"
        component={MixDesign}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MixDesignCategoryList"
        component={MixDesignCategoryList}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
const ManageUsersStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WorkType"
        component={WorkType}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssignWork"
        component={AssignWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SegmentsList"
        component={SegmentsList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ComponentsList"
        component={ComponentsList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SubComponentsList"
        component={SubComponentsList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssignTasks"
        component={AssignTasks}
        options={{headerShown: false}}
      />

      {/* <Stack.Screen name="AssignWork" component={AssignWork} options={{headerShown: false}} /> */}
      <Stack.Screen
        name="AssignTestWorkCategory"
        component={AssignTestWorkCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssignTestMaterials"
        component={AssignTestMaterials}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssignTestTypes"
        component={AssignTestTypes}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen name="SourceApprovals" component={SourceApprovals} options={{headerShown: false}} />
      <Stack.Screen name="Procurements" component={Procurements} options={{headerShown: false}} /> */}
    </Stack.Navigator>
  );
};

const MyWorkPHStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="PHWorkType"
        component={PHWorkType}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PHAssignedWork"
        component={PHAssignedWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PHAssignedSegments"
        component={PHAssignedSegments}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PHAssignedComponents"
        component={PHAssignedComponents}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PHAssignedTasks"
        component={PHAssignedTasks}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const NotificationsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const ProgressStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Progress"
        component={Progress}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const ReportsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="ReportsDashboard"
        component={ReportsDashboard}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen name="ReportsFieldWork" component={ReportsFieldWork} options={{headerShown: false}} /> */}
    </Stack.Navigator>
  );
};

const RFIsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="RFIsHome"
        component={RFIsHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RFIsDashboard"
        component={RFIsDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RFIsGenerateMyWork"
        component={RFIsGenerateMyWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RFIsGenerateMyQuality"
        component={RFIsGenerateMyQuality}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const ProjectInfoStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="ProjectInfo"
        component={ProjectInfo}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const ChangePasswordStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export {
  MyWorkStackNavigator,
  MyWorkPHStackNavigator,
  MyTaskStackNavigator,
  MixDesignStackNavigator,
  MyQualityWorksStackNavigator,
  ManageUsersStackNavigator,
  NotificationsStackNavigator,
  ProgressStackNavigator,
  ReportsStackNavigator,
  RFIsStackNavigator,
  ProfileStackNavigator,
  ProjectInfoStackNavigator,
  ChangePasswordStackNavigator,
  EquipmentStackNavigator,
  StoreStackNavigator,
};
