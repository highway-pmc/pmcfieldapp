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
import {HeaderItems} from '../../constants/constants';
import {getControlPoints} from './../ManageUsers/actions';
import {useSnackbar} from '../../context/SnackbarContext';
import CalendarPicker from '../../components/UI/CalenderPicker';

// Define types for better code quality and readability
type ControlPoint = {
  'CP ID': string;
  'Chainage (3 Decimal point)': string;
  'Easting(6 digit +3 Decimal point)': string;
  'Northing 7 digit +3 Decimal point))': string;
  'Physical Description of CP( Max 50 Char)': string;
  Photograph: string;
};

type TCPRow = {
  tcpId: string;
  chainage: string;
  easting: string;
  northing: string;
  description: string;
};

type ControlPointSelection = {
  chainage: string;
  easting: string;
  northing: string;
};

type FormSet = {
  startChainageRFI: string;
  endChainage: string;
  startingPoint1: ControlPointSelection;
  startingPoint2: ControlPointSelection;
  endPoint1: ControlPointSelection;
  endPoint2: ControlPointSelection;
  tcpData: TCPRow[];
  isSaved: boolean;
  wasEverSaved: boolean;
};

const {width} = Dimensions.get('window');

const initialTCPRow = (): TCPRow => ({
  tcpId: '',
  chainage: '',
  easting: '',
  northing: '',
  description: '',
});

/**
 * Generates the next sequential TCP ID (e.g., TCP001, TCP002).
 */
const getNextTcpId = (allSets: FormSet[]): string => {
  let maxTcpNum = 0;
  allSets.forEach(set => {
    set.tcpData.forEach(tcp => {
      const match = tcp.tcpId.match(/TCP(\d+)/);
      if (match) {
        maxTcpNum = Math.max(maxTcpNum, parseInt(match[1], 10));
      }
    });
  });
  return `TCP${String(maxTcpNum + 1).padStart(3, '0')}`;
};

const initialFormSet = (allExistingSets: FormSet[] = []): FormSet => {
  const nextTcpId = getNextTcpId(allExistingSets);
  return {
    startChainageRFI: '',
    endChainage: '',
    startingPoint1: {chainage: '', easting: '', northing: ''},
    startingPoint2: {chainage: '', easting: '', northing: ''},
    endPoint1: {chainage: '', easting: '', northing: ''},
    endPoint2: {chainage: '', easting: '', northing: ''},
    tcpData: [{...initialTCPRow(), tcpId: nextTcpId}],
    isSaved: false,
    wasEverSaved: false,
  };
};

export default function ControlPoints() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [allFormSets, setAllFormSets] = useState<FormSet[]>([initialFormSet()]);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [date, setDate] = useState<string>('');

  const isFocused = useIsFocused();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();

  const {chainageData, projectId, projectModuleId, segmentId, componentId} =
    (route.params as any) || {};

  const {
    controlPoints: apiControlPoints,
    loading: isLoading,
    error,
  } = useSelector((state: any) => state.WorkAssignment);

  const currentFormSet = allFormSets[activeTab] || {};
  const isCurrentSetSaved = currentFormSet.isSaved;
  const wasCurrentSetEverSaved = currentFormSet.wasEverSaved;
  const isFormLocked = allFormSets.some(set => set.wasEverSaved);

  const canAddNextSet =
    isCurrentSetSaved &&
    parseFloat(currentFormSet.endChainage) !== parseFloat(chainageData?.end);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.controlPoint);
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
      setAllFormSets(prevSets => {
        const updatedSets = [...prevSets];
        if (chainageData?.start) {
          updatedSets[0].startChainageRFI = chainageData.start.toString();
        } else if (apiControlPoints.length > 0) {
          updatedSets[0].startChainageRFI =
            apiControlPoints[0]['Chainage (3 Decimal point)'];
        }
        return updatedSets;
      });
    }
  }, [apiControlPoints, chainageData]);

  useEffect(() => {
    if (error) {
      showSnackbar(`Failed to fetch control points: ${error}`, 'error');
    }
  }, [error]);

  const controlPointDropdownItems = controlPoints.map(cp => ({
    label: cp['Chainage (3 Decimal point)'],
    value: cp['Chainage (3 Decimal point)'],
  }));

  const handleInputChange = (
    field: string,
    value: string,
    cpType: string | null = null,
  ) => {
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      if (!newSets[activeTab]) return prevSets;

      if (cpType) {
        const selectedCp = controlPoints.find(
          cp => cp['Chainage (3 Decimal point)'] === value,
        );
        newSets[activeTab][cpType as keyof FormSet] = selectedCp
          ? {
              chainage: value,
              easting: selectedCp['Easting(6 digit +3 Decimal point)'],
              northing: selectedCp['Northing 7 digit +3 Decimal point))'],
            }
          : {chainage: '', easting: '', northing: ''};
      } else {
        newSets[activeTab][field as keyof FormSet] = value as never;
      }
      return newSets;
    });
  };

  const handleTCPInputChange = (
    rowIndex: number,
    field: keyof TCPRow,
    value: string,
  ) => {
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      const currentSet = newSets[activeTab];
      if (!currentSet?.tcpData?.[rowIndex]) return prevSets;

      let updatedValue = value;
      if (
        ['easting', 'northing', 'description'].includes(field) &&
        !currentSet.isSaved
      ) {
        if (field === 'easting' || field === 'northing') {
          const numericValue = parseFloat(value);
          if (
            value === '' ||
            (!isNaN(numericValue) &&
              numericValue >= 0 &&
              numericValue <= 1000000)
          ) {
            const parts = value.split('.');
            if (parts.length > 1 && parts[1].length > 3)
              updatedValue = parts[0] + '.' + parts[1].substring(0, 3);
            if (field === 'easting' && parts[0].length > 6 && value !== '')
              updatedValue = currentSet.tcpData[rowIndex][field];
            if (field === 'northing' && parts[0].length > 7 && value !== '')
              updatedValue = currentSet.tcpData[rowIndex][field];
          } else {
            updatedValue = currentSet.tcpData[rowIndex][field];
          }
        } else if (field === 'description' && value.length > 50) {
          updatedValue = currentSet.tcpData[rowIndex][field];
        }
      } else if (field === 'chainage' && !currentSet.wasEverSaved) {
        const numericValue = parseFloat(value);
        if (
          value === '' ||
          (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 1000000)
        ) {
          const parts = value.split('.');
          if (parts.length > 1 && parts[1].length > 3)
            updatedValue = parts[0] + '.' + parts[1].substring(0, 3);
        } else {
          updatedValue = currentSet.tcpData[rowIndex][field];
        }
      } else if (field !== 'tcpId') {
        return prevSets;
      }

      newSets[activeTab].tcpData[rowIndex][field] = updatedValue;
      return newSets;
    });
  };

  const handleAddSet = () => {
    if (!isCurrentSetSaved) {
      showSnackbar(
        'Please save the current set before adding a new one.',
        'error',
      );
      return;
    }
    if (
      parseFloat(currentFormSet.endChainage) === parseFloat(chainageData?.end)
    ) {
      showSnackbar(
        'You have reached the end chainage. Cannot add more sets.',
        'info',
      );
      return;
    }
    setAllFormSets(prevSets => {
      const newSet = initialFormSet(prevSets);
      newSet.startChainageRFI = prevSets[activeTab].endChainage;
      return [...prevSets, newSet];
    });
    setActiveTab(allFormSets.length);
  };

  const handleAddTCPRow = () => {
    if (wasCurrentSetEverSaved) {
      showSnackbar(
        'Cannot add new TCP rows to a set that has been saved.',
        'error',
      );
      return;
    }
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].tcpData.push({
        ...initialTCPRow(),
        tcpId: getNextTcpId(newSets),
      });
      return newSets;
    });
  };

  const handleRemoveTCPRow = (rowIndexToRemove: number) => {
    if (wasCurrentSetEverSaved) {
      showSnackbar(
        'Cannot remove TCP rows from a set that has been saved.',
        'error',
      );
      return;
    }
    if (currentFormSet.tcpData.length <= 1) {
      showSnackbar('At least one TCP row is required.', 'info');
      return;
    }

    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].tcpData.splice(rowIndexToRemove, 1);
      return newSets;
    });
  };

  /**
   * Validates and saves the current active set.
   */
  const handleSaveSet = () => {
    const currentSet = allFormSets[activeTab];
    let validationError: string | null = null;

    if (!date) {
      validationError = 'Please select a date for the inspection.';
    } else if (!currentSet.endChainage.trim()) {
      validationError = 'End Chainage cannot be empty.';
    } else if (
      !currentSet.startingPoint1.chainage ||
      !currentSet.startingPoint2.chainage ||
      !currentSet.endPoint1.chainage ||
      !currentSet.endPoint2.chainage
    ) {
      validationError = 'All four Control Points must be selected.';
    }

    if (!validationError) {
      for (let i = 0; i < currentSet.tcpData.length; i++) {
        const tcp = currentSet.tcpData[i];
        if (
          !tcp.chainage.trim() ||
          !tcp.easting.trim() ||
          !tcp.northing.trim() ||
          !tcp.description.trim()
        ) {
          validationError = `All fields in TCP row #${i + 1} must be filled.`;
          break;
        }
      }
    }

    if (validationError) {
      showSnackbar(validationError, 'error');
      return;
    }

    const startValue = parseFloat(currentSet.startChainageRFI);
    const endValue = parseFloat(chainageData?.end);
    const enteredEndChainage = parseFloat(currentSet.endChainage);

    if (
      isNaN(enteredEndChainage) ||
      enteredEndChainage <= startValue ||
      enteredEndChainage > endValue
    ) {
      showSnackbar(
        `End Chainage must be between ${startValue} and ${endValue}.`,
        'error',
      );
      return;
    }

    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].isSaved = true;
      newSets[activeTab].wasEverSaved = true;
      return newSets;
    });
    showSnackbar(`Set ${activeTab + 1} has been saved.`, 'success');
  };

  /**
   * Toggles the current set into edit mode.
   */
  const handleEditSet = () => {
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].isSaved = false;
      return newSets;
    });
  };

  /**
   * Validates all sets, formats the data, and navigates back on success.
   */
  const handleSubmitAllData = () => {
    if (!date) {
      showSnackbar('Please select a date for the inspection.', 'error');
      return;
    }
    if (allFormSets.some(set => !set.isSaved)) {
      showSnackbar('Please save all sets before submitting.', 'error');
      return;
    }
    const lastSet = allFormSets[allFormSets.length - 1];
    if (parseFloat(lastSet.endChainage) !== parseFloat(chainageData?.end)) {
      showSnackbar(
        "The last set's End Chainage must match the project's total end chainage.",
        'error',
      );
      return;
    }
    const formattedData = {
      date: date,
      rfiChainage: {
        start: parseFloat(chainageData?.start) || 0,
        end: parseFloat(chainageData?.end) || 0,
      },
      sets: {},
    };
    allFormSets.forEach((set, index) => {
      const setName = `set${index + 1}`;
      (formattedData.sets as any)[setName] = {
        details: {
          chainage: {
            start: parseFloat(set.startChainageRFI) || 0,
            end: parseFloat(set.endChainage) || 0,
          },
          start: {
            point1: set.startingPoint1.chainage || '',
            point2: set.startingPoint2.chainage || '',
          },
          end: {
            point1: set.endPoint1.chainage || '',
            point2: set.endPoint2.chainage || '',
          },
        },
        tcp: set.tcpData.map(tcp => ({
          'TCP ID': tcp.tcpId,
          'Chainage (3 Decimal point)': tcp.chainage,
          'Easting(6 digit +3 Decimal point)': tcp.easting,
          'Northing 7 digit +3 Decimal point))': tcp.northing,
          'Physical Description of CP( Max 50 Char)': tcp.description,
        })),
      };
    });

    console.log(
      'Submitting Formatted Data:',
      JSON.stringify(formattedData, null, 2),
    );
    showSnackbar('All data has been submitted successfully.', 'success');
    setTimeout(() => navigation.goBack(), 1000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A2AAF" />
        <Text style={styles.loadingText}>Loading Control Points...</Text>
      </View>
    );
  }

  const renderControlPointRow = (
    label: string,
    cpData: ControlPointSelection,
    setterFn: string,
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
              {cpData?.chainage || 'N/A'}
            </Text>
          </View>
        ) : (
          <DropdownPicker
            items={[{label: 'Select', value: ''}, ...controlPointDropdownItems]}
            value={cpData?.chainage || ''}
            onChange={(value: string) => handleInputChange('', value, setterFn)}
          />
        )}
      </View>
      <View style={styles.tableCellValue}>
        <Text style={styles.tableCellValueText} numberOfLines={1}>
          {cpData?.easting || 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCellValue}>
        <Text style={styles.tableCellValueText} numberOfLines={1}>
          {cpData?.northing || 'N/A'}
        </Text>
      </View>
    </View>
  );

  const renderTCPRow = (
    tcpRow: TCPRow,
    index: number,
    isLast: boolean = false,
  ) => {
    const isChainageEditable = !wasCurrentSetEverSaved;
    const areOtherFieldsEditable = !isCurrentSetSaved;

    return (
      <View
        key={index}
        style={[styles.tableBodyRow, isLast && styles.tableBodyRowLast]}>
        <View style={styles.tableCellTCPId}>
          <Text style={styles.tableCellPointText}>{tcpRow.tcpId}</Text>
        </View>
        <View style={styles.tableCellTCPInput}>
          <TextInput
            style={[
              styles.tcpInput,
              !isChainageEditable && styles.readOnlyTcpInput,
            ]}
            keyboardType="numeric"
            value={tcpRow.chainage}
            onChangeText={value =>
              handleTCPInputChange(index, 'chainage', value)
            }
            placeholder="0.000"
            editable={isChainageEditable}
          />
        </View>
        <View style={styles.tableCellTCPInput}>
          <TextInput
            style={[
              styles.tcpInput,
              !areOtherFieldsEditable && styles.readOnlyTcpInput,
            ]}
            keyboardType="numeric"
            value={tcpRow.easting}
            onChangeText={value =>
              handleTCPInputChange(index, 'easting', value)
            }
            placeholder="0.000"
            editable={areOtherFieldsEditable}
          />
        </View>
        <View style={styles.tableCellTCPInput}>
          <TextInput
            style={[
              styles.tcpInput,
              !areOtherFieldsEditable && styles.readOnlyTcpInput,
            ]}
            keyboardType="numeric"
            value={tcpRow.northing}
            onChangeText={value =>
              handleTCPInputChange(index, 'northing', value)
            }
            placeholder="0.000"
            editable={areOtherFieldsEditable}
          />
        </View>
        <View style={styles.tableCellTCPDescription}>
          <TextInput
            style={[
              styles.tcpDescriptionInput,
              !areOtherFieldsEditable && styles.readOnlyTcpInput,
            ]}
            value={tcpRow.description}
            onChangeText={value =>
              handleTCPInputChange(index, 'description', value)
            }
            placeholder="Description"
            maxLength={50}
            editable={areOtherFieldsEditable}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.removeTCPRowButton,
            wasCurrentSetEverSaved && styles.disabledButton,
          ]}
          onPress={() => handleRemoveTCPRow(index)}
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
            <View key={index} style={styles.tabItemContainer}>
              <TouchableOpacity
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
            </View>
          ))}
          <TouchableOpacity
            style={[
              styles.addTabButton,
              !canAddNextSet && styles.disabledButton,
            ]}
            onPress={handleAddSet}
            disabled={!canAddNextSet}
            activeOpacity={0.8}>
            <Text style={styles.addTabButtonText}>+ Add Set</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chainage Information</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>Set {activeTab + 1}</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Start Chainage (from RFI)</Text>
                <View style={styles.readOnlyInput}>
                  <Text style={styles.readOnlyInputText}>
                    {currentFormSet.startChainageRFI || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>End Chainage *</Text>
                <TextInput
                  style={[
                    styles.input,
                    wasCurrentSetEverSaved && styles.readOnlyInput,
                  ]}
                  keyboardType="numeric"
                  value={currentFormSet.endChainage}
                  onChangeText={text => handleInputChange('endChainage', text)}
                  editable={!wasCurrentSetEverSaved}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Control Point Details</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.tableHeaderCellPoint}>
                  <Text style={styles.tableHeaderText}>Point</Text>
                </View>
                <View style={styles.tableHeaderCellDropdown}>
                  <Text style={styles.tableHeaderText}>Chainage</Text>
                </View>
                <View style={styles.tableHeaderCellValue}>
                  <Text style={styles.tableHeaderText}>Easting</Text>
                </View>
                <View style={styles.tableHeaderCellValue}>
                  <Text style={styles.tableHeaderText}>Northing</Text>
                </View>
              </View>
              {renderControlPointRow(
                'Starting Point 1',
                currentFormSet.startingPoint1,
                'startingPoint1',
              )}
              {renderControlPointRow(
                'Starting Point 2',
                currentFormSet.startingPoint2,
                'startingPoint2',
              )}
              {renderControlPointRow(
                'End Point 1',
                currentFormSet.endPoint1,
                'endPoint1',
              )}
              {renderControlPointRow(
                'End Point 2',
                currentFormSet.endPoint2,
                'endPoint2',
                true,
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TCP Details</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.tableHeaderCellTCPId}>
                  <Text style={styles.tableHeaderText}>TCP ID</Text>
                </View>
                <View style={styles.tableHeaderCellTCPInput}>
                  <Text style={styles.tableHeaderText}>
                    Chainage{'\n'}(3 Dec)
                  </Text>
                </View>
                <View style={styles.tableHeaderCellTCPInput}>
                  <Text style={styles.tableHeaderText}>
                    Easting{'\n'}(6+3 Dec)
                  </Text>
                </View>
                <View style={styles.tableHeaderCellTCPInput}>
                  <Text style={styles.tableHeaderText}>
                    Northing{'\n'}(7+3 Dec)
                  </Text>
                </View>
                <View style={styles.tableHeaderCellTCPDescription}>
                  <Text style={styles.tableHeaderText}>
                    Description{'\n'}(Max 50 Char)
                  </Text>
                </View>
                <View style={styles.tableHeaderCellRemove}>
                  <Text style={styles.tableHeaderText}>Action</Text>
                </View>
              </View>
              {currentFormSet.tcpData?.map((tcpRow, index) =>
                renderTCPRow(
                  tcpRow,
                  index,
                  index === currentFormSet.tcpData.length - 1,
                ),
              )}
            </View>
          </ScrollView>
          {!wasCurrentSetEverSaved && (
            <TouchableOpacity
              style={styles.addTCPRowButton}
              onPress={handleAddTCPRow}>
              <Text style={styles.addTCPRowButtonText}>+ Add TCP Row</Text>
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

const styles = StyleSheet.create({
  editSetButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 10,
    borderRadius: 6,
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
  tabContainer: {paddingVertical: 0},
  tabContentContainer: {paddingHorizontal: 10, alignItems: 'center'},
  tabItemContainer: {marginRight: 6, position: 'relative', marginTop: 5},
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    height: 36,
  },
  activeTab: {
    backgroundColor: '#F7F3FF',
    borderWidth: 1,
    borderColor: '#5A2AAF',
  },
  tabText: {color: '#4A5568', fontWeight: '600', fontSize: 13},
  activeTabText: {color: '#000'},
  addTabButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#5A2AAF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
  },
  addTabButtonText: {color: '#FFF', fontWeight: '700', fontSize: 13},
  disabledButton: {backgroundColor: '#A0A0A0'},
  formContent: {flex: 1, padding: 10, paddingTop: 0},
  sectionContainer: {marginBottom: 12},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {fontSize: 18, fontWeight: '700', color: '#2D3748'},
  sectionBadge: {
    backgroundColor: '#5A2AAF1A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sectionBadgeText: {fontSize: 11, fontWeight: '600', color: '#5A2AAF'},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputRow: {marginBottom: 12},
  inputContainer: {flex: 1},
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#2D3748',
    backgroundColor: '#FFFFFF',
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
    borderColor: '#E2E8F0',
    minWidth: width - 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderCellPoint: {
    width: 100,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  tableHeaderCellDropdown: {
    width: 130,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellValue: {
    width: 110,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellTCPId: {
    width: 80,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellTCPInput: {
    width: 110,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellTCPDescription: {
    width: 160,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableHeaderCellRemove: {
    width: 60,
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
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    alignItems: 'center',
  },
  tableBodyRowLast: {borderBottomWidth: 0},
  tableCellPoint: {width: 100, paddingHorizontal: 8, justifyContent: 'center'},
  tableCellPointText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2D3748',
    textAlign: 'left',
  },
  tableCellDropdown: {width: 130, paddingHorizontal: 5},
  tableCellValue: {width: 110, paddingHorizontal: 5, justifyContent: 'center'},
  tableCellValueText: {fontSize: 11, color: '#718096', textAlign: 'center'},
  tableCellTCPId: {width: 80, paddingHorizontal: 5, justifyContent: 'center'},
  tableCellTCPInput: {
    width: 110,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableCellTCPDescription: {
    width: 160,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tcpInput: {
    height: 36,
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#2D3748',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  readOnlyTcpInput: {backgroundColor: '#F8FAFC', color: '#718096'},
  tcpDescriptionInput: {
    height: 36,
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    color: '#2D3748',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  removeTCPRowButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
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
  addTCPRowButtonText: {color: '#5A2AAF', fontWeight: '600', fontSize: 13},
  saveSetContainer: {marginTop: 15, paddingHorizontal: 4},
  saveSetButton: {
    backgroundColor: '#FFF',
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#28A745',
    marginBottom: 5,
  },
  saveSetButtonText: {
    color: '#28A745',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  submitContainer: {marginTop: 20, marginBottom: 10, paddingHorizontal: 4},
  submitButton: {
    backgroundColor: '#5A2AAF',
    paddingVertical: 10,
    borderRadius: 6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomSpacing: {height: 30},
  disabledText: {color: '#A0A0A0'},
  disabledDropdownContainer: {backgroundColor: '#F8FAFC'},
});
