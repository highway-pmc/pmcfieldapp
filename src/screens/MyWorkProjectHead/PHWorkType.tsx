import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, Pressable  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE } from "../../constants/constants"

const PHWorkType = ({navigation}: {navigation: any}) => {
  const [roles, setRoles] = useState([]);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.assignedWorkType);
  }

  useEffect(() => {
    setRoles([]);
    let rolesArr: any = [
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
    setRoles(rolesArr)
  }, []);

  const onPressProjectType = (projectType: any) => {
    navigation.navigate("PHAssignedWork", {
      projectType: projectType
    })
  }

  return (
    <ScrollView style={styles.Container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: -15,
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
    paddingVertical: 10,
    padding: 15,
  },
  buttonAssign: {
    backgroundColor: '#1C58C0',
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '33%'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PHWorkType