import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"

const Profile = ({ navigation }) => {
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.profile);
  }

  return (
    <ScrollView style={styles.Container}>
      <View>
        <Text>Profile</Text>
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
});

export default Profile