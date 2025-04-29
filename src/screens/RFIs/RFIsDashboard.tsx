import {
  View,
  Text,
  Button,
  NativeEventEmitter,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {HeaderItems, WORK_TYPE} from '../../constants/constants';
import RFIsRecents from './RFIsRecents';
import RFIsRecentsMyQuality from './RFIsRecentsMyQuality';

const RFIsDashboard = ({route, navigation}: {route: any; navigation: any}) => {
  const {rfiType} = route.params;

  const [activeTab, setActiveTab] = useState(WORK_TYPE.SITE_WORK);

  const focus = useIsFocused();
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.rfisDashboard);
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
          <Text
            style={[
              styles.activeTabText,
              activeTab === WORK_TYPE.SITE_WORK && styles.activeFontColor,
            ]}>
            {WORK_TYPE.SITE_WORK}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === WORK_TYPE.LAB_WORK && styles.activeTab,
          ]}
          onPress={() => switchTab(WORK_TYPE.LAB_WORK)}>
          <Text
            style={[
              styles.activeTabText,
              activeTab === WORK_TYPE.LAB_WORK && styles.activeFontColor,
            ]}>
            {WORK_TYPE.LAB_WORK}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {activeTab === WORK_TYPE.SITE_WORK && (
          <RFIsRecents rfiType={rfiType}></RFIsRecents>
        )}
        {activeTab === WORK_TYPE.LAB_WORK && (
          <RFIsRecentsMyQuality rfiType={rfiType}></RFIsRecentsMyQuality>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  tabBar: {
    margin: 10,
    flexDirection: 'row',
    backgroundColor: '#D2C5FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#F1F1FE',
    borderRadius: 10,
  },
  activeFontColor: {
    color: '#4E36A3',
  },
  activeTabText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    height: '100%',
  },
});

export default RFIsDashboard;
