import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
// Removed DateTimePicker import
import {MATERIAL_REQUEST_STATUS} from '../../constants/constants';
import {
  getMaterialRequestTo,
  clearMaterialRequest,
} from '../ManageUsers/actions';
import RequestCard from '../Common/RequestCard';

const statusType = [
  {status: MATERIAL_REQUEST_STATUS.DISPATCHED, statusText: 'Dispatched'},
  {status: MATERIAL_REQUEST_STATUS.DELIVERED, statusText: 'Delivered'},
];

// Define the time range options
const TIME_RANGE_OPTIONS = [
  {label: 'Last 1 Day', days: 1},
  {label: 'Last 2 Days', days: 2},
  {label: '5 Days', days: 5},
  {label: '1 Week', days: 7},
  {label: '1 Month', days: 30},
  {label: 'All Time', days: null}, // null represents allTime
];

interface ProductionSummaryProps {
  equipmentId?: string;
}

export default function ProductionSummary({
  equipmentId,
}: ProductionSummaryProps) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {getMeterialRequestToFormData, loading} = useSelector(
    (state: any) => state.MeterialRequest,
  );

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    statusType.map(item => item.status),
  );

  // New State for Time Range
  const [selectedRange, setSelectedRange] = useState(TIME_RANGE_OPTIONS[0]);
  const [summaryRequests, setSummaryRequests] = useState<any[]>([]);

  const fetchSummary = useCallback(() => {
    let fromDateTime = '';
    let toDateTime = '';

    // Calculation Logic for Payload
    if (selectedRange.days !== null) {
      const now = new Date();
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - selectedRange.days);

      fromDateTime = pastDate.toISOString();
      toDateTime = now.toISOString();
    }
    clearMaterialRequest();
    dispatch(
      getMaterialRequestTo({
        projectId: loggedInUser.projectId,
        type: 'production',
        requestType: '',
        testEquipmentId: equipmentId,
        status: selectedStatuses,
        fromDateTime: fromDateTime, // Will be "" if allTime
        toDateTime: toDateTime, // Will be "" if allTime
      }),
    );
  }, [dispatch, selectedStatuses, selectedRange, equipmentId, loggedInUser]);

  useEffect(() => {
    if (isFocused) {
      fetchSummary();
    }
  }, [isFocused, selectedStatuses, selectedRange]);

  useEffect(() => {
    if (getMeterialRequestToFormData?.length) {
      const mapped = getMeterialRequestToFormData.flatMap((entry: any) =>
        (entry.materialRequests || []).map((req: any) => {
          const allItems = req.items || [];
          const firstItem = allItems[0];
          let aggregateStatus = MATERIAL_REQUEST_STATUS.DISPATCHED;

          const hasRejected = allItems.some(
            (i: any) => i.status === MATERIAL_REQUEST_STATUS.REJECTED,
          );
          const hasPendingAcceptance = allItems.some(
            (i: any) => i.status === MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE,
          );

          if (hasRejected) aggregateStatus = MATERIAL_REQUEST_STATUS.REJECTED;
          else if (hasPendingAcceptance)
            aggregateStatus = MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE;
          else if (allItems.length > 0) aggregateStatus = firstItem.status;

          const statusInfo = statusType.find(s => s.status === aggregateStatus);

          return {
            id: req?._id,
            rfiId: entry.rfiId,
            createdAt: req?.createdAt,
            workCategory: firstItem?.testWorkCategoryType || '',
            materialType: firstItem?.testMaterialType || '',
            materialCategory:
              firstItem?.testMaterialCategory || req?.materialCategory || '',
            status: aggregateStatus,
            statusText: statusInfo ? statusInfo.statusText : aggregateStatus,
            items: req.items,
            requestQty: firstItem?.qty_requested,
          };
        }),
      );
      setSummaryRequests(mapped);
    } else {
      setSummaryRequests([]);
    }
  }, [getMeterialRequestToFormData]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by Status:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}>
          {statusType.map(option => (
            <TouchableOpacity
              key={option.status}
              style={[
                styles.chip,
                selectedStatuses.includes(option.status) && styles.activeChip,
              ]}
              onPress={() => toggleStatus(option.status)}>
              <Text
                style={[
                  styles.chipText,
                  selectedStatuses.includes(option.status) &&
                    styles.activeChipText,
                ]}>
                {option.statusText}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Time Period:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}>
          {TIME_RANGE_OPTIONS.map((range, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                selectedRange.label === range.label && styles.activeTimeChip,
              ]}
              onPress={() => setSelectedRange(range)}>
              <Text
                style={[
                  styles.chipText,
                  selectedRange.label === range.label && styles.activeChipText,
                ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.recentWorkContainer}>
            <View style={styles.recentWorkHead}>
              <Text style={styles.headerText}>
                Production Summary (
                <Text style={styles.taskCount}>{summaryRequests.length}</Text>)
              </Text>
            </View>

            <View style={styles.listContainer}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#4E36A3"
                  style={{marginTop: 20}}
                />
              ) : summaryRequests.length > 0 ? (
                summaryRequests.map((request, index) => (
                  <RequestCard
                    key={`${request.id}-${index}`}
                    request={request}
                    onActionPress={() => {}}
                  />
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataHeadText}>No Summary Data</Text>
                  <Text style={styles.noDataSubText}>
                    Adjust filters to see production records.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  filterSection: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DEE1E7',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34343F',
    marginBottom: 10,
  },
  chipContainer: {flexDirection: 'row', marginBottom: 15},
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8, // Changed to squared-rounded for a cleaner look
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  activeChip: {backgroundColor: '#4E36A3', borderColor: '#4E36A3'},
  activeTimeChip: {backgroundColor: '#1C58C0', borderColor: '#1C58C0'}, // Different color for time filter
  chipText: {color: '#374151', fontSize: 12},
  activeChipText: {color: '#FFF', fontWeight: 'bold'},
  safeArea: {flex: 1},
  scrollContent: {padding: 10, paddingBottom: 40},
  recentWorkContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentWorkHead: {borderBottomWidth: 1, borderColor: '#DEE1E7', padding: 16},
  headerText: {color: '#34343F', fontSize: 16, fontWeight: 'bold'},
  taskCount: {color: '#1C58C0'},
  listContainer: {paddingVertical: 10, paddingHorizontal: 8},
  noDataContainer: {paddingVertical: 50, alignItems: 'center'},
  noDataHeadText: {fontSize: 16, fontWeight: '600', color: '#34343F'},
  noDataSubText: {fontSize: 13, color: '#6E6E82', marginTop: 4},
});
