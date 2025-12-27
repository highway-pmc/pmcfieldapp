import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import RequestCard from '../../../Common/RequestCard';
// Assuming you have update actions in your actions file
import {getAllSourceApprovals, clearSourceApprovals} from '../../actions';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

export default function SourceRequest() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {allSourceApprovals, loading} = useSelector(
    (state: any) => state.SourceApprovals,
  );
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  useEffect(() => {
    console.log('projectId in SourceRequest:', loggedInUser?.projectId);
    if (isFocused && loggedInUser?.projectId) {
      dispatch(getAllSourceApprovals({projectId: loggedInUser.projectId}));
      console.log('Dispatched getAllSourceApprovals');
    }
    return () => {
      dispatch(clearSourceApprovals());
    };
  }, [isFocused, dispatch, loggedInUser?.projectId]);

  const handleStatusUpdate = (id: string, status: 'Approved' | 'Rejected') => {
    // Replace updateSourceStatus with your actual action name
    // dispatch(updateSourceStatus({id, status}));
    console.log(`${status} pressed for ID:`, id);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ New Request</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4E36A3"
            style={{marginTop: 50}}
          />
        ) : (
          <View style={styles.recentWorkContainer}>
            <View style={styles.listContainer}>
              {allSourceApprovals && allSourceApprovals.length > 0 ? (
                allSourceApprovals.map((request: any) => (
                  <RequestCard
                    key={request._id || request.id}
                    request={request}
                    onApprove={() =>
                      handleStatusUpdate(request._id, 'Approved')
                    }
                    onReject={() => handleStatusUpdate(request._id, 'Rejected')}
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
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA', padding: 10},
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
    marginBottom: 10,
  },
  addButtonText: {color: '#4E36A3', fontWeight: 'bold'},
  scrollContent: {paddingBottom: 20},
  recentWorkContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  listContainer: {paddingVertical: 10},
  noDataContainer: {paddingVertical: 50, alignItems: 'center'},
  noDataHeadText: {fontSize: 18, fontWeight: '600', color: '#34343F'},
  noDataSubText: {fontSize: 14, color: '#6E6E82', marginTop: 8},
});
