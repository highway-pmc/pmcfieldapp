import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderItems,
  PROJECT_TYPE,
  ROLES,
  TASK_CATEGORY,
  WORK_TYPE,
} from '../../constants/constants';
import {useSelector} from 'react-redux';
import AssignTestClassification from './QualityWorks/AssignTestClassification';
import TileCardComponent from '../Common/TileCardComponent';
import {WORK_MODULE_TYPE} from '../Common/CommonConstantsTypes';
import AssignSurveyUsers from './AssignSurveyUsers';
import AssignStoreUsers from './AssignStoreUsers';
import AssignProductionUsers from './AssignProductionUsers';
import AssignEquipmentUsers from './AssignEquipmentUsers';

const WorkType = ({navigation}: {navigation: any}) => {
  const [projectHead, setProjectHead] = useState(false);
  const [roles, setRoles] = useState([]);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  const [activeTab, setActiveTab] = useState(WORK_TYPE.SITE_WORK);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.manageWork);
  }

  useEffect(() => {
    setRoles([]);
    let rolesArr: any = [];
    if (loggedInUser.roles) {
      //loggedInUser.roles = 'structure-head,highway-head';
      if (
        loggedInUser.roles
          .split(',')
          .find((role: any) => role === ROLES.PROJECT_HEAD)
      ) {
        rolesArr = WORK_MODULE_TYPE;
        setProjectHead(true);
      } else {
        loggedInUser.roles.split(',').forEach((role: any) => {
          if (role === ROLES.STRUCTURE_HEAD) {
            rolesArr.push({
              title: 'Structure',
              workType: PROJECT_TYPE.STRUCTURE_WORK,
            });
          } else if (role === ROLES.HIGHWAY_HEAD) {
            rolesArr.push({
              title: 'Highway',
              workType: PROJECT_TYPE.HIGHWAY_WORK,
            });
          } else if (role === ROLES.OTHER_WORF_HEAD) {
            rolesArr.push({
              title: 'Other',
              workType: PROJECT_TYPE.OTHER_WORK,
            });
          } else if (role === ROLES.SURVEY_HEAD) {
            rolesArr.push({
              title: 'Survey',
              workType: PROJECT_TYPE.SURVEY_WORK,
            });
          }
        });
      }
    }

    if (rolesArr.length === 1) {
      onPressWorkType(rolesArr[0].workType);
      return;
    }
    setRoles(rolesArr);
  }, []);

  const onPressWorkType = (workType: any) => {
    navigation.navigate('AssignWork', {
      workType: workType,
      taskCategory:
        activeTab === WORK_TYPE.SITE_WORK
          ? TASK_CATEGORY.MY_WORK
          : activeTab === WORK_TYPE.SURVEY_WORK
          ? TASK_CATEGORY.SURVEY
          : activeTab === WORK_TYPE.CASTING_YARD
          ? TASK_CATEGORY.CASTING_YARD
          : '',
    });
  };

  const switchTab = (tabName: any) => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.SITE_WORK && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.SITE_WORK)}>
            <Text
              style={[
                styles.activeTabText,
                activeTab === WORK_TYPE.SITE_WORK && styles.activeFontColor,
              ]}>
              {WORK_TYPE.SITE_WORK}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.LAB_WORK && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.LAB_WORK)}>
            <Text
              style={[
                styles.activeTabText,
                activeTab === WORK_TYPE.LAB_WORK && styles.activeFontColor,
              ]}>
              {WORK_TYPE.LAB_WORK}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.SURVEY_WORK && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.SURVEY_WORK)}>
            <Text
              style={[
                styles.activeTabText,
                activeTab === WORK_TYPE.SURVEY_WORK && styles.activeFontColor,
              ]}>
              {WORK_TYPE.SURVEY_WORK}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.STORE_WORK && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.STORE_WORK)}>
            <Text
              style={[
                styles.activeTabText,
                activeTab === WORK_TYPE.STORE_WORK && styles.activeFontColor,
              ]}>
              {WORK_TYPE.STORE_WORK}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.PRODUCTION_WORK && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.PRODUCTION_WORK)}>
            <Text
              style={[
                styles.activeTabText,
                activeTab === WORK_TYPE.PRODUCTION_WORK &&
                  styles.activeFontColor,
              ]}>
              {WORK_TYPE.PRODUCTION_WORK}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.CASTING_YARD && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.CASTING_YARD)}>
            <Text
              style={[
                styles.activeTabText,
                activeTab === WORK_TYPE.CASTING_YARD && styles.activeFontColor,
              ]}>
              {WORK_TYPE.CASTING_YARD}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.EQUIPMENTS_WORK && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.EQUIPMENTS_WORK)}>
            <Text
              style={[
                styles.activeTabText,
                activeTab === WORK_TYPE.EQUIPMENTS_WORK &&
                  styles.activeFontColor,
              ]}>
              {WORK_TYPE.EQUIPMENTS_WORK}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.tabContent}>
        {(activeTab === WORK_TYPE.SITE_WORK ||
          activeTab === WORK_TYPE.CASTING_YARD) && (
          <View style={styles.rfiTabBar}>
            {roles.map((role: any, index: number) => (
              <TileCardComponent
                key={index}
                title={role.title}
                workType={role.workType}
                bgColor={role.backgroundColor}
                imageBg={role.imageBg}
                linearLight={role.linearLight}
                linearDark={role.linearDark}
                image={role.src}
                generatedTask={role.generatedTask}
                inProgressTask={role.inProgressTask}
                closedTask={role.closedTask}
                rejected={role.rejected}
                borderColor={role.borderColor}
                onPress={() => onPressWorkType(role.workType)}
              />
            ))}
          </View>
        )}
        {activeTab === WORK_TYPE.LAB_WORK && (
          <AssignTestClassification></AssignTestClassification>
        )}
        {activeTab === WORK_TYPE.SURVEY_WORK && (
          <AssignSurveyUsers></AssignSurveyUsers>
        )}
        {activeTab === WORK_TYPE.STORE_WORK && (
          <AssignStoreUsers></AssignStoreUsers>
        )}
        {activeTab === WORK_TYPE.PRODUCTION_WORK && (
          <AssignProductionUsers></AssignProductionUsers>
        )}
        {activeTab === WORK_TYPE.EQUIPMENTS_WORK && (
          <AssignEquipmentUsers></AssignEquipmentUsers>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  rfiTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 5,
  },
  rfiTab: {
    width: 180,
    height: 180,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7C7C7',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTab: {
    backgroundColor: '#1C58C0',
  },
  tabText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#D2C5FF',
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    color: '#666666BF',
  },
  activeTab: {
    borderCurve: 'circular',
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderColor: '#5A2AAF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  activeFontColor: {
    color: '#5A2AAF',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#666666BF',
    fontSize: 16,
    fontWeight: '400',
  },
  tabContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
    height: '100%',
  },
});

export default WorkType;
