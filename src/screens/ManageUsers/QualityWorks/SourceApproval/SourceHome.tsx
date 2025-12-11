import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderItems} from '../../../../constants/constants';
import SourceDetail from './SourceDetail';
import SourceRequest from './SourceRequest';
import {
  getSourceCategoriesWithCount,
  clearSourceApprovals,
} from '../../actions';

const SourceHome = () => {
  const [activeTab, setActiveTab] = useState('Source Detail');
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const {sourceCategoriesWithCount, loading, error} = useSelector(
    (state: any) => state.SourceApprovals,
  );
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  // This useEffect fetches the data
  useEffect(() => {
    if (isFocused && loggedInUser?.projectId) {
      dispatch(
        getSourceCategoriesWithCount({projectId: loggedInUser.projectId}),
      );

      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.sourceApprovals);
    }

    return () => {
      dispatch(clearSourceApprovals());
    };
  }, [isFocused, dispatch, loggedInUser?.projectId]);

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

      {/* Content Area */}
      <View style={styles.tabContent}>
        {activeTab === 'Source Detail' && (
          <>
            {loading ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4E36A3" />
              </View>
            ) : error ? (
              <View style={styles.centered}>
                <Text style={styles.errorText}>
                  Failed to load data. Please try again.
                </Text>
              </View>
            ) : (
              <SourceDetail
                workCategories={
                  sourceCategoriesWithCount?.testWorkCategoriesData
                }
              />
            )}
          </>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
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
    paddingHorizontal: 16,
  },
});

export default SourceHome;
