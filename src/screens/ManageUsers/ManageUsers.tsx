import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"

const ManageUsers = ({ navigation }) => {
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.manageUsers);
  }

  return (
    <ScrollView style={styles.Container}>
      <View>
        <Text>ManageUsers</Text>
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

export default ManageUsers