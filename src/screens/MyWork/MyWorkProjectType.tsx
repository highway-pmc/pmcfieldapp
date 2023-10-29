import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, Pressable  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, ROLES } from "../../constants/constants"
import { useSelector } from 'react-redux';

const MyWorkProjectType = ({navigation}: {navigation: any}) => {
  const [projectHead, setProjectHead] = useState(false);
  const [roles, setRoles] = useState([]);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myWorkProjectType);
      render();
    }
  }, [focus]);

  const render = () => {
    setRoles([]);
    let rolesArr: any = [];
    if(loggedInUser.roles) {
      if (loggedInUser.roles.split(',').find((role: any) => role === ROLES.PROJECT_HEAD)) {
        rolesArr = [
          {
            title: 'Structure',
            projectType: PROJECT_TYPE.STRUCTURE_WORK
          },
          {
            title: 'Highway',
            projectType: PROJECT_TYPE.HIGHWAY_WORK
          },
          {
            title: 'Other',
            projectType: PROJECT_TYPE.OTHER_WORK
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
    
    HeaderItems.myWork.showBack = false;
    if (rolesArr.length === 1) {
      onPressProjectType(rolesArr[0].projectType);
      return;
    } else if (rolesArr.length === 0) {
      onPressProjectType(ROLES.USER);
      return;
    }
    HeaderItems.myWork.showBack = true;
    setRoles(rolesArr)
  }

  const onPressProjectType = (projectType: any) => {
    navigation.navigate("MyWork", {
      projectType: projectType
    })
  }

  return (
    <ScrollView contentContainerStyle={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
    }} style={styles.Container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {
            roles.map((role: any) => (
            <Pressable
              style={styles.buttonAssign}
              onPress={() => onPressProjectType(role.projectType)}>
              <Text style={styles.textStyle}>{role.title}</Text>
            </Pressable>
            ))
          }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    padding: 15,
  },
  buttonAssign: {
    backgroundColor: '#1C58C0',
    paddingVertical: 30,
    paddingHorizontal: 30,
    width: '33%'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MyWorkProjectType