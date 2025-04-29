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
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.SITE_WORK && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.SITE_WORK)}>
            <Text style={styles.activeTabText}>{WORK_TYPE.SITE_WORK}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === WORK_TYPE.LAB_WORK && styles.activeTab,
            ]}
            onPress={() => switchTab(WORK_TYPE.LAB_WORK)}>
            <Text style={styles.activeTabText}>{WORK_TYPE.LAB_WORK}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContent}>
          {activeTab === WORK_TYPE.SITE_WORK && (
            <View style={styles.rfiTabBar}>
              {roles.map((role: any) => (
                <TileCardComponent
                  title={role.title}
                  content={role.discription}
                  bgColor={role.color}
                  image={role.src}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
  },
  rfiTabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderColor: '#1C58C0',
  },
  activeTabText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderWidth: 1,
    height: '100%',
  },
});

export default WorkType;
