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
import {useIsFocused} from '@react-navigation/native';
import {HeaderItems, STORE_OPTION} from '../../constants/constants';
import Inventory from './Inventory';
import Purchase from './Purchase';
export default function StoreHome() {
  const [activeTab, setActiveTab] = useState(STORE_OPTION.PURCHASING);
  const switchTab = (tabName: any) => {
    setActiveTab(tabName);
  };
  const focus = useIsFocused();
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.store);
    }
  }, [focus]);
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === STORE_OPTION.PURCHASING && styles.activeTab,
          ]}
          onPress={() => switchTab(STORE_OPTION.PURCHASING)}>
          <Text
            style={[
              styles.activeTabText,
              activeTab === STORE_OPTION.PURCHASING && styles.activeFontColor,
            ]}>
            {STORE_OPTION.PURCHASING}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === STORE_OPTION.INVENTORY && styles.activeTab,
          ]}
          onPress={() => switchTab(STORE_OPTION.INVENTORY)}>
          <Text
            style={[
              styles.activeTabText,
              activeTab === STORE_OPTION.INVENTORY && styles.activeFontColor,
            ]}>
            {STORE_OPTION.INVENTORY}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {activeTab === STORE_OPTION.PURCHASING && <Purchase />}
        {activeTab === STORE_OPTION.INVENTORY && <Inventory />}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: '#fff', flex: 1},
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
    height: '100%',
  },
});
