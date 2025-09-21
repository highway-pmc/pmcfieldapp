import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  NativeEventEmitter,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import InformationTab from './InformationTab';
import ObservationsTab from './ObservationsTab';
import ResultsTab from './ResultsTab';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {HeaderItems} from '../../../../constants/constants';

const TABS = {
  INFORMATION: 'Information',
  OBSERVATIONS: 'Observations',
  RESULTS: 'Results',
};

const TestDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState(TABS.INFORMATION);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.sourceApprovals);
    }
  }, [isFocused]);
  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.INFORMATION:
        return <InformationTab />;
      case TABS.OBSERVATIONS:
        return <ObservationsTab />;
      case TABS.RESULTS:
        return <ResultsTab />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Bar for navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.INFORMATION && styles.activeTab,
          ]}
          onPress={() => switchTab(TABS.INFORMATION)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.INFORMATION && styles.activeTabText,
            ]}>
            {TABS.INFORMATION}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.OBSERVATIONS && styles.activeTab,
          ]}
          onPress={() => switchTab(TABS.OBSERVATIONS)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.OBSERVATIONS && styles.activeTabText,
            ]}>
            {TABS.OBSERVATIONS}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.RESULTS && styles.activeTab,
          ]}
          onPress={() => switchTab(TABS.RESULTS)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.RESULTS && styles.activeTabText,
            ]}>
            {TABS.RESULTS}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
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
    marginHorizontal: 8,
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
  contentContainer: {
    flex: 1,
    padding: 10,
  },
});

export default TestDetailsScreen;
