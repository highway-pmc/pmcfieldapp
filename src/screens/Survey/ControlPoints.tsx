import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
  Dimensions,
  NativeEventEmitter,
  BackHandler, // Import BackHandler
} from 'react-native';
import DropdownPicker from '../../components/UI/DropdownPicker';
import {useIsFocused, useRoute, useNavigation} from '@react-navigation/native'; // Import useNavigation
import {HeaderItems} from '../../constants/constants';

const {width} = Dimensions.get('window');

const initialTCPRow = () => ({
  tcpId: '',
  chainage: '',
  easting: '',
  northing: '',
  description: '',
});

// Helper function to generate the next TCP ID
const getNextTcpId = allSets => {
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

const initialFormSet = (allExistingSets = []) => {
  const nextTcpId = getNextTcpId(allExistingSets);
  return {
    startChainageRFI: '',
    endChainage: '',
    startingPoint1: {chainage: '', easting: '', northing: ''},
    startingPoint2: {chainage: '', easting: '', northing: ''},
    endPoint1: {chainage: '', easting: '', northing: ''},
    endPoint2: {chainage: '', easting: '', northing: ''},
    tcpData: [{...initialTCPRow(), tcpId: nextTcpId}],
    isSaved: false, // New state to track if a set is saved
  };
};

export default function ControlPoints() {
  const [activeTab, setActiveTab] = useState(0);
  const [allFormSets, setAllFormSets] = useState([initialFormSet()]);
  const [controlPoints, setControlPoints] = useState([]);
  const isFocused = useIsFocused();
  const route = useRoute();
  const navigation = useNavigation(); // Get navigation object
  const {chainageData} = route.params || {};

  // Track if the current active set is saved
  const isCurrentSetSaved = allFormSets[activeTab]?.isSaved;

  // Determine if adding a new set is allowed based on endChainage
  const canAddNextSet =
    allFormSets[activeTab]?.isSaved &&
    parseFloat(allFormSets[activeTab]?.endChainage) !==
      parseFloat(chainageData?.end);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.controlPoint);

      // Handle Android back button
      const onBackPress = () => {
        navigation.goBack();
        return true; // Prevent default back button behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }
  }, [isFocused, navigation]); // Add navigation to dependency array

  useEffect(() => {
    const fetchedControlPoints = [
      {
        'CP ID': 'CP001',
        'Chainage (3 Decimal point)': '1.500',
        'Easting(6 digit +3 Decimal point)': '123456.789',
        'Northing 7 digit +3 Decimal point))': '9876543.210',
        'Physical Description of CP( Max 50 Char)': 'Road side hanuman temple',
        Photograph: '225fae40-dace-4839-8d0c-23555574cdff-aaaaa.png',
      },
      {
        'CP ID': 'CP002',
        'Chainage (3 Decimal point)': '2.000',
        'Easting(6 digit +3 Decimal point)': '123500.123',
        'Northing 7 digit +3 Decimal point))': '9876600.456',
        'Physical Description of CP( Max 50 Char)': 'Near Banyan Tree',
        Photograph: 'some_image_cp002.png',
      },
      {
        'CP ID': 'CP003',
        'Chainage (3 Decimal point)': '2.500',
        'Easting(6 digit +3 Decimal point)': '123600.456',
        'Northing 7 digit +3 Decimal point))': '9876700.789',
        'Physical Description of CP( Max 50 Char)': 'Bridge Abutment',
        Photograph: 'some_image_cp003.png',
      },
    ];
    setControlPoints(fetchedControlPoints);

    setAllFormSets(prevSets => {
      const updatedSets = [...prevSets];
      if (chainageData?.start) {
        updatedSets[0].startChainageRFI = chainageData.start.toString();
      } else if (fetchedControlPoints.length > 0) {
        updatedSets[0].startChainageRFI =
          fetchedControlPoints[0]['Chainage (3 Decimal point)'];
      }
      return updatedSets;
    });
  }, [chainageData]);

  const controlPointDropdownItems = controlPoints.map(cp => ({
    label: cp['Chainage (3 Decimal point)'],
    value: cp['Chainage (3 Decimal point)'],
  }));

  const handleInputChange = (field, value, cpType = null) => {
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      if (!newSets[activeTab]) {
        return prevSets;
      }

      newSets[activeTab].isSaved = false;

      if (cpType) {
        const selectedCp = controlPoints.find(
          cp => cp['Chainage (3 Decimal point)'] === value,
        );
        if (selectedCp) {
          newSets[activeTab][cpType] = {
            chainage: value,
            easting: selectedCp['Easting(6 digit +3 Decimal point)'],
            northing: selectedCp['Northing 7 digit +3 Decimal point))'],
          };
        } else {
          newSets[activeTab][cpType] = {
            chainage: '',
            easting: '',
            northing: '',
          };
        }
      } else {
        newSets[activeTab][field] = value;
      }
      return newSets;
    });
  };

  const handleTCPInputChange = (rowIndex, field, value) => {
    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      if (!newSets[activeTab] || !newSets[activeTab].tcpData) {
        return prevSets;
      }

      newSets[activeTab].isSaved = false;

      const updatedTcpData = [...newSets[activeTab].tcpData];
      if (!updatedTcpData[rowIndex]) {
        return prevSets;
      }

      let updatedValue = value;
      if (
        (field === 'chainage' && !isCurrentSetSaved) ||
        field === 'easting' ||
        field === 'northing'
      ) {
        const numericValue = parseFloat(value);
        if (
          value === '' ||
          (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 1000000)
        ) {
          const parts = value.split('.');
          if (parts.length > 1 && parts[1].length > 3) {
            updatedValue = parts[0] + '.' + parts[1].substring(0, 3);
          }
          if (field === 'easting' && parts[0].length > 6 && value !== '') {
            updatedValue = updatedTcpData[rowIndex][field];
          }
          if (field === 'northing' && parts[0].length > 7 && value !== '') {
            updatedValue = updatedTcpData[rowIndex][field];
          }
        } else {
          updatedValue = updatedTcpData[rowIndex][field];
        }
      } else if (field === 'description') {
        if (value.length > 50) {
          updatedValue = updatedTcpData[rowIndex][field];
        }
      }

      updatedTcpData[rowIndex][field] = updatedValue;
      newSets[activeTab].tcpData = updatedTcpData;
      return newSets;
    });
  };

  const handleAddSet = () => {
    if (!isCurrentSetSaved) {
      Alert.alert(
        'Cannot Add Set',
        'Please save the current set before adding a new one.',
      );
      return;
    }

    if (
      parseFloat(allFormSets[activeTab]?.endChainage) ===
      parseFloat(chainageData?.end)
    ) {
      Alert.alert(
        'Cannot Add Set',
        'You have reached the end chainage. Cannot add more sets.',
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
    if (isCurrentSetSaved) {
      Alert.alert(
        'Cannot Add TCP Row',
        'Cannot add new TCP rows to a saved set. Unsave the set to make changes.',
      );
      return;
    }

    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      const currentTcpData = newSets[activeTab].tcpData;
      const newTcpId = getNextTcpId(newSets);
      const newRow = {
        ...initialTCPRow(),
        tcpId: newTcpId,
      };
      newSets[activeTab].tcpData = [...currentTcpData, newRow];
      newSets[activeTab].isSaved = false;
      return newSets;
    });
  };

  const handleRemoveTCPRow = rowIndexToRemove => {
    if (isCurrentSetSaved) {
      Alert.alert(
        'Cannot Remove TCP Row',
        'Cannot remove TCP rows from a saved set. Unsave the set to make changes.',
      );
      return;
    }

    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      const currentTcpData = newSets[activeTab].tcpData;
      const tcpIdToRemove = currentTcpData[rowIndexToRemove].tcpId;

      if (currentTcpData.length <= 1) {
        Alert.alert('Cannot Remove', 'At least one TCP row is required.');
        return prevSets;
      }

      Alert.alert(
        'Remove TCP Row',
        `Are you sure you want to remove TCP row ${tcpIdToRemove}?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              const updatedTcpData = currentTcpData.filter(
                (_, index) => index !== rowIndexToRemove,
              );
              const reindexedTcpData = updatedTcpData.map((row, index) => ({
                ...row,
                tcpId: `TCP${String(index + 1).padStart(3, '0')}`,
              }));
              newSets[activeTab].tcpData = reindexedTcpData;
              newSets[activeTab].isSaved = false;
              setAllFormSets(newSets);
            },
          },
        ],
      );
      return prevSets;
    });
  };

  const handleSaveSet = () => {
    const startValue = parseFloat(currentFormSet.startChainageRFI);
    const endValue = parseFloat(chainageData?.end);
    const enteredEndChainage = parseFloat(currentFormSet.endChainage);

    if (!currentFormSet.endChainage) {
      Alert.alert('Validation Error', 'End Chainage cannot be empty.');
      return;
    }

    if (isNaN(enteredEndChainage)) {
      Alert.alert('Validation Error', 'End Chainage must be a valid number.');
      return;
    }

    if (enteredEndChainage <= startValue || enteredEndChainage > endValue) {
      Alert.alert(
        'Validation Error',
        `End Chainage must be greater than ${startValue} and less than or equal to ${endValue}.`,
      );
      return;
    }

    setAllFormSets(prevSets => {
      const newSets = [...prevSets];
      newSets[activeTab].isSaved = true;
      return newSets;
    });
    Alert.alert('Set Saved', `Set ${activeTab + 1} has been saved.`);
    console.log(
      `Set ${activeTab + 1} data saved:`,
      JSON.stringify(allFormSets[activeTab], null, 2),
    );
  };

  const handleSubmitAllData = () => {
    const allSetsSaved = allFormSets.every(set => set.isSaved);

    if (!allSetsSaved) {
      Alert.alert(
        'Submission Error',
        'Please save all sets before submitting all data.',
      );
      return;
    }

    const lastSet = allFormSets[allFormSets.length - 1];
    if (parseFloat(lastSet.endChainage) !== parseFloat(chainageData?.end)) {
      Alert.alert(
        'Submission Error',
        `The last set's End Chainage (${lastSet.endChainage}) must match the project's total end chainage (${chainageData.end}) to submit.`,
      );
      return;
    }

    console.log(
      'Submitting all form data:',
      JSON.stringify(allFormSets, null, 2),
    );
    Alert.alert(
      'Form Submitted',
      'All saved data has been submitted. In a real app, this would go to your API.',
    );
  };

  const currentFormSet = allFormSets[activeTab] || initialFormSet();

  const renderControlPointRow = (
    label,
    cpData = {chainage: '', easting: '', northing: ''},
    setterFn,
    isLast = false,
  ) => (
    <View
      key={label}
      style={[styles.tableBodyRow, isLast && styles.tableBodyRowLast]}>
      <View style={styles.tableCellPoint}>
        <Text style={styles.tableCellPointText}>{label}</Text>
      </View>
      <View style={styles.tableCellDropdown}>
        <DropdownPicker
          label="Select Chainage"
          items={[{label: 'Select', value: ''}, ...controlPointDropdownItems]}
          value={cpData?.chainage || ''}
          onChange={value => handleInputChange('chainage', value, setterFn)}
          disabled={isCurrentSetSaved} // Disable CP dropdown if set is saved
          textStyle={isCurrentSetSaved && styles.disabledText}
          containerStyle={isCurrentSetSaved && styles.disabledDropdownContainer}
        />
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

  const renderTCPRow = (tcpRow, index, isLast = false) => {
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
              isCurrentSetSaved && styles.readOnlyTcpInput,
            ]}
            keyboardType="numeric"
            value={tcpRow.chainage}
            onChangeText={value =>
              handleTCPInputChange(index, 'chainage', value)
            }
            placeholder="0.000"
            placeholderTextColor="#A0A0A0"
            editable={!isCurrentSetSaved}
          />
        </View>
        <View style={styles.tableCellTCPInput}>
          <TextInput
            style={styles.tcpInput}
            keyboardType="numeric"
            value={tcpRow.easting}
            onChangeText={value =>
              handleTCPInputChange(index, 'easting', value)
            }
            placeholder="0.000"
            placeholderTextColor="#A0A0A0"
            editable={true}
          />
        </View>
        <View style={styles.tableCellTCPInput}>
          <TextInput
            style={styles.tcpInput}
            keyboardType="numeric"
            value={tcpRow.northing}
            onChangeText={value =>
              handleTCPInputChange(index, 'northing', value)
            }
            placeholder="0.000"
            placeholderTextColor="#A0A0A0"
            editable={true}
          />
        </View>
        <View style={styles.tableCellTCPDescription}>
          <TextInput
            style={styles.tcpDescriptionInput}
            value={tcpRow.description}
            onChangeText={value =>
              handleTCPInputChange(index, 'description', value)
            }
            placeholder="Description (Max 50 Char)"
            placeholderTextColor="#A0A0A0"
            maxLength={50}
            editable={true}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.removeTCPRowButton,
            isCurrentSetSaved && styles.disabledButton,
          ]}
          onPress={() => handleRemoveTCPRow(index)}
          disabled={isCurrentSetSaved}>
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
                  Set {index + 1}
                  {set.isSaved ? ' (Saved)' : ' *'}
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
                    isCurrentSetSaved && styles.readOnlyInput,
                    isCurrentSetSaved && {color: '#718096'},
                  ]}
                  keyboardType="numeric"
                  value={currentFormSet.endChainage}
                  onChangeText={text => {
                    const numericValue = parseFloat(text);
                    if (text === '') {
                      handleInputChange('endChainage', '');
                    } else if (
                      !isNaN(numericValue) &&
                      numericValue >= 0 &&
                      numericValue <= 1000000
                    ) {
                      const parts = text.split('.');
                      if (parts.length > 1 && parts[1].length > 3) {
                        handleInputChange(
                          'endChainage',
                          parts[0] + '.' + parts[1].substring(0, 3),
                        );
                      } else {
                        handleInputChange('endChainage', text);
                      }
                    }
                  }}
                  placeholder="Enter End Chainage (e.g., 123.456)"
                  placeholderTextColor="#A0A0A0"
                  editable={!isCurrentSetSaved}
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

              {currentFormSet.tcpData.map((tcpRow, index) =>
                renderTCPRow(
                  tcpRow,
                  index,
                  index === currentFormSet.tcpData.length - 1,
                ),
              )}
            </View>
          </ScrollView>
          {
            // --- CONDITIONALLY RENDER "ADD TCP ROW" BUTTON ---
            !isCurrentSetSaved && (
              <TouchableOpacity
                style={styles.addTCPRowButton}
                onPress={handleAddTCPRow}>
                <Text style={styles.addTCPRowButtonText}>+ Add TCP Row</Text>
              </TouchableOpacity>
            )
            // --- END CONDITIONALLY RENDER ---
          }
        </View>

        <View style={styles.saveSetContainer}>
          <TouchableOpacity
            style={styles.saveSetButton}
            onPress={handleSaveSet}
            disabled={isCurrentSetSaved}>
            <Text style={styles.saveSetButtonText}>
              {isCurrentSetSaved ? 'Set Saved' : 'Save Current Set'}
            </Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    marginTop: 2,
  },
  tabWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  tabContainer: {
    paddingVertical: 0,
  },
  tabContentContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabItemContainer: {
    marginRight: 6,
    position: 'relative',
    marginTop: 5,
  },
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
  tabText: {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: '#000',
  },
  activeTabIndicator: {
    display: 'none',
  },
  removeTabButton: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#5A2AAF',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeTabButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  addTabButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#5A2AAF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
  },
  addTabButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0', // Grey out when disabled
  },
  formContent: {
    flex: 1,
    padding: 10,
  },
  sectionContainer: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  sectionBadge: {
    backgroundColor: '#5A2AAF1A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A2AAF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputRow: {
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
  },
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
  readOnlyInputText: {
    fontSize: 15,
    color: '#718096',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: width - 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  tableBodyRowLast: {
    borderBottomWidth: 0,
  },
  tableCellPoint: {
    width: 100,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  tableCellPointText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2D3748',
    textAlign: 'left',
  },
  tableCellDropdown: {
    width: 130,
    paddingHorizontal: 5,
  },
  tableCellValue: {
    width: 110,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  tableCellValueText: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
  },
  tableCellTCPId: {
    width: 80,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
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
  readOnlyTcpInput: {
    backgroundColor: '#F8FAFC',
    color: '#718096',
  },
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
    backgroundColor: '#5A2AAF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 4,
  },
  addTCPRowButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  saveSetContainer: {
    marginTop: 15,
    paddingHorizontal: 4,
  },
  saveSetButton: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    borderRadius: 6,
  },
  saveSetButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  submitContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
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
  bottomSpacing: {
    height: 30,
  },
  disabledText: {
    color: '#A0A0A0',
  },
  disabledDropdownContainer: {
    backgroundColor: '#F8FAFC',
  },
});
