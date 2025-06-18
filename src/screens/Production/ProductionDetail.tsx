import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {HeaderItems} from '../../constants/constants';
import ProductionPending from './ProductionPending';

const TABS = {
  PENDING_REQUEST: 'Pending Request',
  PRODUCTION_SUMMARY: 'Production Summary',
};

const ProductionDetail = ({navigation}: {navigation: any}) => {
  const [activeTab, setActiveTab] = useState(TABS.PENDING_REQUEST);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.production);
  }

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.PENDING_REQUEST && styles.activeTab,
          ]}
          onPress={() => switchTab(TABS.PENDING_REQUEST)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.PENDING_REQUEST && styles.activeTabText,
            ]}>
            {TABS.PENDING_REQUEST}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.PRODUCTION_SUMMARY && styles.activeTab,
          ]}
          onPress={() => switchTab(TABS.PRODUCTION_SUMMARY)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.PRODUCTION_SUMMARY && styles.activeTabText,
            ]}>
            {TABS.PRODUCTION_SUMMARY}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContent}>
        {activeTab === TABS.PENDING_REQUEST && (
          <View style={styles.contentContainer}>
            <ProductionPending />
          </View>
        )}

        {activeTab === TABS.PRODUCTION_SUMMARY && (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>Production Summary Content</Text>
            {/* Add your production summary content here */}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#D2C5FF',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: '#5A2AAF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabText: {
    color: '#6666664D',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#5A2AAF',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProductionDetail;
