import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, TouchableOpacity  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, ROLES } from "../../constants/constants"
import { useSelector } from 'react-redux';

const WorkType = ({navigation}: {navigation: any}) => {
  const [projectHead, setProjectHead] = useState(false);
  const [roles, setRoles] = useState([]);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.manageWork);
  }

  useEffect(() => {
    setRoles([]);
    let rolesArr: any = [];
    if(loggedInUser.roles) {
      //loggedInUser.roles = 'structure-head,highway-head';
      if (loggedInUser.roles.split(',').find((role: any) => role === ROLES.PROJECT_HEAD)) {
        rolesArr = [
          {
            title: 'Structure',
            projectType: PROJECT_TYPE.STRUCTURE_WORK,
            color: '#1C58C0'
          },
          {
            title: 'Highway',
            projectType: PROJECT_TYPE.HIGHWAY_WORK,
            color: '#ffa879'
          },
          {
            title: 'Other',
            projectType: PROJECT_TYPE.OTHER_WORK,
            color: '#FCB700'
          }
        ];
        setProjectHead(true);
      } else {
        loggedInUser.roles.split(',').forEach((role: any) => {
          if (role === ROLES.STRUCTURE_HEAD) {
            rolesArr.push(
              {
                title: 'Structure',
                projectType: PROJECT_TYPE.STRUCTURE_WORK
              }
            );
          } else if (role === ROLES.HIGHWAY_HEAD) {
            rolesArr.push(
              {
                title: 'Highway',
                projectType: PROJECT_TYPE.HIGHWAY_WORK
              }
            );
          } else if (role === ROLES.OTHER_WORF_HEAD) {
            rolesArr.push(
              {
                title: 'Other',
                projectType: PROJECT_TYPE.OTHER_WORK
              }
            );
          }
        });
      }
    }
    
    if (rolesArr.length === 1) {
      onPressProjectType(rolesArr[0].projectType);
      return;
    }
    setRoles(rolesArr)
  }, []);

  const onPressProjectType = (projectType: any) => {
    navigation.navigate("AssignWork", {
      projectType: projectType
    })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.rfiTabBar}>
          {
            roles.map((role: any) => (
            <TouchableOpacity style={[styles.rfiTab, {backgroundColor: role.color}]} onPress={() => onPressProjectType(role.projectType)}>
              <Text style={styles.tabText}>{role.title}</Text>
            </TouchableOpacity>
            ))
          }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    padding: 20,
  },
  rfiTabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10
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
    color: '#fff'
  },
});

export default WorkType