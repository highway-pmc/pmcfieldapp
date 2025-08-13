import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeEventEmitter,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DropdownPicker from '../../components/UI/DropdownPicker';
import {useIsFocused, useRoute, useNavigation} from '@react-navigation/native';
import {getControlPoints} from './../ManageUsers/actions';
import {useSnackbar} from '../../context/SnackbarContext';
import CalendarPicker from '../../components/UI/CalenderPicker';
import {HeaderItems} from '../../constants/constants';

// Define the structure for control points fetched from the API
type ControlPoint = {
  'CP ID': string;
  'Chainage (3 Decimal point)': string;
  'Easting(6 digit +3 Decimal point)': string;
  'Northing 7 digit +3 Decimal point))': string;
  'Physical Description of CP( Max 50 Char)': string;
  Photograph: string;
};

// Define the structure for a row in the new TBM table
type TBMRow = {
  tbmId: string;
  bs: string;
  fs: string;
  description: string;
};

// Define the structure for a selection in the first table
type ControlPointSelection = {
  id: string;
  benchmark: string;
};

// Define the main data structure for each form set (tab)
type FormSet = {
  point1: ControlPointSelection;
  point2: ControlPointSelection;
  tbmData: TBMRow[];
  isSaved: boolean;
  wasEverSaved: boolean;
};

const {width} = Dimensions.get('window');

// Initial state for a new TBM row
const initialTBMRow = (): TBMRow => ({
  tbmId: '',
  bs: '',
  fs: '',
  description: '',
});

//Generates the next sequential TBM ID (e.g., TBM001, TBM002).

const getNextTbmId = (allSets: FormSet[]): string => {
  let maxTbmNum = 0;
  allSets.forEach(set => {
    set.tbmData.forEach(tbm => {
      const match = tbm.tbmId.match(/TBM(\d+)/);
      if (match) {
        maxTbmNum = Math.max(maxTbmNum, parseInt(match[1], 10));
      }
    });
  });
  return `TBM${String(maxTbmNum + 1).padStart(3, '0')}`;
};

// Initial state for a new form set
const initialFormSet = (allExistingSets: FormSet[] = []): FormSet => {
  const nextTbmId = getNextTbmId(allExistingSets);
  return {
    point1: {id: '', benchmark: ''},
    point2: {id: '', benchmark: ''},
    tbmData: [{...initialTBMRow(), tbmId: nextTbmId}],
    isSaved: false,
    wasEverSaved: false,
  };
};

export default function BenchMark() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [allFormSets, setAllFormSets] = useState<FormSet[]>([initialFormSet()]);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [date, setDate] = useState<string>('');

  const isFocused = useIsFocused();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();

  const {projectId, projectModuleId, segmentId, componentId} =
    (route.params as any) || {};

  const {
    controlPoints: apiControlPoints,
    loading: isLoading,
    error,
  } = useSelector((state: any) => state.WorkAssignment);

  const currentFormSet = allFormSets[activeTab] || {};
  const isCurrentSetSaved = currentFormSet.isSaved;
  const wasCurrentSetEverSaved = currentFormSet.wasEverSaved; // For simplicity, we assume we can always add a new set after saving the current one.

  const canAddNextSet = isCurrentSetSaved;

  useEffect(() => {
    if (isFocused) {
      // Set the header title for this screen
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.benchMark);
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    if (isFocused && projectId && projectModuleId && segmentId && componentId) {
      // Fetch control points data from the API on screen focus
      dispatch(
        getControlPoints({
          projectId,
          projectModuleId,
          segmentId,
          componentId,
          taskCategory: 'survey',
        }),
      );
    }
  }, [isFocused, dispatch, projectId, projectModuleId, segmentId, componentId]);

  useEffect(() => {
    if (apiControlPoints && Array.isArray(apiControlPoints)) {
      setControlPoints(apiControlPoints);
    }
  }, [apiControlPoints]);

  useEffect(() => {
    if (error) {
      showSnackbar(`Failed to fetch control points: ${error}`, 'error');
    }
  }, [error]); // Prepare items for the dropdown picker

  const controlPointDropdownItems = controlPoints.map(cp => ({
    label: cp['CP ID'],
    value: cp['CP ID'],
  })); // Handle selection change in the first table (Control Points)

  const handleControlPointChange = (
    value: string,
    pointSetterKey: 'point1' | 'point2',
  ) => {
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      if (!newSets[activeTab]) return prevSets;

      const selectedCp = controlPoints.find(cp => cp['CP ID'] === value);

      newSets[activeTab][pointSetterKey] = selectedCp
        ? {
            id: value, // Using Easting as the 'Bench mark' value for this example
            benchmark: selectedCp['Easting(6 digit +3 Decimal point)'],
          }
        : {id: '', benchmark: ''};
      return newSets;
    });
  }; // Handle input changes in the second table (TBM)

  const handleTBMInputChange = (
    rowIndex: number,
    field: keyof TBMRow,
    value: string,
  ) => {
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      const currentSet = newSets[activeTab];
      if (!currentSet?.tbmData?.[rowIndex]) return prevSets;

      let updatedValue = value; // Prevent editing if the set is saved
      if (isCurrentSetSaved) return prevSets;

      if (field === 'description' && value.length > 50) {
        updatedValue = currentSet.tbmData[rowIndex][field];
      }

      newSets[activeTab].tbmData[rowIndex][field] = updatedValue;
      return newSets;
    });
  }; // Add a new empty set/tab

  const handleAddSet = () => {
    if (!isCurrentSetSaved) {
      showSnackbar(
        'Please save the current set before adding a new one.',
        'error',
      );
      return;
    }
    setAllFormSets(prevSets => [...prevSets, initialFormSet(prevSets)]);
    setActiveTab(allFormSets.length);
  }; // Add a new row to the TBM table

  const handleAddTBMRow = () => {
    if (wasCurrentSetEverSaved) {
      showSnackbar('Cannot add new rows to a saved set.', 'error');
      return;
    }
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].tbmData.push({
        ...initialTBMRow(),
        tbmId: getNextTbmId(newSets),
      });
      return newSets;
    });
  }; // Remove a row from the TBM table

  const handleRemoveTBMRow = (rowIndexToRemove: number) => {
    if (wasCurrentSetEverSaved) {
      showSnackbar('Cannot remove rows from a saved set.', 'error');
      return;
    }
    if (currentFormSet.tbmData.length <= 1) {
      showSnackbar('At least one TBM row is required.', 'info');
      return;
    }
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].tbmData.splice(rowIndexToRemove, 1);
      return newSets;
    });
  }; // Validate and save the current set

  const handleSaveSet = () => {
    const currentSet = allFormSets[activeTab];
    let validationError: string | null = null;

    if (!date) {
      validationError = 'Please select a date.';
    } else if (!currentSet.point1.id || !currentSet.point2.id) {
      validationError = 'Both control points must be selected.';
    }

    if (!validationError) {
      for (let i = 0; i < currentSet.tbmData.length; i++) {
        const tbm = currentSet.tbmData[i];
        if (!tbm.bs.trim() || !tbm.fs.trim() || !tbm.description.trim()) {
          validationError = `All fields in TBM row #${i + 1} must be filled.`;
          break;
        }
      }
    }

    if (validationError) {
      showSnackbar(validationError, 'error');
      return;
    }

    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].isSaved = true;
      newSets[activeTab].wasEverSaved = true;
      return newSets;
    });
    showSnackbar(`Set ${activeTab + 1} has been saved.`, 'success');
  }; // Toggle the current set to edit mode

  const handleEditSet = () => {
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].isSaved = false;
      return newSets;
    });
  }; // Validate all data and prepare for submission

  const handleSubmitAllData = () => {
    if (!date) {
      showSnackbar('Please select a date for the inspection.', 'error');
      return;
    }
    if (allFormSets.some(set => !set.isSaved)) {
      showSnackbar('Please save all sets before submitting.', 'error');
      return;
    } // Format data for submission

    const formattedData = {
      date: date,
      sets: {},
    };

    allFormSets.forEach((set, index) => {
      const setName = `set${index + 1}`;
      (formattedData.sets as any)[setName] = {
        controlPoints: {
          point1: set.point1,
          point2: set.point2,
        },
        tbmData: set.tbmData.map(tbm => ({
          'TBM ID': tbm.tbmId,
          BS: tbm.bs,
          FS: tbm.fs,
          'Physical Description': tbm.description,
        })),
      };
    }); // Simulate API call and log the formatted data

    console.log('Submitting Data:', JSON.stringify(formattedData, null, 2)); // saveBenchMarkData(formattedData); // Example API call function
    showSnackbar('All data has been submitted successfully.', 'success');
    setTimeout(() => navigation.goBack(), 1000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A2AAF" />
        <Text style={styles.loadingText}>Loading Data...</Text>
      </View>
    );
  } // Renders a single row for the first table (Control Points)

  const renderControlPointRow = (
    label: string,
    pointData: ControlPointSelection,
    setterKey: 'point1' | 'point2',
    isLast: boolean = false,
  ) => (
    <View
      key={label}
      style={[styles.tableBodyRow, isLast && styles.tableBodyRowLast]}>
      <View style={styles.tableCellPoint}>
        <Text style={styles.tableCellPointText}>{label}</Text>
      </View>

      <View style={styles.tableCellDropdown}>
        {wasCurrentSetEverSaved ? (
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyInputText}>
              {pointData?.id || 'N/A'}
            </Text>
          </View>
        ) : (
          <DropdownPicker
            items={[{label: 'Select', value: ''}, ...controlPointDropdownItems]}
            value={pointData?.id || ''}
            onChange={(value: string) =>
              handleControlPointChange(value, setterKey)
            }
          />
        )}
      </View>
      <View style={styles.tableCellValue}>
        <Text style={styles.tableCellValueText} numberOfLines={1}>
          {pointData?.benchmark || 'N/A'}
        </Text>
      </View>
    </View>
  ); // Renders a single row for the second table (TBM)

  const renderTBMRow = (
    tbmRow: TBMRow,
    index: number,
    isLast: boolean = false,
  ) => {
    const areFieldsEditable = !isCurrentSetSaved;
    return (
      <View
        key={index}
        style={[styles.tableBodyRow, isLast && styles.tableBodyRowLast]}>
        <View style={styles.tableCellTCPId}>
          <Text style={styles.tableCellPointText}>{tbmRow.tbmId}</Text>
        </View>
        <View style={styles.tableCellTCPInput}>
          <TextInput
            style={[
              styles.tcpInput,
              !areFieldsEditable && styles.readOnlyTcpInput,
            ]}
            keyboardType="numeric"
            value={tbmRow.bs}
            onChangeText={value => handleTBMInputChange(index, 'bs', value)}
            placeholder="BS Value"
            editable={areFieldsEditable}
          />
        </View>
        <View style={styles.tableCellTCPInput}>
          <TextInput
            style={[
              styles.tcpInput,
              !areFieldsEditable && styles.readOnlyTcpInput,
            ]}
            keyboardType="numeric"
            value={tbmRow.fs}
            onChangeText={value => handleTBMInputChange(index, 'fs', value)}
            placeholder="FS Value"
            editable={areFieldsEditable}
          />
        </View>
        <View style={styles.tableCellTCPDescription}>
          <TextInput
            style={[
              styles.tcpDescriptionInput,
              !areFieldsEditable && styles.readOnlyTcpInput,
            ]}
            value={tbmRow.description}
            onChangeText={value =>
              handleTBMInputChange(index, 'description', value)
            }
            placeholder="Description"
            maxLength={50}
            editable={areFieldsEditable}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.removeTCPRowButton,
            wasCurrentSetEverSaved && styles.disabledButton,
          ]}
          onPress={() => handleRemoveTBMRow(index)}
          disabled={wasCurrentSetEverSaved}>
          <Text style={styles.removeTCPRowButtonText}>-</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContentContainer}>
          {allFormSets.map((set, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, activeTab === index && styles.activeTab]}
              onPress={() => setActiveTab(index)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.activeTabText,
                ]}>
                Set {index + 1} {set.isSaved ? ' (Saved)' : ' *'}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.addTabButton,
              !canAddNextSet && styles.disabledButton,
            ]}
            onPress={handleAddSet}
            disabled={!canAddNextSet}>
            <Text style={styles.addTabButtonText}>+ Add Set</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <ScrollView
        style={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bench mark detail</Text>
          </View>
          <View style={styles.tableCard}>
            <View style={styles.tableHeaderRow}>
              <View style={styles.tableHeaderCellPoint}>
                <Text style={styles.tableHeaderText}>Point</Text>
              </View>
              <View style={styles.tableHeaderCellDropdown}>
                <Text style={styles.tableHeaderText}>Control point Id</Text>
              </View>
              <View style={styles.tableHeaderCellValue}>
                <Text style={styles.tableHeaderText}>Bench mark</Text>
              </View>
            </View>
            {renderControlPointRow('Point 1', currentFormSet.point1, 'point1')}
            {renderControlPointRow(
              'Point 2',
              currentFormSet.point2,
              'point2',
              true,
            )}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TBM Details</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.tableHeaderCellTCPId}>
                  <Text style={styles.tableHeaderText}>TBM ID</Text>
                </View>
                <View style={styles.tableHeaderCellTCPInput}>
                  <Text style={styles.tableHeaderText}>BS</Text>
                </View>
                <View style={styles.tableHeaderCellTCPInput}>
                  <Text style={styles.tableHeaderText}>FS</Text>
                </View>
                <View style={styles.tableHeaderCellTCPDescription}>
                  <Text style={styles.tableHeaderText}>
                    Physical Description
                  </Text>
                </View>
                <View style={styles.tableHeaderCellRemove}>
                  <Text style={styles.tableHeaderText}>Action</Text>
                </View>
              </View>
              {currentFormSet.tbmData?.map((tbmRow, index) =>
                renderTBMRow(
                  tbmRow,
                  index,
                  index === currentFormSet.tbmData.length - 1,
                ),
              )}
            </View>
          </ScrollView>
          {!wasCurrentSetEverSaved && (
            <TouchableOpacity
              style={styles.addTCPRowButton}
              onPress={handleAddTBMRow}>
              <Text style={styles.addTCPRowButtonText}>+ Add TBM Row</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.saveSetContainer}>
          {isCurrentSetSaved ? (
            <TouchableOpacity
              style={styles.editSetButton}
              onPress={handleEditSet}>
              <Text style={styles.saveSetButtonText}>Edit Set</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.saveSetButton}
              onPress={handleSaveSet}>
              <Text style={styles.saveSetButtonText}>Save Current Set</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.commonDateContainer}>
          <CalendarPicker
            label="Date *"
            value={date}
            onChange={(newDate: string) => setDate(newDate)}
          />
        </View>
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitAllData}>
            <Text style={styles.submitButtonText}>Submit All Data</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// Styles have been adjusted for the new table layouts
const styles = StyleSheet.create({
  editSetButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {marginTop: 10, fontSize: 16, color: '#4A5568'},
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  commonDateContainer: {
    paddingHorizontal: 10,
    paddingTop: 5,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tabWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  tabContainer: {},
  tabContentContainer: {paddingHorizontal: 10, alignItems: 'center'},
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#F7F3FF',
    borderWidth: 1,
    borderColor: '#5A2AAF',
  },
  tabText: {color: '#4A5568', fontWeight: '600', fontSize: 13},
  activeTabText: {color: '#5A2AAF'},
  addTabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#5A2AAF',
    borderRadius: 20,
  },
  addTabButtonText: {color: '#FFF', fontWeight: '700', fontSize: 13},
  disabledButton: {backgroundColor: '#A0A0A0'},
  formContent: {flex: 1, padding: 10, paddingTop: 10},
  sectionContainer: {marginBottom: 16},
  sectionHeader: {
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {fontSize: 18, fontWeight: '700', color: '#2D3748'},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  readOnlyInput: {
    height: 40,
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  readOnlyInputText: {fontSize: 15, color: '#718096'},
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0', // minWidth removed to allow Bench mark table to fit the screen
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderCellPoint: {
    flex: 0.25, // Changed from fixed width
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  tableHeaderCellDropdown: {
    flex: 0.4, // Changed from fixed width
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellValue: {
    flex: 0.35, // Adjusted flex value
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellTCPId: {width: 80, paddingHorizontal: 5},
  tableHeaderCellTCPInput: {width: 120, paddingHorizontal: 5},
  tableHeaderCellTCPDescription: {width: 200, paddingHorizontal: 5},
  tableHeaderCellRemove: {width: 60, alignItems: 'center'},
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
  },
  tableBodyRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    alignItems: 'center',
  },
  tableBodyRowLast: {borderBottomWidth: 0},
  tableCellPoint: {
    flex: 0.25, // Changed from fixed width
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  tableCellPointText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2D3748',
    textAlign: 'center',
  },
  tableCellDropdown: {
    flex: 0.4, // Changed from fixed width
    paddingHorizontal: 5,
  },
  tableCellValue: {
    flex: 0.35, // Adjusted flex value
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableCellValueText: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
  },
  tableCellTCPId: {width: 80, paddingHorizontal: 5},
  tableCellTCPInput: {width: 120, paddingHorizontal: 5},
  tableCellTCPDescription: {width: 200, paddingHorizontal: 5},
  tcpInput: {
    height: 38,
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#2D3748',
    textAlign: 'center',
  },
  readOnlyTcpInput: {backgroundColor: '#F8FAFC', color: '#718096'},
  tcpDescriptionInput: {
    height: 38,
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#2D3748',
  },
  removeTCPRowButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  removeTCPRowButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  addTCPRowButton: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#5A2AAF',
  },
  addTCPRowButtonText: {
    color: '#5A2AAF',
    fontWeight: '600',
    fontSize: 13,
  },
  saveSetContainer: {
    marginTop: 15,
    paddingHorizontal: 4,
  },
  saveSetButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveSetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  submitContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#5A2AAF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSpacing: {height: 30},
});
