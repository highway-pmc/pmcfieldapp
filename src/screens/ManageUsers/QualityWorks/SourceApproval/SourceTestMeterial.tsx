import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {deleteSourceApproval, getSourceApprovalsByStatus} from '../../actions';
import TestMeterialCard from '../../../Common/TestMeterialCard';

type TabType = 'all' | 'pending' | 'approved' | 'rejected';

interface TabConfig {
  key: TabType;
  label: string;
  status?: string;
}

const tabs: TabConfig[] = [
  {key: 'all', label: 'All'},
  {key: 'pending', label: 'Pending', status: 'pending'},
  {key: 'approved', label: 'Approved', status: 'approved'},
  {key: 'rejected', label: 'Rejected', status: 'rejected'},
];

const SourceTestMeterial = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {meterialId} = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {sourceByStatusData, loading, error} = useSelector(
    (state: any) => state.SourceApprovals,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (sourceByStatusData) { 
      console.log(
        'source meterial DATA: ',
        meterialId,
        loggedInUser.projectId,
        sourceByStatusData,
      );
      
      // Update allData when new data comes in
      if (activeTab === 'all') {
        setAllData(prevData => {
          const newData = [...prevData];
          sourceByStatusData.forEach((item: any) => {
            const existingIndex = newData.findIndex(existing => existing._id === item._id);
            if (existingIndex >= 0) {
              newData[existingIndex] = item;
            } else {
              newData.push(item);
            }
          });
          return newData;
        });
      }
    }
  }, [sourceByStatusData, activeTab]);

  useEffect(() => {
  if (activeTab === 'all') {
    setFilteredData(allData); // use merged data
  } else if (sourceByStatusData) {
    setFilteredData(sourceByStatusData);
  }
}, [sourceByStatusData, activeTab, allData]);

  const fetchAllData = async () => {
  const statuses: TabType[] = ['pending', 'approved', 'rejected'];
  let combined: any[] = [];

  try {
    for (const status of statuses) {
      const response: any = await dispatch(
        getSourceApprovalsByStatus({
          projectId: loggedInUser.projectId,
          testMaterialId: meterialId || '',
          status,
        })
      );

      if (response?.payload) {
        combined = [...combined, ...response.payload];
      }
    }

    setAllData(combined);   // ✅ now we really have all statuses
    setFilteredData(combined);
  } catch (err) {
    console.error('Error fetching all data:', err);
  }
};

  const getMeterialData = (meterialId: any, status?: string) => {
    const statusToFetch = status || 'pending';
    
    dispatch(
      getSourceApprovalsByStatus({
        projectId: loggedInUser.projectId,
        testMaterialId: meterialId || '',
        status: statusToFetch,
      }),
    );
  };

  const filterDataByTab = () => {
    if (activeTab === 'all') {
      setFilteredData(allData);
    } else {
      const currentTabConfig = tabs.find(tab => tab.key === activeTab);
      if (currentTabConfig?.status) {
        // Filter data based on current tab status
        const filtered = sourceByStatusData?.filter(
          (item: any) => item.status === currentTabConfig.status
        ) || [];
        setFilteredData(filtered);
      }
    }
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    
    // Fetch data for the specific tab if not "all"
    if (tab !== 'all') {
      const tabConfig = tabs.find(t => t.key === tab);
      if (tabConfig?.status) {
        getMeterialData(meterialId, tabConfig.status);
      }
    }
  };

  const handleActionPress = (type: any, request: any) => {
    if (type === 'delete') {
      Alert.alert(
            'Delete Source',
            'Are you sure you want to delete this Source Approval?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                onPress: () => {
                  dispatch(
                    deleteSourceApproval({
                      projectId: loggedInUser.projectId,
                      testMaterialId: request.testMaterialId,
                      id: request._id,
                    }),
                  );
                },
                style: 'destructive',
              },
            ],
          );
      return
    }
    console.log('Action pressed for request:', request);
    navigation.navigate('SourceApprovalEditForm', {
      sourceData: request,
      type: type,
    });
  };

  const getTabCount = (tabKey: TabType) => {
    if (tabKey === 'all') {
      return allData.length;
    } else {
      const tabConfig = tabs.find(tab => tab.key === tabKey);
      if (tabConfig?.status) {
        return allData.filter(item => item.status === tabConfig.status).length;
      }
    }
    return 0;
  };

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContainer}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = getTabCount(tab.key);
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                isActive && styles.activeTab,
              ]}
              onPress={() => handleTabPress(tab.key)}
            >
              <Text style={[
                styles.tabText,
                isActive && styles.activeTabText,
              ]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[
                  styles.badge,
                  isActive && styles.activeBadge,
                ]}>
                  <Text style={[
                    styles.badgeText,
                    isActive && styles.activeBadgeText,
                  ]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E36A3" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading data: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => handleTabPress(activeTab)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!filteredData || filteredData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No {activeTab === 'all' ? 'data' : activeTab} items found
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.listContainer}>
        {filteredData.map((request: any) => (
          <TestMeterialCard
            key={request._id}
            request={request}
            onEdit={() => handleActionPress('edit', request)}
            onView={() => handleActionPress('view', request)}
            onDelete={() => handleActionPress('delete', request)}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderTabBar()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  activeTab: {
    backgroundColor: '#4E36A3',
    borderColor: '#4E36A3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  badge: {
    marginLeft: 6,
    backgroundColor: '#4E36A3',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  activeBadge: {
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activeBadgeText: {
    color: '#4E36A3',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4E36A3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Keep your existing styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  backButton: {
    fontSize: 16,
    color: '#4E36A3',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
  },
  addButtonText: {
    color: '#4E36A3',
    fontWeight: 'bold',
  },
});

export default SourceTestMeterial;