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
type ControlPoint = {id: string; label: string};

type DesignCoordinate = {
  id: string;
  designEasting: string;
  designNorthing: string;
};

type TableRowData = {
  rowId: number; // Unique key for the row
  selectedCoordinateId: string | null;
  designEasting: string;
  actualEasting: string;
  designNorthing: string;
  actualNorthing: string;
};

// --- MAIN COMPONENT ---
export default function LayoutCheck() {
  // --- STATE MANAGEMENT ---
  const navigation = useNavigation<any>();
  const {showSnackbar} = useSnackbar();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.recordingOfActualLayout);
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  }, [isFocused, navigation]);
  const [date, setDate] = useState<string>('');
  const [startPoint1Id, setStartPoint1Id] = useState<string | null>(null);
  const [startPoint2Id, setStartPoint2Id] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableRowData[]>([
    {
      rowId: 1,
      selectedCoordinateId: null,
      designEasting: '',
      actualEasting: '',
      designNorthing: '',
      actualNorthing: '',
    },
  ]);

  // Data sources for dropdowns
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [designCoordinates, setDesignCoordinates] = useState<
    DesignCoordinate[]
  >([]);

  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      // Simulate fetching both datasets required for the form
      Promise.all([
        // Fetch Control Points for top dropdowns
        new Promise<ControlPoint[]>(resolve =>
          setTimeout(
            () =>
              resolve([
                {id: 'TCP-001', label: 'TCP-001'},
                {id: 'TCP-002', label: 'TCP-002'},
                {id: 'TCP-003', label: 'TCP-003'},
              ]),
            1000,
          ),
        ),
        // Fetch Design Coordinates for the table dropdown
        new Promise<DesignCoordinate[]>(resolve =>
          setTimeout(
            () =>
              resolve([
                {
                  id: 'CL-01',
                  designEasting: '345123.123',
                  designNorthing: '1234567.123',
                },
                {
                  id: 'CL-02',
                  designEasting: '345124.456',
                  designNorthing: '1234568.456',
                },
                {
                  id: 'CL-03',
                  designEasting: '345125.789',
                  designNorthing: '1234569.789',
                },
                {
                  id: 'CL-04',
                  designEasting: '345126.987',
                  designNorthing: '1234570.987',
                },
              ]),
            1000,
          ),
        ),
      ]).then(([fetchedControlPoints, fetchedDesignCoords]) => {
        setControlPoints(fetchedControlPoints);
        setDesignCoordinates(fetchedDesignCoords);
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
        selectedCoordinateId: null,
        designEasting: '',
        actualEasting: '',
        designNorthing: '',
        actualNorthing: '',
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

  // Auto-populates Design fields when a Coordinate ID is selected
  const handleCoordinateIdChange = (rowId: number, selectedCoordId: string) => {
    const selectedCoord = designCoordinates.find(c => c.id === selectedCoordId);
    setTableData(prev =>
      prev.map(row =>
        row.rowId === rowId
          ? {
              ...row,
              selectedCoordinateId: selectedCoordId,
              designEasting: selectedCoord?.designEasting || '',
              designNorthing: selectedCoord?.designNorthing || '',
            }
          : row,
      ),
    );
  };

  // Handles user input for the 'Actual' fields
  const handleActualInputChange = (
    rowId: number,
    field: 'actualEasting' | 'actualNorthing',
    value: string,
  ) => {
    setTableData(prev =>
      prev.map(row => (row.rowId === rowId ? {...row, [field]: value} : row)),
    );
  };

  const validateForm = (): boolean => {
    if (!date || !startPoint1Id || !startPoint2Id) {
      showSnackbar(
        'Please fill in date and select both starting points.',
        'error',
      );
      return false;
    }
    for (const row of tableData) {
      if (
        !row.selectedCoordinateId ||
        !row.actualEasting ||
        !row.actualNorthing
      ) {
        showSnackbar('Please fill all fields in every table row.', 'error');
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
        startPoint1Id,
        startPoint2Id,
        coordinates: tableData,
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

  const controlPointItems = [
    {label: 'Select Control Point', value: ''},
    ...controlPoints.map(p => ({label: p.label, value: p.id})),
  ];
  const coordinateIdItems = [
    {label: 'Select ID', value: ''},
    ...designCoordinates.map(c => ({label: c.id, value: c.id})),
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
          items={coordinateIdItems}
          value={rowData.selectedCoordinateId || ''}
          onChange={(value: string) =>
            handleCoordinateIdChange(rowData.rowId, value)
          }
        />
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.readOnlyText}>
          {rowData.designEasting || 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <TextInput
          style={styles.input}
          value={rowData.actualEasting}
          onChangeText={v =>
            handleActualInputChange(rowData.rowId, 'actualEasting', v)
          }
          placeholder="0.000"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.readOnlyText}>
          {rowData.designNorthing || 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <TextInput
          style={styles.input}
          value={rowData.actualNorthing}
          onChangeText={v =>
            handleActualInputChange(rowData.rowId, 'actualNorthing', v)
          }
          placeholder="0.000"
          keyboardType="numeric"
        />
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
            label="Date *"
            value={date}
            onChange={(newDate: string) => setDate(newDate)}
          />
          <View style={styles.dropdownWrapper}>
            <DropdownPicker
              label="Starting Point 1 *"
              items={controlPointItems}
              value={startPoint1Id || ''}
              onChange={(value: string) => setStartPoint1Id(value)}
            />
          </View>
          <View style={styles.dropdownWrapper}>
            <DropdownPicker
              label="Starting Point 2 *"
              items={controlPointItems}
              value={startPoint2Id || ''}
              onChange={(value: string) => setStartPoint2Id(value)}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <ScrollView horizontal>
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Coordinate ID</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Design Easting</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Actual Easting</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Design Northing</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Actual Northing</Text>
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
    minWidth: 850,
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
  },
  readOnlyText: {
    height: 40,
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
