import React, {useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {MATERIAL_REQUEST_STATUS} from '../../constants/constants';
import RequestCard from '../Common/RequestCard';
import {useNavigation} from '@react-navigation/native';

const inventoryRequests = [
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

export default function ProductionRequest() {
  // Use the actual data array instead of sundefined variable
  const currentRequests = inventoryRequests;
  const navigation = useNavigation<any>();
  // Add the missing handler function

  const handleRequestPress = () => {
    navigation.navigate('MaterialProductionRequestForm');
  };
  const handleActionPress = useCallback(
    (action: string, status: string) => {
      console.log(`Action: ${action}, Status: ${status}`);

      switch (status) {
        case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
          navigation.navigate('MaterialApprovalProductionForm', {status});
          break;
        case MATERIAL_REQUEST_STATUS.REJECTED:
          handleRequestPress();
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
    [navigation],
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log('Request pressed');
          handleRequestPress();
        }}>
        <Text style={styles.addButtonText}>Request</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.recentWorkContainer}>
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
                  There are no requests available.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
    marginBottom: 5,
  },
  addButtonText: {
    color: '#4E36A3',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  recentWorkContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recentWorkHead: {
    borderBottomWidth: 1,
    borderColor: '#DEE1E7',
    padding: 15,
  },
  headerText: {
    color: '#34343F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskCount: {
    color: '#4E36A3',
  },
  listContainer: {
    paddingVertical: 10,
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
});
