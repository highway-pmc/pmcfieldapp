import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {HeaderItems} from '../../../../constants/constants'; // Adjust import path
import SourceDetail from './SourceDetail'; // Import the subcomponent
import SourceRequest from './SourceRequest'; // Import the subcomponent

// Define types for navigation props for better code quality
type SourceHomeProps = {
  route: {
    params: {
      testClassificationId: string;
      testClassificationName: string;
      testClassificationType: string;
      testWorkCategoriesData: any[]; // Define a more specific type if possible
      workType: string;
    };
  };
  navigation: any;
};

const SourceHome = ({route, navigation}: SourceHomeProps) => {
  const [activeTab, setActiveTab] = useState('Source Detail');
  const {
    testClassificationId,
    testClassificationName,
    testClassificationType,
    testWorkCategoriesData,
    workType,
  } = route.params;

  const isFocused = useIsFocused();

  // This function will be passed to the child component
  const onTestWorkCategoryNextClick = (item: any) => {
    navigation.navigate('AssignTestMaterialsPurchage', {
      // Adjust screen name
      testClassificationId,
      testClassificationName,
      testClassificationType,
      testWorkCategoryId: item._id,
      testWorkCategoryName: item.name,
      testWorkCategoryType: item.type,
      workType,
    });
  };

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.sourceApprovals);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'Source Detail' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Source Detail')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Source Detail' && styles.activeTabText,
            ]}>
            Source Detail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Request' && styles.activeTab]}
          onPress={() => setActiveTab('Request')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Request' && styles.activeTabText,
            ]}>
            Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area: Pass props to the active component */}
      <View style={styles.tabContent}>
        {activeTab === 'Source Detail' && (
          <SourceDetail
            workCategories={testWorkCategoriesData}
            onCategoryClick={onTestWorkCategoryNextClick}
          />
        )}
        {activeTab === 'Request' && <SourceRequest />}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    margin: 10,
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
  },
  tabText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4E36A3',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16, // Add horizontal padding for content
  },
});

export default SourceHome;
