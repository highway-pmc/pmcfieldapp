import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
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
type BenchmarkPoint = {
  id: string;
  label: string;
};

type TableRowData = {
  id: number; // Unique ID for the row for key prop
  chainage: string;
  offset: string;
  bsIsFs: string;
  remarks: string;
};

// --- MAIN COMPONENT ---
export default function GroundLevelRecording() {
  // --- STATE AND HOOKS ---
  const [date, setDate] = useState<string>('');
  const [startPointId, setStartPointId] = useState<string | null>(null);
  const [endPointId, setEndPointId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableRowData[]>([
    {id: 1, chainage: '', offset: '', bsIsFs: '', remarks: ''},
  ]);
  const [benchmarkPoints, setBenchmarkPoints] = useState<BenchmarkPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();
  const {showSnackbar} = useSnackbar();
  const isFocused = useIsFocused();

  // --- DATA FETCHING ---
  useEffect(() => {
    if (isFocused) {
      // Simulate fetching Temporary Bench Marking IDs
      const fetchBenchmarkPoints = () => {
        setLoading(true);
        setTimeout(() => {
          setBenchmarkPoints([
            {id: 'TBM-001', label: 'TBM-001'},
            {id: 'TBM-002', label: 'TBM-002'},
            {id: 'TBM-003', label: 'TBM-003'},
            {id: 'TBM-004', label: 'TBM-004'},
          ]);
          setLoading(false);
        }, 1000);
      };
      fetchBenchmarkPoints();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.groundLevelRecording);
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
  const handleAddRow = () => {
    setTableData(prevData => [
      ...prevData,
      {id: Date.now(), chainage: '', offset: '', bsIsFs: '', remarks: ''}, // Use timestamp for unique key
    ]);
  };

  const handleRemoveRow = (id: number) => {
    if (tableData.length <= 1) {
      showSnackbar('At least one row is required.', 'info');
      return;
    }
    setTableData(prevData => prevData.filter(row => row.id !== id));
  };

  const handleTableRowChange = (
    id: number,
    field: keyof Omit<TableRowData, 'id'>,
    value: string,
  ) => {
    setTableData(prevData =>
      prevData.map(row => (row.id === id ? {...row, [field]: value} : row)),
    );
  };

  const validateForm = (): boolean => {
    if (!date || !startPointId || !endPointId) {
      showSnackbar(
        'Please fill in the date and select both start and end points.',
        'error',
      );
      return false;
    }
    for (const row of tableData) {
      if (!row.chainage || !row.offset || !row.bsIsFs || !row.remarks) {
        showSnackbar('Please fill out all fields in every table row.', 'error');
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log('Data saved locally:', {
        date,
        startPointId,
        endPointId,
        tableData,
      });
      showSnackbar('Data has been saved successfully!', 'success');
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submissionData = {date, startPointId, endPointId, levels: tableData};
    console.log('Submitting Data:', JSON.stringify(submissionData, null, 2));
    showSnackbar('Data submitted to server!', 'success');
    navigation.goBack();
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A2AAF" />
        <Text style={styles.loadingText}>Loading Data...</Text>
      </View>
    );
  }

  const benchmarkDropdownItems = [
    {label: 'Select Benchmark', value: ''},
    ...benchmarkPoints.map(p => ({label: p.label, value: p.id})),
  ];

  const renderTableRow = (rowData: TableRowData, index: number) => (
    <View
      key={rowData.id}
      style={[
        styles.tableBodyRow,
        index === tableData.length - 1 && styles.tableBodyRowLast,
      ]}>
      <View style={styles.tableCell}>
        <TextInput
          style={styles.input}
          value={rowData.chainage}
          onChangeText={v => handleTableRowChange(rowData.id, 'chainage', v)}
          placeholder="0.000"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.tableCell}>
        <TextInput
          style={styles.input}
          value={rowData.offset}
          onChangeText={v => handleTableRowChange(rowData.id, 'offset', v)}
          placeholder="0.000"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.tableCell}>
        <TextInput
          style={styles.input}
          value={rowData.bsIsFs}
          onChangeText={v => handleTableRowChange(rowData.id, 'bsIsFs', v)}
          placeholder="0.000"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.tableCell}>
        <TextInput
          style={styles.input}
          value={rowData.remarks}
          onChangeText={v => handleTableRowChange(rowData.id, 'remarks', v)}
          placeholder="Remarks"
          maxLength={50}
        />
      </View>
      <View style={styles.tableCellAction}>
        <TouchableOpacity
          onPress={() => handleRemoveRow(rowData.id)}
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
            label="Date *"
            value={date}
            onChange={(newDate: string) => setDate(newDate)}
          />
          <View style={styles.dropdownWrapper}>
            <DropdownPicker
              label="Starting Point 1 *"
              items={benchmarkDropdownItems}
              value={startPointId || ''}
              onChange={(value: string) => setStartPointId(value)}
            />
          </View>
          <View style={styles.dropdownWrapper}>
            <DropdownPicker
              label="End Point 1 *"
              items={benchmarkDropdownItems}
              value={endPointId || ''}
              onChange={(value: string) => setEndPointId(value)}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ground Level Details</Text>
          </View>
          <ScrollView horizontal>
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
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
                  <Text style={styles.tableHeaderText}>Remarks</Text>
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
  topFormContainer: {paddingHorizontal: 10, marginBottom: 15},
  dropdownWrapper: {marginTop: 15},
  sectionContainer: {marginBottom: 16, paddingHorizontal: 10},
  sectionHeader: {marginBottom: 10, paddingHorizontal: 4},
  sectionTitle: {fontSize: 18, fontWeight: '700', color: '#2D3748'},
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 650,
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
    alignItems: 'center',
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
