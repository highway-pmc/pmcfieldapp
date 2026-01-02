import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import RequestCard from './PurchaseRequestCard';
import {MATERIAL_REQUEST_STATUS} from '../../constants/constants';
import { useSnackbar } from '../../context/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import { clearPatchProcurement, getAllProcurements, patchProcurementsStatus} from '../ManageUsers/actions';

export default function Purchase() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {showSnackbar} = useSnackbar();
  const {allProcurements, loading, patchProcurements, error} =
    useSelector((state: any) => state.Procurements);
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  useEffect(() => {
    if (isFocused && loggedInUser?.projectId) {
      dispatch(getAllProcurements({projectId: loggedInUser.projectId}));
      console.log('Procurments Data', allProcurements);
    }
    return () => {
      dispatch(clearPatchProcurement());
    };
  }, [isFocused, dispatch, loggedInUser?.projectId]);
  useEffect(() => {
    if (patchProcurements) {
      dispatch(clearPatchProcurement());
      dispatch(getAllProcurements({projectId: loggedInUser.projectId}));
      showSnackbar('Source Status Updated!', 'success');
    } else {
      if (error) {
        showSnackbar(error || 'Something went wrong', 'error');
      }
    }
  }, [patchProcurements]);
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
              patchProcurementsStatus({
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

  const handleAddPurchase = () => {
    navigation.navigate('AddPurchase');
  };

  const handleFilter = () => {
    //setFilterVisible(true);
  };

  return (
    <View style={styles.container}>

    <View style={styles.header}>
      <View>
        <Text style={styles.countText}>
            Total Requests: {allProcurements?.length || 0}
        </Text>
      </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPurchase}>
          <Text style={styles.addButtonText}>Add Purchase</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            styles.activeFilterButton,
          ]}
          onPress={handleFilter}>
          <Text
            style={[
              {color: '#4E36A3'},
              styles.activeFilterText,
            ]}>
            Filter
          </Text>
        </TouchableOpacity>
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
            {allProcurements && allProcurements.length > 0 ? (
              allProcurements.map((item: any) => (
                <RequestCard
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
  filterButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4E36A3',
  },
  activeFilterButton: {
    backgroundColor: '#4E36A3',
  },
  activeFilterText: {
    color: '#fff',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#E3DEF6',
    borderRadius: 8,
  },
  activeFiltersText: {
    color: '#4E36A3',
    fontSize: 14,
    fontWeight: '500',
  },
  clearFiltersText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyStateText: {
    color: '#6E6E82',
    fontSize: 16,
  },
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardBody: {
    padding: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: '#6E6E82',
  },
  dataValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  dataValueBold: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAF5',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButton: {
    marginLeft: 16,
    padding: 8,
  },
  editButtonText: {
    color: '#4E36A3',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#DC3545',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal styles (unchanged)
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#EBEBF0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    fontSize: 24,
    color: '#000000',
  },
  modalContent: {
    marginBottom: 5,
    marginHorizontal: 7,
  },
  filterSection: {
    marginBottom: 6,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  dateInput: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  addButtonText: {color: '#4E36A3', fontWeight: 'bold'},
  scrollContent: {padding: 15, paddingBottom: 40},
  listContainer: {width: '100%'},
  noDataContainer: {marginTop: 100, alignItems: 'center'},
  noDataHeadText: {fontSize: 18, fontWeight: '600', color: '#34343F'},
  noDataSubText: {fontSize: 14, color: '#6E6E82', marginTop: 8},
});
