import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems, RFIs_TYPE } from "../../constants/constants"

const RFIsHome = ({ route, navigation }: { route: any, navigation: any }) => {

  const focus = useIsFocused();
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.rfisHome);
    }
  }, [focus]);

  const onRFIClick = (type: any) => {
    navigation.navigate('RFIsDashboard', {
      rfiType: type
    })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.rfiTabBar}>
        <TouchableOpacity style={[styles.rfiTab, styles.generateRfi]} onPress={() => onRFIClick(RFIs_TYPE.GENERATE)}>
          <Text style={styles.tabText}>Generate</Text>
          <Text style={styles.tabText}>RFI's</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.rfiTab, styles.inProgressRfi]} onPress={() => onRFIClick(RFIs_TYPE.IN_PROGRESS)}>
          <Text style={styles.tabText}>In Progress</Text>
          <Text style={styles.tabText}>RFI's</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.rfiTab, styles.closeRfi]} onPress={() => onRFIClick(RFIs_TYPE.CLOSED)}>
          <Text style={styles.tabText}>Closed</Text>
          <Text style={styles.tabText}>RFI's</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.rfiTab, styles.approveRfi]} onPress={() => onRFIClick(RFIs_TYPE.APPROVED)}>
          <Text style={styles.tabText}>Approved</Text>
          
          <Text style={styles.tabText}>RFI's</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.rfiTab, styles.rejectedRfi]} onPress={() => onRFIClick(RFIs_TYPE.REJECTED)}>
          <Text style={styles.tabText}>Rejected/Cancelled</Text>
          <Text style={styles.tabText}>RFI's</Text>
        </TouchableOpacity>
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
  tabText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff'
  },
  generateRfi: {
    backgroundColor: '#1C58C0',
  },
  inProgressRfi: {
    backgroundColor: '#ffa879',
  },
  closeRfi: {
    backgroundColor: '#FCB700',
  },
  approveRfi: {
    backgroundColor: '#2BC267',
  },
  rejectedRfi: {
    backgroundColor: '#FF0000',
  },
});

export default RFIsHome