import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {HeaderItems, STORE_OPTION} from '../../constants/constants';
import Inventory from './Inventory';
import Purchase from './Purchase';
import Request from './Request';

const ScrapDeposit = () => (
  <View style={styles.tabContentContainer}>
    <Text style={styles.tabContentText}>Scrap Deposit Content</Text>
  </View>
);

const ScrapInventory = () => (
  <View style={styles.tabContentContainer}>
    <Text style={styles.tabContentText}>Scrap Inventory Content</Text>
  </View>
);

export default function StoreHome() {
  const [activeTab, setActiveTab] = useState(STORE_OPTION.PURCHASING);

  const tabOptions = [
    STORE_OPTION.PURCHASING,
    STORE_OPTION.INVENTORY,
    STORE_OPTION.REQUEST,
    STORE_OPTION.SCRAP_DEPOSIT,
    STORE_OPTION.SCRAP_INVENTORY,
  ];
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

  const renderTabContent = () => {
    switch (activeTab) {
      case STORE_OPTION.PURCHASING:
        return <Purchase />;
      case STORE_OPTION.INVENTORY:
        return <Inventory />;
      case 'Request':
        return <Request />;
      case 'Scrap Deposit':
        return <ScrapDeposit />;
      case 'Scrap Inventory':
        return <ScrapInventory />;
      default:
        return <Purchase />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}>
          {tabOptions.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tabItem, activeTab === tab && styles.activeTab]}
              onPress={() => switchTab(tab)}>
              <Text
                style={[
                  styles.activeTabText,
                  activeTab === tab && styles.activeFontColor,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.tabContent}>{renderTabContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  tabBarContainer: {
    margin: 10,
    backgroundColor: '#D2C5FF',
    borderRadius: 10,
    paddingVertical: 8,
  },
  tabBar: {
    flexGrow: 0,
  },
  tabBarContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    minWidth: 100,
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
    textAlign: 'center',
  },
  tabContent: {
    flex: 1, // This is the corrected style
  },
  tabContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabContentText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});
