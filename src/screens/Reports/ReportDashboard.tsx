import { View, Text, NativeEventEmitter, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, WORK_TYPE } from "../../constants/constants"
import ReportsFieldWork from './ReportsFieldWork';
import ReportsLabWork from './ReportsLabWork';

const ReportsDashboard = ({ route, navigation }: { route: any, navigation: any }) => {

    const [activeTab, setActiveTab] = useState(WORK_TYPE.SITE_WORK);

  const focus = useIsFocused();
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.reportDashboard);
    }
  }, [focus]);

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
          <Text style={styles.activeTabText}>{WORK_TYPE.SITE_WORK}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === WORK_TYPE.LAB_WORK && styles.activeTab,
          ]}
          onPress={() => switchTab(WORK_TYPE.LAB_WORK)}
        >
          <Text style={styles.activeTabText}>{WORK_TYPE.LAB_WORK}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {activeTab === WORK_TYPE.SITE_WORK &&
          <ReportsFieldWork></ReportsFieldWork>
        }
        {activeTab === WORK_TYPE.LAB_WORK && <ReportsLabWork></ReportsLabWork>}
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
    borderColor: '#1C58C0'
  },
  activeTabText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500'
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderWidth: 1,
    height: '100%'
  },
});

export default ReportsDashboard