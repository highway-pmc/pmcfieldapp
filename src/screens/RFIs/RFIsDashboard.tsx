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
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {HeaderItems, TASK_CATEGORY, WORK_TYPE} from '../../constants/constants';
import RFIsRecents from './RFIsRecents';
import RFIsRecentsMyQuality from './RFIsRecentsMyQuality';
import RFIsSurveyWork from './RFIsSurveyWork';

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

  const switchTab = useCallback((tabName: any) => {
    setActiveTab(tabName);
  }, []);

  const renderTabButton = (workType: string, label: string) => (
    <TouchableOpacity
      style={[styles.tabItem, activeTab === workType && styles.activeTab]}
      onPress={() => switchTab(workType)}
      activeOpacity={0.7}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <Text
        style={[
          styles.activeTabText,
          activeTab === workType && styles.activeFontColor,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case WORK_TYPE.SITE_WORK:
        return <RFIsRecents taskCategory={TASK_CATEGORY.MY_WORK} rfiType={rfiType} />;
      case WORK_TYPE.CASTING_YARD:
        return <RFIsRecents taskCategory={TASK_CATEGORY.CASTING_YARD} rfiType={rfiType} />;
      case WORK_TYPE.LAB_WORK:
        return <RFIsRecentsMyQuality rfiType={rfiType} />;
      case WORK_TYPE.SURVEY_WORK:
        return <RFIsSurveyWork taskCategory={TASK_CATEGORY.SURVEY} rfiType={rfiType} />;
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unknown tab: {activeTab}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
          style={styles.tabScrollView}>
          {renderTabButton(WORK_TYPE.SITE_WORK, WORK_TYPE.SITE_WORK)}
          {renderTabButton(WORK_TYPE.LAB_WORK, WORK_TYPE.LAB_WORK)}
          {renderTabButton(WORK_TYPE.SURVEY_WORK, WORK_TYPE.SURVEY_WORK)}
          {renderTabButton(WORK_TYPE.CASTING_YARD, WORK_TYPE.CASTING_YARD)}
        </ScrollView>
      </View>

      <View style={styles.tabContent}>{renderTabContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff', flex: 1},
  tabBarContainer: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  tabScrollView: {
    backgroundColor: '#D2C5FF',
    borderRadius: 10,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 15, // Increased horizontal padding for better spacing
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    marginRight: 8, // Add spacing between tabs
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
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    whiteSpace: 'nowrap', // Prevent text wrapping
  },
  tabContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default RFIsDashboard;
