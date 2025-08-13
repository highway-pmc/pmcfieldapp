import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  NativeEventEmitter,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useRoute, useNavigation} from '@react-navigation/native';
import DropdownPicker from '../../components/UI/DropdownPicker';
import CalendarPicker from '../../components/UI/CalenderPicker';
import {useSnackbar} from '../../context/SnackbarContext';
import {HeaderItems} from '../../constants/constants';

// --- TYPE DEFINITIONS ---
type AlignmentCoordinate = {
  id: string;
  easting: string;
  northing: string;
};

type TempControlPoint = {
  id: string;
  label: string;
};

type TableRowData = {
  coordinate: AlignmentCoordinate;
  selectedTcpId: string | null;
  status: 'Yes' | 'No' | 'NA' | null;
};

// --- MAIN COMPONENT ---
export default function AlignmentMarking() {
  const [date, setDate] = useState<string>('');
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [tempControlPoints, setTempControlPoints] = useState<
    TempControlPoint[]
  >([]);

  const navigation = useNavigation<any>();
  const route = useRoute();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {showSnackbar} = useSnackbar();

  const {projectId, projectModuleId, segmentId, componentId, subComponentId} =
    (route.params as any) || {};

  const {
    alignmentCoordinates: apiAlignmentCoordinates,
    tempControlPoints: apiTempControlPoints,
    loading,
    error,
  } = useSelector((state: any) => state.WorkAssignment || {});

  // --- MOCK FUNCTION FOR DEMONSTRATION ---
  const [mockLoading, setMockLoading] = useState(true);
  useEffect(() => {
    if (isFocused) {
      // This is a mock fetch. Replace with your actual Redux dispatches.
      const mockFetchData = () => {
        Promise.all([
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve([
                  {id: '1', easting: '345123.123', northing: '1234567.123'},
                  {id: '2', easting: '345124.456', northing: '1234568.456'},
                ]),
              500,
            ),
          ),
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve([
                  {id: 'TCP-001', label: 'TCP-001'},
                  {id: 'TCP-002', label: 'TCP-002'},
                ]),
              500,
            ),
          ),
        ]).then(([coords, tcps]) => {
          const initialTableData: TableRowData[] = (
            coords as AlignmentCoordinate[]
          ).map(c => ({coordinate: c, selectedTcpId: null, status: null}));
          setTableData(initialTableData);
          setTempControlPoints(tcps as TempControlPoint[]);
          setMockLoading(false);
        });
      };
      mockFetchData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.alignmentMarking);
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  }, [isFocused, navigation]);

  // --- HANDLER FUNCTIONS ---
  const handleDropdownChange = (rowIndex: number, value: string) => {
    setTableData(p =>
      p.map((row, i) =>
        i === rowIndex ? {...row, selectedTcpId: value} : row,
      ),
    );
  };

  const handleStatusChange = (
    rowIndex: number,
    status: 'Yes' | 'No' | 'NA',
  ) => {
    setTableData(p =>
      p.map((row, i) => (i === rowIndex ? {...row, status: status} : row)),
    );
  };

  // A common validation function for both Save and Submit
  const validateForm = (): boolean => {
    if (!date) {
      showSnackbar('Please select a date.', 'error');
      return false;
    }
    if (tableData.some(row => !row.selectedTcpId || !row.status)) {
      showSnackbar('Please fill out all fields for every row.', 'error');
      return false;
    }
    return true;
  };

  // Handles the Save button press
  const handleSave = () => {
    if (validateForm()) {
      console.log('Data saved locally:', {date, tableData});
      showSnackbar('Data has been saved successfully!', 'success');
      // This function does not submit or navigate away.
    }
  };

  // Handles the Submit button press
  const handleSubmit = () => {
    if (!validateForm()) return;

    const submissionData = {
      date,
      projectId,
      projectModuleId,
      alignments: tableData.map(row => ({
        coordinateId: row.coordinate.id,
        designEasting: row.coordinate.easting,
        designNorthing: row.coordinate.northing,
        referenceTcpId: row.selectedTcpId,
        status: row.status,
      })),
    };

    console.log('Submitting Data:', JSON.stringify(submissionData, null, 2));
    showSnackbar('Data submitted to server!', 'success');
    // dispatch(saveAlignmentData(submissionData)); // Your final submission action
    navigation.goBack();
  };

  // --- RENDER LOGIC ---
  if (mockLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A2AAF" />
        <Text style={styles.loadingText}>Loading Alignment Data...</Text>
      </View>
    );
  }

  const renderTableRow = (rowData: TableRowData, index: number) => {
    const tcpDropdownItems = [
      {label: 'Select TCP', value: ''},
      ...tempControlPoints.map(cp => ({label: cp.label, value: cp.id})),
    ];
    // Items for the new status dropdown
    const statusDropdownItems = [
      {label: 'Select Status', value: ''},
      {label: 'Yes', value: 'Yes'},
      {label: 'No', value: 'No'},
      {label: 'NA', value: 'NA'},
    ];

    return (
      <View
        key={`row-${rowData.coordinate.id}`}
        style={[
          styles.tableBodyRow,
          index === tableData.length - 1 && styles.tableBodyRowLast,
        ]}>
        <View style={styles.tableCellId}>
          <Text style={styles.tableCellPointText}>{rowData.coordinate.id}</Text>
        </View>
        <View style={styles.tableCellCoordinate}>
          <Text style={styles.tableCellValueText}>
            {rowData.coordinate.easting}
          </Text>
        </View>
        <View style={styles.tableCellCoordinate}>
          <Text style={styles.tableCellValueText}>
            {rowData.coordinate.northing}
          </Text>
        </View>
        <View style={styles.tableCellDropdown}>
          <DropdownPicker
            items={tcpDropdownItems}
            value={rowData.selectedTcpId || ''}
            onChange={(value: string) => handleDropdownChange(index, value)}
          />
        </View>
        {/* Status is now a DropdownPicker */}
        <View style={styles.tableCellStatus}>
          <DropdownPicker
            items={statusDropdownItems}
            value={rowData.status || ''}
            onChange={(value: 'Yes' | 'No' | 'NA') =>
              handleStatusChange(index, value)
            }
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <CalendarPicker
            label="Date of Survey *"
            value={date}
            onChange={(newDate: string) => setDate(newDate)}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alignment Marking Details</Text>
          </View>
          <ScrollView horizontal>
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.tableHeaderCellId}>
                  <Text style={styles.tableHeaderText}>Coord ID</Text>
                </View>
                <View style={styles.tableHeaderCellCoordinate}>
                  <Text style={styles.tableHeaderText}>Design Easting (A)</Text>
                </View>
                <View style={styles.tableHeaderCellCoordinate}>
                  <Text style={styles.tableHeaderText}>
                    Design Northing (D)
                  </Text>
                </View>
                <View style={styles.tableHeaderCellDropdown}>
                  <Text style={styles.tableHeaderText}>Reference TCP</Text>
                </View>
                <View style={styles.tableHeaderCellStatus}>
                  <Text style={styles.tableHeaderText}>Status</Text>
                </View>
              </View>
              {tableData.map((row, index) => renderTableRow(row, index))}
            </View>
          </ScrollView>
        </View>

        {/* Container for the Save and Submit buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonBase, styles.saveButton]}
            onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonBase, styles.submitButton]}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {marginTop: 10, fontSize: 16, color: '#4A5568'},
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  dateContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#FFFFFF',
  },
  formContent: {flex: 1, paddingTop: 10},
  sectionContainer: {marginBottom: 16, paddingHorizontal: 10},
  sectionHeader: {marginBottom: 10, paddingHorizontal: 4},
  sectionTitle: {fontSize: 18, fontWeight: '700', color: '#2D3748'},
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 750,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderCellId: {
    width: 80,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellCoordinate: {
    width: 150,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellDropdown: {
    width: 180,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellStatus: {
    width: 130,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
  },
  tableBodyRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
    alignItems: 'center',
  },
  tableBodyRowLast: {borderBottomWidth: 0},
  tableCellId: {
    width: 80,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellCoordinate: {
    width: 150,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellDropdown: {width: 180, paddingHorizontal: 5},
  tableCellStatus: {width: 130, paddingHorizontal: 5},
  tableCellPointText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2D3748',
    textAlign: 'center',
  },
  tableCellValueText: {fontSize: 13, color: '#4A5568', textAlign: 'center'},
  // New styles for the two buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: '#28A745', // Green color
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#5A2AAF', // Purple color
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacing: {height: 40},
});
