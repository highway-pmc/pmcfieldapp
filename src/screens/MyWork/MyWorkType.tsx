import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, TouchableOpacity  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, ROLES } from "../../constants/constants"
import { useSelector } from 'react-redux';
import TileCardComponent from '../Common/TileCardComponent';
import { WORK_MODULE_TYPE } from '../Common/CommonConstantsTypes';

const MyWorkType = ({navigation}: {navigation: any}) => {
  const [projectHead, setProjectHead] = useState(false);
  const [roles, setRoles] = useState([]);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myWorkType);
      render();
    }
  }, [focus]);

  const render = () => {
    setRoles([]);
    let rolesArr: any = [];
    if(loggedInUser.roles) {
      if (loggedInUser.roles.split(',').find((role: any) => role === ROLES.PROJECT_HEAD)) {
        rolesArr = WORK_MODULE_TYPE;
        setProjectHead(true);
      } else {
        loggedInUser.roles.split(',').forEach((role: any) => {
          if (role === ROLES.STRUCTURE_HEAD) {
            rolesArr.push(
              {
                title: 'Structure',
                workType: PROJECT_TYPE.STRUCTURE_WORK,
              }
            );
          } else if (role === ROLES.HIGHWAY_HEAD) {
            rolesArr.push(
              {
                title: 'Highway',
                workType: PROJECT_TYPE.HIGHWAY_WORK
              }
            );
          } else if (role === ROLES.OTHER_WORF_HEAD) {
            rolesArr.push(
              {
                title: 'Other',
                workType: PROJECT_TYPE.OTHER_WORK
              }
            );
          }
        });
      }
    }
    
    HeaderItems.myWork.showBack = false;
    if (rolesArr.length === 1) {
      onPressWorkType(rolesArr[0].workType);
      return;
    } else if (rolesArr.length === 0) {
      onPressWorkType(ROLES.USER);
      return;
    }
    HeaderItems.myWork.showBack = true;
    setRoles(rolesArr)
  }

  const onPressWorkType = (workType: any) => {
    navigation.navigate("MyWork", {
      workType: workType
    })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.rfiTabBar}>
          {
            roles.map((role: any) => (
              <>
              <TileCardComponent
                title={role.title}
                content={role.discription}
                bgColor={role.color}
                image={role.src}
                onPress={() => onPressWorkType(role.workType)}
              />
              </>
            // <TouchableOpacity style={[styles.rfiTab, {backgroundColor: role.color}]} onPress={() => onPressWorkType(role.workType)}>
            //   <Text style={styles.tabText}>{role.title}</Text>
            // </TouchableOpacity>
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

export default MyWorkType