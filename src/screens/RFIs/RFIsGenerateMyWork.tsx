import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, RFIs_TYPE, USER_CATEGORY_DISPLAY, WORK_TYPE } from "../../constants/constants"
import RFIsStructureTaskListing from './RFIsStructureTaskListing';

const RFIsGenerateMyWork = ({ route, navigation }: { route: any, navigation: any }) => {

  const { rfiType } = route.params;

  const [activeTab, setActiveTab] = useState(USER_CATEGORY_DISPLAY.STRUCTURE);

  const focus = useIsFocused();
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();


      eventEmitter.emit('headerEvent', getHeaderTitle());
    }
  }, [focus]);

  const getHeaderTitle = () => {
    if (rfiType === RFIs_TYPE.GENERATE) {
      return HeaderItems.rfisGenerateTaskListing
    } else if (rfiType === RFIs_TYPE.CLOSED) {
      return HeaderItems.rfisClosedTaskListing
    } else if (rfiType === RFIs_TYPE.APPROVED) {
      return HeaderItems.rfisApprovedTaskListing
    } else if (rfiType === RFIs_TYPE.REJECTED) {
      HeaderItems.rfisRejectedTaskListing
    }

    return {};
  }

  const switchTab = (tabName: any) => {
    setActiveTab(tabName);
  };


  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === USER_CATEGORY_DISPLAY.STRUCTURE && styles.activeTab,
          ]}
          onPress={() => switchTab(USER_CATEGORY_DISPLAY.STRUCTURE)}
        >
          <Text style={[styles.activeTabText, activeTab === USER_CATEGORY_DISPLAY.STRUCTURE && styles.activeFontColor]}>{USER_CATEGORY_DISPLAY.STRUCTURE}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === USER_CATEGORY_DISPLAY.HIGHWAY && styles.activeTab,
          ]}
          onPress={() => switchTab(USER_CATEGORY_DISPLAY.HIGHWAY)}
        >
          <Text style={[styles.activeTabText, activeTab === USER_CATEGORY_DISPLAY.HIGHWAY && styles.activeFontColor]}>{USER_CATEGORY_DISPLAY.HIGHWAY}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === USER_CATEGORY_DISPLAY.OTHER && styles.activeTab,
          ]}
          onPress={() => switchTab(USER_CATEGORY_DISPLAY.OTHER)}
        >
          <Text style={[styles.activeTabText, activeTab === USER_CATEGORY_DISPLAY.OTHER && styles.activeFontColor]}>{USER_CATEGORY_DISPLAY.OTHER}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {activeTab === USER_CATEGORY_DISPLAY.STRUCTURE &&
          // <Text>STRUCTURE WORK</Text>
          <RFIsStructureTaskListing rfiType={rfiType} projectType={PROJECT_TYPE.STRUCTURE_WORK}></RFIsStructureTaskListing>
        }
        {activeTab === USER_CATEGORY_DISPLAY.HIGHWAY && <RFIsStructureTaskListing rfiType={rfiType} projectType={PROJECT_TYPE.HIGHWAY_WORK}></RFIsStructureTaskListing>}
        {activeTab === USER_CATEGORY_DISPLAY.OTHER && <Text>TBD</Text>}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
    justifyContent: 'center'
  },
  activeTab: {
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderColor: '#1C58C0',
  },
  activeFontColor: {
    color: '#1C58C0',
  },
  activeTabText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500'
  },
  tabContent: {
    paddingHorizontal: 5,
    paddingTop: 10,
    height: '100%'
  },
});

export default RFIsGenerateMyWork