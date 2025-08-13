import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  NativeEventEmitter,
  BackHandler,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import DropdownPicker from '../../components/UI/DropdownPicker';
import CalendarPicker from '../../components/UI/CalenderPicker';
import {useSnackbar} from '../../context/SnackbarContext';
import {HeaderItems} from '../../constants/constants';

// --- TYPE DEFINITIONS ---
type BenchmarkPoint = {id: string; label: string};

// Source data for each location ID
type LocationData = {
  id: string;
  chainage: string;
  offset: string;
  hi: string;
  calculatedRl: string;
  designRl: string;
};

// State for each row in the table
type TableRowData = {
  rowId: number; // Unique key for the row
  selectedLocationId: string | null;
  chainage: string;
  offset: string;
  bsIsFs: string; // User input
  hi: string;
  calculatedRl: string;
  designRl: string;
};

// --- MAIN COMPONENT ---
export default function LevelChecking() {
  const navigation = useNavigation<any>();
  const {showSnackbar} = useSnackbar();
  const isFocused = useIsFocused();
  const [date, setDate] = useState<string>('');
  const [startPointId, setStartPointId] = useState<string | null>(null);
  const [endPointId, setEndPointId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableRowData[]>([
    {
      rowId: 1,
      selectedLocationId: null,
      chainage: '',
      offset: '',
      bsIsFs: '',
      hi: '',
      calculatedRl: '',
      designRl: '',
    },
  ]);
  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.recordingOfActualRL);
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  }, [isFocused, navigation]);
  // Data sources for dropdowns
  const [benchmarkPoints, setBenchmarkPoints] = useState<BenchmarkPoint[]>([]);
  const [locationDataSource, setLocationDataSource] = useState<LocationData[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      // Simulate fetching both datasets required for the form
      Promise.all([
        // Fetch Temporary Benchmarks for top dropdowns
        new Promise<BenchmarkPoint[]>(resolve =>
          setTimeout(
            () =>
              resolve([
                {id: 'TBM-001', label: 'TBM-001'},
                {id: 'TBM-002', label: 'TBM-002'},
                {id: 'TBM-003', label: 'TBM-003'},
              ]),
            1000,
          ),
        ),
        // Fetch Location Data for the table
        new Promise<LocationData[]>(resolve =>
          setTimeout(
            () =>
              resolve([
                {
                  id: 'LOC-01',
                  chainage: '100.000',
                  offset: '5.000',
                  hi: '101.500',
                  calculatedRl: '100.250',
                  designRl: '100.200',
                },
                {
                  id: 'LOC-02',
                  chainage: '110.000',
                  offset: '5.000',
                  hi: '101.500',
                  calculatedRl: '100.350',
                  designRl: '100.300',
                },
                {
                  id: 'LOC-03',
                  chainage: '120.000',
                  offset: '0.000',
                  hi: '102.100',
                  calculatedRl: '101.100',
                  designRl: '101.000',
                },
                {
                  id: 'LOC-04',
                  chainage: '130.000',
                  offset: '-5.000',
                  hi: '102.100',
                  calculatedRl: '100.950',
                  designRl: '100.900',
                },
              ]),
            1000,
          ),
        ),
      ]).then(([fetchedBenchmarks, fetchedLocations]) => {
        setBenchmarkPoints(fetchedBenchmarks);
        setLocationDataSource(fetchedLocations);
        setLoading(false);
      });
    }
  }, [isFocused]);

  // --- HANDLER FUNCTIONS ---
  const handleAddRow = () => {
    setTableData(prev => [
      ...prev,
      {
        rowId: Date.now(),
        selectedLocationId: null,
        chainage: '',
        offset: '',
        bsIsFs: '',
        hi: '',
        calculatedRl: '',
        designRl: '',
      },
    ]);
  };

  const handleRemoveRow = (rowId: number) => {
    if (tableData.length <= 1) {
      showSnackbar('At least one row is required.', 'info');
      return;
    }
    setTableData(prev => prev.filter(row => row.rowId !== rowId));
  };

  // Auto-populates fields when a Location ID is selected
  const handleLocationIdChange = (rowId: number, selectedLocId: string) => {
    const selectedLocData = locationDataSource.find(
      loc => loc.id === selectedLocId,
    );
    setTableData(prev =>
      prev.map(row =>
        row.rowId === rowId
          ? {
              ...row,
              selectedLocationId: selectedLocId,
              chainage: selectedLocData?.chainage || '',
              offset: selectedLocData?.offset || '',
              hi: selectedLocData?.hi || '',
              calculatedRl: selectedLocData?.calculatedRl || '',
              designRl: selectedLocData?.designRl || '',
            }
          : row,
      ),
    );
  };

  // Handles user input for the BS/IS/FS field
  const handleBsIsFsChange = (rowId: number, value: string) => {
    setTableData(prev =>
      prev.map(row => (row.rowId === rowId ? {...row, bsIsFs: value} : row)),
    );
  };

  const validateForm = (): boolean => {
    if (!date || !startPointId || !endPointId) {
      showSnackbar(
        'Please fill date and select both start and end points.',
        'error',
      );
      return false;
    }
    for (const row of tableData) {
      if (!row.selectedLocationId || !row.bsIsFs) {
        showSnackbar(
          'Please select a Location ID and enter a BS/IS/FS value for all rows.',
          'error',
        );
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      showSnackbar('Data saved successfully!', 'success');
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submissionData = {
        date,
        startPointId,
        endPointId,
        levels: tableData,
      };
      console.log('Submitting Data:', JSON.stringify(submissionData, null, 2));
      showSnackbar('Data submitted successfully!', 'success');
      navigation.goBack();
    }
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A2AAF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const benchmarkItems = [
    {label: 'Select Benchmark', value: ''},
    ...benchmarkPoints.map(p => ({label: p.label, value: p.id})),
  ];
  const locationIdItems = [
    {label: 'Select ID', value: ''},
    ...locationDataSource.map(loc => ({label: loc.id, value: loc.id})),
  ];

  const renderTableRow = (rowData: TableRowData, index: number) => (
    <View
      key={rowData.rowId}
      style={[
        styles.tableBodyRow,
        index === tableData.length - 1 && styles.tableBodyRowLast,
      ]}>
      <View style={styles.tableCell}>
        <DropdownPicker
          items={locationIdItems}
          value={rowData.selectedLocationId || ''}
          onChange={(value: string) =>
            handleLocationIdChange(rowData.rowId, value)
          }
        />
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.readOnlyText}>{rowData.chainage || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.readOnlyText}>{rowData.offset || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <TextInput
          style={styles.input}
          value={rowData.bsIsFs}
          onChangeText={v => handleBsIsFsChange(rowData.rowId, v)}
          placeholder="0.000"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.readOnlyText}>{rowData.hi || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.readOnlyText}>{rowData.calculatedRl || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.readOnlyText}>{rowData.designRl || 'N/A'}</Text>
      </View>
      <View style={styles.tableCellAction}>
        <TouchableOpacity
          onPress={() => handleRemoveRow(rowData.rowId)}
          style={styles.removeRowButton}>
          <Text style={styles.removeRowButtonText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topFormContainer}>
          <CalendarPicker
            label="Date of Survey *"
            value={date}
            onChange={(newDate: string) => setDate(newDate)}
          />
          <View style={styles.dropdownWrapper}>
            <DropdownPicker
              label="Starting Point 1 *"
              items={benchmarkItems}
              value={startPointId || ''}
              onChange={(value: string) => setStartPointId(value)}
            />
          </View>
          <View style={styles.dropdownWrapper}>
            <DropdownPicker
              label="End Point 1 *"
              items={benchmarkItems}
              value={endPointId || ''}
              onChange={(value: string) => setEndPointId(value)}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <ScrollView horizontal>
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Location ID</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Chainage</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Offset from CL</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>BS/IS/FS</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>HI</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Calculated RL</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Design RL</Text>
                </View>
                <View style={styles.tableHeaderCellAction}>
                  <Text style={styles.tableHeaderText}>Action</Text>
                </View>
              </View>
              {tableData.map((row, index) => renderTableRow(row, index))}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.addRowButton} onPress={handleAddRow}>
            <Text style={styles.addRowButtonText}>+ Add Row</Text>
          </TouchableOpacity>
        </View>

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
  formContent: {flex: 1, paddingTop: 10},
  topFormContainer: {paddingHorizontal: 10, marginBottom: 20},
  dropdownWrapper: {marginTop: 15},
  sectionContainer: {marginBottom: 16, paddingHorizontal: 10},
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 1100,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderCell: {width: 150, paddingHorizontal: 5, justifyContent: 'center'},
  tableHeaderCellAction: {
    width: 80,
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
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
    alignItems: 'center',
  },
  tableBodyRowLast: {borderBottomWidth: 0},
  tableCell: {width: 150, paddingHorizontal: 5},
  tableCellAction: {width: 80, justifyContent: 'center', alignItems: 'center'},
  input: {
    height: 40,
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#2D3748',
    textAlign: 'center',
  },
  readOnlyText: {
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
    color: '#4A5568',
    fontSize: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addRowButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#5A2AAF',
  },
  addRowButtonText: {color: '#5A2AAF', fontWeight: '600', fontSize: 14},
  removeRowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeRowButtonText: {color: '#FFF', fontSize: 18, fontWeight: 'bold'},
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
  },
  saveButton: {backgroundColor: '#28A745', marginRight: 10},
  submitButton: {backgroundColor: '#5A2AAF', marginLeft: 10},
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: '700'},
  bottomSpacing: {height: 40},
});
