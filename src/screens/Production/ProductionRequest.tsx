import React, {useState, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {MATERIAL_REQUEST_STATUS} from '../../constants/constants';
import RequestCard from '../Common/RequestCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMaterialRequest,
  getMaterialRequestTo,
  patchMaterialRequestStatus,
} from '../ManageUsers/actions';
import {useSnackbar} from '../../context/SnackbarContext';

const statusType = [
  {
    status: MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE,
    statusText: 'Pending for Acceptance',
  },
  {
    status: MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL,
    statusText: 'Request For Approval',
  },
  {
    status: MATERIAL_REQUEST_STATUS.PENDING_APPROVAL,
    statusText: 'Pending for Approval',
  },
  {
    status: MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
    statusText: 'Pending for Dispatch',
  },
  {
    status: 'dispatched',
    statusText: 'Dispatched',
  },
  {status: MATERIAL_REQUEST_STATUS.REJECTED, statusText: 'Rejected'},
];

const ProductionRequest = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
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
      showSnackbar('Material status updated successfully', 'success');
      fetchRequests();
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [patchMeterialRequestStatusData, error]);

  const fetchRequests = () => {
    dispatch(
      getMaterialRequestTo({
        projectId: loggedInUser.projectId,
        type: 'production',
        requestType: '',
      }),
    );
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(clearMaterialRequest());
      fetchRequests();
    }
  }, [isFocused]);

  useEffect(() => {
    if (getMeterialRequestToFormData?.length) {
      // Logic from RequestPage.tsx to handle aggregate status
      const mapped = getMeterialRequestToFormData.flatMap((entry: any) =>
        entry.materialRequests.map((req: any) => {
          const allItems = req.items || [];
          const firstItem = allItems[0];

          // Determine Aggregate Status
          // Priority: Rejected > Pending Approval > Request For Approval > Pending Dispatch > Dispatched
          let aggregateStatus = 'dispatched';

          const hasRejected = allItems.some(
            (i: any) => i.status === MATERIAL_REQUEST_STATUS.REJECTED,
          );
          const hasPendingAcceptance = allItems.some(
            (i: any) => i.status === MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE,
          );
          const hasRequestForApproval = allItems.some(
            (i: any) =>
              i.status === 'request_for_approval' ||
              i.status === MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL,
          );
          const hasPendingApproval = allItems.some(
            (i: any) => i.status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL,
          );
          const hasPendingDispatch = allItems.some(
            (i: any) => i.status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
          );

          if (hasRejected) {
            aggregateStatus = MATERIAL_REQUEST_STATUS.REJECTED;
          } else if (hasPendingAcceptance) {
            aggregateStatus = MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE;
          } else if (hasRequestForApproval) {
            aggregateStatus = MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL;
          } else if (hasPendingApproval) {
            aggregateStatus = MATERIAL_REQUEST_STATUS.PENDING_APPROVAL;
          } else if (hasPendingDispatch) {
            aggregateStatus = MATERIAL_REQUEST_STATUS.PENDING_DISPATCH;
          } else if (allItems.length > 0) {
            aggregateStatus = firstItem.status;
          }

          const statusInfo = statusType.find(s => s.status === aggregateStatus);

          return {
            id: req?._id,
            rfiId: entry.rfiId,
            createdAt: req?.createdAt,
            updatedAt: req?.updatedAt,
            workCategory: firstItem?.testWorkCategoryType || '',
            materialType: firstItem?.testMaterialType || '',
            materialCategory:
              firstItem?.testMaterialCategory || req?.materialCategory || '',
            status: aggregateStatus,
            statusText: statusInfo ? statusInfo.statusText : aggregateStatus,
            items: req.items,
            requestQty: firstItem?.qty_requested, // Show first item qty or sum
          };
        }),
      );

      setInventoryRequests(mapped);
      console.log('Production Requests mapped:', JSON.stringify(mapped));
    }
  }, [getMeterialRequestToFormData]);

  const navigateToRequestForm = () => {
    navigation.navigate('ProductionRequestFormComponent');
  };

  const handleActionPress = useCallback(
    (action: string, status: string, item: any) => {
      console.log(`Action: ${action}, Status: ${status}`);

      switch (status) {
        case MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL:
        case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
          // Navigate to Detail/Action Form
          console.log(
            'Navigating to MaterialApprovalProduction',
            JSON.stringify(item),
          );
          navigation.navigate('MaterialApprovalProduction', {status, item});
          break;
        case MATERIAL_REQUEST_STATUS.REJECTED:
          navigateToRequestForm();
          break;
        case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
          if (action === 'accept') {
            // Updated Flow: Acceptance -> Request For Approval
            dispatch(
              patchMaterialRequestStatus({
                projectId: loggedInUser.projectId,
                id: item?.id,
                body: {status: 'request_for_approval'},
              }),
            );
          } else if (action === 'reject') {
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
    [navigation, dispatch, loggedInUser.projectId],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={navigateToRequestForm}>
        <Text style={styles.addButtonText}>Request</Text>
      </TouchableOpacity>
      <SafeAreaView style={styles.safeArea}>
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
                    key={`${request.id}-${index}`}
                    request={request}
                    onActionPress={handleActionPress}
                  />
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataHeadText}>No Requests Found</Text>
                  <Text style={styles.noDataSubText}>
                    There are no production requests available.
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
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#4E36A3',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  recentWorkContainer: {
    marginHorizontal: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentWorkHead: {
    borderBottomWidth: 1,
    borderColor: '#DEE1E7',
    padding: 16,
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
    paddingHorizontal: 8,
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

export default ProductionRequest;
