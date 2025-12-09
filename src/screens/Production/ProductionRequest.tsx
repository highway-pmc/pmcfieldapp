import React, {useState, useCallback, useEffect} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {
  getMaterialRequestTo,
  patchMaterialRequestStatus,
} from '../ManageUsers/actions';
import {useSnackbar} from '../../context/SnackbarContext';

type RequestItem = {
  id: number;
  rfiId: string; // Added rfiId here
  materialType: string;
  workCategory: string;
  unit: string;
  requestQty: number;
  status: string;
  statusText: string;
};

const statusType = [
  {
    status: MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE,
    statusText: 'Pending for Acceptance',
  },
  {
    status: MATERIAL_REQUEST_STATUS.PENDING_APPROVAL,
    statusText: 'Pending for Approval',
  },
  {
    status: MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
    statusText: 'Pending for Dispatch',
  },
  {status: MATERIAL_REQUEST_STATUS.REJECTED, statusText: 'Rejected'},
];

const ProductionRequest = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    getMeterialRequestToFormData,
    patchMeterialRequestStatusData,
    loading: any,
    error,
  } = useSelector((state: any) => state.MeterialRequest);
  const [inventoryRequests, setInventoryRequests] = useState<any[]>([]);

  useEffect(() => {
    if (patchMeterialRequestStatusData) {
      showSnackbar('Meterial status updated successfully', 'success');
      dispatch(
        getMaterialRequestTo({
          projectId: loggedInUser.projectId,
          type: 'production',
          requestType: '',
        }),
      );
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [patchMeterialRequestStatusData, error]);

  useEffect(() => {
    dispatch(
      getMaterialRequestTo({
        projectId: loggedInUser.projectId,
        type: 'production',
        requestType: '',
      }),
    );
  }, []);

  useEffect(() => {
    if (getMeterialRequestToFormData?.length) {
      // Flatten the structure: Parent -> MaterialRequests -> Items
      const mapped = getMeterialRequestToFormData.flatMap((entry: any) =>
        entry.materialRequests.flatMap((req: any) =>
          req.items.map((item: any) => {
            const statusInfo = statusType.find(s => s.status === item.status);
            return {
              id: req?._id,
              rfiId: entry.rfiId, // Added RFI ID from Parent Object
              createdAt: req?.createdAt,
              updatedAt: req?.updatedAt,
              workCategory: item.testWorkCategoryType,
              materialType: item.testMaterialType,
              status: item.status,
              statusText: statusInfo ? statusInfo.statusText : item.status,
              items: req.items,
              requestQty: item.qty_requested,
            };
          }),
        ),
      );

      // Removed the .filter() function so all requests (e.g., all 4) are shown
      setInventoryRequests(mapped);
      console.log('inventoryRequests mapped:', mapped);
    }
  }, [getMeterialRequestToFormData]);

  // Handles navigation when a new request button is pressed
  const navigateToRequestForm = () => {
    navigation.navigate('ProductionRequestFormComponent');
  };

  // Handles actions from the RequestCard component (e.g., accept, reject, navigate)
  const handleActionPress = useCallback(
    (action: string, status: string, item: any) => {
      console.log(`Action: ${action}, Status: ${status}`);

      switch (status) {
        case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
          navigation.navigate('MaterialApprovalProduction', {status, item});
          break;
        case MATERIAL_REQUEST_STATUS.REJECTED:
          navigateToRequestForm();
          break;
        case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
          if (action === 'accept') {
            // Add your logic for accepting a request
            console.log('Request accepted', {
              projectId: loggedInUser.projectId,
              id: item?.id,
              body: {status: 'pending_approval'},
            });
            dispatch(
              patchMaterialRequestStatus({
                projectId: loggedInUser.projectId,
                id: item?.id,
                body: {status: 'pending_approval'},
              }),
            );
          } else if (action === 'reject') {
            // Add your logic for rejecting a request
            console.log('Request rejected');
            dispatch(
              patchMaterialRequestStatus({
                projectId: loggedInUser.projectId,
                id: item?.id,
                body: {status: 'rejected'},
              }),
            );
          }
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  const handleRequestPress = () => {
    navigation.navigate('ProductionRequestFormComponent');
  };

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
      <SafeAreaView style={styles.safeArea}>
        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.recentWorkContainer}>
            <View style={styles.recentWorkHead}>
              <Text style={styles.headerText}>
                Recent Requests (
                <Text style={styles.taskCount}>{inventoryRequests.length}</Text>
                )
              </Text>
            </View>

            <View style={styles.listContainer}>
              {inventoryRequests.length > 0 ? (
                inventoryRequests.map((request, index) => (
                  <RequestCard
                    key={request.id + index} // Added index to key to ensure uniqueness if ids are duplicates
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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

export default ProductionRequest;
