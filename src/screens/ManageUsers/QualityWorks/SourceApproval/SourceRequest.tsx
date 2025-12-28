import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import SourceApprovalCard, {SOURCE_APPROVAL_STATUS} from './SourceApprovalCard';
import {
  getAllSourceApprovals,
  clearSourceApprovals,
  patchSourceStatus,
} from '../../actions';
import {useSnackbar} from '../../../../context/SnackbarContext';
export default function SourceRequest() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {showSnackbar} = useSnackbar();
  const {allSourceApprovals, loading, patchSourceStatusData, error} =
    useSelector((state: any) => state.SourceApprovals);
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  useEffect(() => {
    if (isFocused && loggedInUser?.projectId) {
      dispatch(getAllSourceApprovals({projectId: loggedInUser.projectId}));
    }
    return () => {
      dispatch(clearSourceApprovals());
    };
  }, [isFocused, dispatch, loggedInUser?.projectId]);
  useEffect(() => {
    if (patchSourceStatusData) {
      dispatch(clearSourceApprovals());
      dispatch(getAllSourceApprovals({projectId: loggedInUser.projectId}));
      showSnackbar('Source Status Updated!', 'success');
    } else {
      if (error) {
        showSnackbar(error || 'Something went wrong', 'error');
      }
    }
  }, [patchSourceStatusData]);
  // Unified action handler
  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    const actionLabel = action === 'approved' ? 'Approve' : 'Reject';

    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${actionLabel} this request?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: () => {
            console.log(`Dispatching ${action} for ID: ${id}`);
            dispatch(
              patchSourceStatus({
                projectId: loggedInUser.projectId,
                id: id,
                body: {status: action},
              }),
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>
          Total Requests: {allSourceApprovals?.length || 0}
        </Text>
        {/* <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ New Request</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4E36A3"
            style={{marginTop: 50}}
          />
        ) : (
          <View style={styles.listContainer}>
            {allSourceApprovals && allSourceApprovals.length > 0 ? (
              allSourceApprovals.map((item: any) => (
                <SourceApprovalCard
                  key={item._id}
                  request={item}
                  onApprove={id => handleAction(id, 'approved')}
                  onReject={id => handleAction(id, 'rejected')}
                />
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataHeadText}>No Requests Found</Text>
                <Text style={styles.noDataSubText}>
                  There are no pending approvals.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  countText: {fontSize: 14, color: '#666', fontWeight: '500'},
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
  },
  addButtonText: {color: '#4E36A3', fontWeight: 'bold'},
  scrollContent: {padding: 15, paddingBottom: 40},
  listContainer: {width: '100%'},
  noDataContainer: {marginTop: 100, alignItems: 'center'},
  noDataHeadText: {fontSize: 18, fontWeight: '600', color: '#34343F'},
  noDataSubText: {fontSize: 14, color: '#6E6E82', marginTop: 8},
});
