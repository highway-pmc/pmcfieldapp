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
  WORK_TYPE,
} from '../../constants/constants';
import {useSelector} from 'react-redux';
import AssignTestClassification from './QualityWorks/AssignTestClassification';
import TileCardComponent from '../Common/TileCardComponent';
import {WORK_MODULE_TYPE} from '../Common/CommonConstantsTypes';

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
    });
  };

  const switchTab = (tabName: any) => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
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
      </View>
      <View style={styles.tabContent}>
        {activeTab === WORK_TYPE.SITE_WORK && (
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
                onPress={() => onPressWorkType(role.workType)}
              />
            ))}
          </View>
        )}
        {activeTab === WORK_TYPE.LAB_WORK && (
          <AssignTestClassification></AssignTestClassification>
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
    margin: 10,
    flexDirection: 'row',
    backgroundColor: '#D2C5FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#F1F1FE',
    borderRadius: 10,
  },
  activeFontColor: {
    color: '#4E36A3',
  },
  activeTabText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    height: '100%',
  },
});

export default WorkType;
