import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  MATERIAL_REQUEST_STATUS,
  REQUEST_TYPES,
} from '../../constants/constants';
import RequestCard from '../Common/RequestCard';

type RequestItem = {
  id: number;
  materialType: string;
  workCategory: string;
  unit: string;
  requestQty: number;
  status: string;
  statusText: string;
};

const inventoryRequests: RequestItem[] = [
  {
    id: 1,
    materialType: 'Concrete (Structure)',
    workCategory: 'Admixture',
    unit: 'Kg',
    requestQty: 100,
    status: MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE,
    statusText: 'Pending for Acceptance',
  },
  {
    id: 2,
    materialType: 'Steel TMT Bars',
    workCategory: 'Reinforcement',
    unit: 'Ton',
    requestQty: 5,
    status: MATERIAL_REQUEST_STATUS.PENDING_APPROVAL,
    statusText: 'Pending for Approval',
  },
  {
    id: 3,
    materialType: 'Cement Bags',
    workCategory: 'Masonry',
    unit: 'Bag',
    requestQty: 250,
    status: MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
    statusText: 'Pending for Dispatch',
  },
  {
    id: 4,
    materialType: 'Electrical Wiring',
    workCategory: 'MEP',
    unit: 'Meter',
    requestQty: 500,
    status: MATERIAL_REQUEST_STATUS.REJECTED,
    statusText: 'Rejected',
  },
];

const contingencyRequests: RequestItem[] = [
  // Add contingency requests data here if needed. For now, it's empty.
];

const RequestPage = () => {
  const [selectedTab, setSelectedTab] = useState(
    REQUEST_TYPES.INVENTORY_REQUEST,
  );
  const navigation = useNavigation<any>();

  const currentRequests =
    selectedTab === REQUEST_TYPES.INVENTORY_REQUEST
      ? inventoryRequests
      : contingencyRequests;

  // Handles navigation when a new request button is pressed
  const navigateToRequestForm = () => {
    navigation.navigate('MaterialStoreRequestForm', {requestType: selectedTab});
  };

  // Handles actions from the RequestCard component (e.g., accept, reject, navigate)
  const handleActionPress = useCallback(
    (action: string, status: string) => {
      console.log(`Action: ${action}, Status: ${status}, Tab: ${selectedTab}`);

      switch (status) {
        case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
          navigation.navigate('MaterialApprovalForm', {status});
          break;
        case MATERIAL_REQUEST_STATUS.REJECTED:
          navigateToRequestForm();
          break;
        case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
          if (action === 'accept') {
            // Add your logic for accepting a request
            console.log('Request accepted');
          } else if (action === 'reject') {
            // Add your logic for rejecting a request
            console.log('Request rejected');
          }
          break;
        default:
          break;
      }
    },
    [navigation, selectedTab],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Tab Switcher */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedTab === REQUEST_TYPES.INVENTORY_REQUEST &&
                styles.activeToggleButton,
            ]}
            onPress={() => setSelectedTab(REQUEST_TYPES.INVENTORY_REQUEST)}>
            <Text
              style={[
                styles.toggleText,
                selectedTab === REQUEST_TYPES.INVENTORY_REQUEST &&
                  styles.activeToggleText,
              ]}>
              Inventory Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedTab === REQUEST_TYPES.CONTINGENCY_REQUEST &&
                styles.activeToggleButton,
            ]}
            onPress={() => setSelectedTab(REQUEST_TYPES.CONTINGENCY_REQUEST)}>
            <Text
              style={[
                styles.toggleText,
                selectedTab === REQUEST_TYPES.CONTINGENCY_REQUEST &&
                  styles.activeToggleText,
              ]}>
              Contingency Request
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.recentWorkContainer}>
            <View style={styles.recentWorkHead}>
              <Text style={styles.headerText}>
                Recent Requests (
                <Text style={styles.taskCount}>{currentRequests.length}</Text>)
              </Text>
            </View>

            <View style={styles.listContainer}>
              {currentRequests.length > 0 ? (
                currentRequests.map(request => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onActionPress={handleActionPress}
                  />
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataHeadText}>No Requests Found</Text>
                  <Text style={styles.noDataSubText}>
                    There are no{' '}
                    {selectedTab === REQUEST_TYPES.INVENTORY_REQUEST
                      ? 'inventory'
                      : 'contingency'}{' '}
                    requests available.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.newRequestButton}
            onPress={navigateToRequestForm}>
            <Text style={styles.newRequestButtonText}>
              {selectedTab === REQUEST_TYPES.INVENTORY_REQUEST
                ? 'New Inventory Request'
                : 'New Contingency Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggleButton: {
    backgroundColor: '#4E36A3',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4E36A3',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  recentWorkContainer: {
    marginTop: 16,
    marginHorizontal: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
   
  },
  recentWorkHead: {
    borderBottomWidth: 1,
    borderColor: '#DEE1E7',
    padding: 10,
  },
  headerText: {
    color: '#34343F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskCount: {
    color: '#1C58C0',
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  noDataContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataHeadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34343F',
  },
  noDataSubText: {
    fontSize: 14,
    color: '#6E6E82',
    marginTop: 8,
    textAlign: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAF5',
  },
  newRequestButton: {
    backgroundColor: '#4E36A3',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRequestButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default RequestPage;
