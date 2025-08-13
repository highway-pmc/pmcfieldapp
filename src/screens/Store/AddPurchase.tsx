import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {HeaderItems} from '../../constants/constants'; // Assuming this path is correct
import {useIsFocused} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- MOCK DATA FOR CASCADING DROPDOWNS ---
// In a real app, this data would come from an API.
const procurementDataSource = {
  'Structural Steel': {
    materials: {
      'TMT Bars': {
        categories: {
          'Fe-500D': {
            sources: {
              'Jindal Steel': {
                vendors: ['Local Steel Corp', 'National Builders'],
              },
              'Tata Steel': {vendors: ['Reliable Metals Ltd.']},
            },
            unit: 'Tonne',
          },
          'Fe-550': {
            sources: {
              'JSW Steel': {vendors: ['City Hardware', 'Infra Suppliers']},
            },
            unit: 'Tonne',
          },
        },
      },
      'MS Plates': {
        categories: {
          'IS 2062 E250': {
            sources: {SAIL: {vendors: ['Infra Suppliers']}},
            unit: 'Kg',
          },
        },
      },
    },
  },
  Cement: {
    materials: {
      'OPC Cement': {
        categories: {
          'Grade 53': {
            sources: {'UltraTech Cement': {vendors: ['City Hardware']}},
            unit: 'Bag',
          },
        },
      },
    },
  },
  'Structural Steel': {
    materials: {
      'TMT Bars': {
        categories: {
          'Fe-500D': {
            sources: {
              'Jindal Steel': {
                vendors: ['Local Steel Corp', 'National Builders'],
              },
              'Tata Steel': {vendors: ['Reliable Metals Ltd.']},
            },
            unit: 'Tonne',
          },
          'Fe-550': {
            sources: {
              'JSW Steel': {vendors: ['City Hardware', 'Infra Suppliers']},
            },
            unit: 'Tonne',
          },
        },
      },
      'MS Plates': {
        categories: {
          'IS 2062 E250': {
            sources: {SAIL: {vendors: ['Infra Suppliers']}},
            unit: 'Kg',
          },
        },
      },
    },
  },
  Cement: {
    materials: {
      'OPC Cement': {
        categories: {
          'Grade 53': {
            sources: {'UltraTech Cement': {vendors: ['City Hardware']}},
            unit: 'Bag',
          },
        },
      },
    },
  },
};

export default function AddPurchase({navigation}) {
  const isFocused = useIsFocused();

  // --- FORM STATE ---
  const [workCategory, setWorkCategory] = useState<string>('');
  const [materialName, setMaterialName] = useState<string>('');
  const [materialCategory, setMaterialCategory] = useState<string>('');
  const [sourceName, setSourceName] = useState<string>('');
  const [vendorName, setVendorName] = useState<string>('');
  const [vehicleNumbers, setVehicleNumbers] = useState<string[]>(['']);
  const [unit, setUnit] = useState<string>('');
  const [unitRate, setUnitRate] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [lotNumber, setLotNumber] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // State for dropdown options
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<
    string[]
  >([]);
  const [sourceOptions, setSourceOptions] = useState<string[]>([]);
  const [vendorOptions, setVendorOptions] = useState<string[]>([]);

  // UI state
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.addPurchase); // Update header
    }
  }, [isFocused]);

  // --- CASCADING DROPDOWN LOGIC ---
  useEffect(() => {
    if (workCategory) {
      const materials = procurementDataSource[workCategory]?.materials || {};
      setMaterialOptions(Object.keys(materials));
    } else {
      setMaterialOptions([]);
    }
    setMaterialName('');
  }, [workCategory]);

  useEffect(() => {
    if (materialName) {
      const categories =
        procurementDataSource[workCategory]?.materials[materialName]
          ?.categories || {};
      setMaterialCategoryOptions(Object.keys(categories));
    } else {
      setMaterialCategoryOptions([]);
    }
    setMaterialCategory('');
  }, [materialName]);

  useEffect(() => {
    if (materialCategory) {
      const categoryData =
        procurementDataSource[workCategory]?.materials[materialName]
          ?.categories[materialCategory];
      const sources = categoryData?.sources || {};
      setSourceOptions(Object.keys(sources));
      setUnit(categoryData?.unit || '');
    } else {
      setSourceOptions([]);
      setUnit('');
    }
    setSourceName('');
  }, [materialCategory]);

  useEffect(() => {
    if (sourceName) {
      const vendors =
        procurementDataSource[workCategory]?.materials[materialName]
          ?.categories[materialCategory]?.sources[sourceName]?.vendors || [];
      setVendorOptions(vendors);
    } else {
      setVendorOptions([]);
    }
    setVendorName('');
  }, [sourceName]);

  // --- HANDLER FUNCTIONS ---
  const handleVehicleChange = (text: string, index: number) => {
    const newVehicles = [...vehicleNumbers];
    newVehicles[index] = text;
    setVehicleNumbers(newVehicles);
  };

  const addVehicle = () => setVehicleNumbers([...vehicleNumbers, '']);
  const removeVehicle = (index: number) => {
    if (vehicleNumbers.length > 1) {
      setVehicleNumbers(vehicleNumbers.filter((_, i) => i !== index));
    }
  };

  const onDateChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || purchaseDate;
    setShowDatePicker(Platform.OS === 'ios');
    setPurchaseDate(currentDate);
  };

  const handleUpload = (fileName: string) => {
    Alert.alert('Upload', `Simulating upload for: ${fileName}`);
  };

  const handleSubmit = () => {
    // Basic validation example
    if (
      !workCategory ||
      !materialName ||
      !unitRate ||
      !quantity ||
      !invoiceNumber
    ) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }
    const formData = {
      workCategory,
      materialName,
      materialCategory,
      sourceName,
      vendorName,
      vehicleNumbers,
      unit,
      unitRate,
      quantity,
      purchaseDate,
      invoiceNumber,
      lotNumber,
      remarks,
    };
    console.log('Form Submitted:', JSON.stringify(formData, null, 2));
    Alert.alert('Success', 'Procurement details submitted!');
    navigation.goBack();
  };

  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}/${date.getFullYear()}`;

  // Reusable Dropdown Component
  const renderDropdown = (
    items: string[],
    value: string,
    onChange,
    placeholder: string,
  ) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() =>
          setShowDropdown(showDropdown === placeholder ? null : placeholder)
        }>
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>
      {showDropdown === placeholder && (
        <View style={styles.dropdownMenu}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                onChange(item);
                setShowDropdown(null);
              }}>
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        {/* Field 1 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Work Category</Text>
          {renderDropdown(
            Object.keys(procurementDataSource),
            workCategory,
            setWorkCategory,
            'Select Work Category',
          )}
        </View>
        {/* Field 2 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Material Name</Text>
          {renderDropdown(
            materialOptions,
            materialName,
            setMaterialName,
            'Select Material',
          )}
        </View>
        {/* Field 3 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Material category</Text>
          {renderDropdown(
            materialCategoryOptions,
            materialCategory,
            setMaterialCategory,
            'Select Material Category',
          )}
        </View>
        {/* Field 4 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Source Name*</Text>
          {renderDropdown(
            sourceOptions,
            sourceName,
            setSourceName,
            'Select Source',
          )}
        </View>
        {/* Field 5 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vendor Name*</Text>
          {renderDropdown(
            vendorOptions,
            vendorName,
            setVendorName,
            'Select Vendor',
          )}
        </View>
        {/* Field 6 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vehicle No. (last 4 digit)*</Text>
          {vehicleNumbers.map((vehicle, index) => (
            <View key={index} style={styles.vehicleInputContainer}>
              <TextInput
                style={styles.input}
                value={vehicle}
                onChangeText={text => handleVehicleChange(text, index)}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="e.g., 1234"
              />
              {vehicleNumbers.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeVehicle(index)}
                  style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>-</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addVehicle} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Vehicle</Text>
          </TouchableOpacity>
        </View>
        {/* Field 7 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit*</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={unit}
            editable={false}
          />
        </View>
        {/* Field 8 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit rates (in INR without GST)</Text>
          <TextInput
            style={styles.input}
            value={unitRate}
            onChangeText={setUnitRate}
            keyboardType="decimal-pad"
            placeholder="Enter rate"
          />
        </View>
        {/* Field 9 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Qty purchased</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            placeholder="Enter quantity"
          />
        </View>
        {/* Field 10 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Purchase Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}>
            <Text>{formatDate(purchaseDate)}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={purchaseDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
        {/* Field 11 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Invoice No.*</Text>
          <TextInput
            style={styles.input}
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="Enter invoice number"
            maxLength={50}
          />
        </View>
        {/* Field 12 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload weight slip/Invoice*</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUpload('Invoice')}>
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>
        </View>
        {/* Field 13 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Lot No. (if applicable)*</Text>
          <TextInput
            style={styles.input}
            value={lotNumber}
            onChangeText={setLotNumber}
            keyboardType="number-pad"
            placeholder="Enter lot number"
          />
        </View>
        {/* Field 14 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload MTC (if applicable)*</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUpload('MTC')}>
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>
        </View>
        {/* Field 15 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks (if any)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks"
            multiline={true}
            maxLength={500}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9f9'},
  formContainer: {padding: 16},
  formGroup: {marginBottom: 16},
  label: {fontSize: 14, marginBottom: 8, color: '#555', fontWeight: '500'},
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readOnlyInput: {backgroundColor: '#f0f0f0'},
  textArea: {height: 100, textAlignVertical: 'top', paddingTop: 12},
  dropdownContainer: {position: 'relative'},
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  dropdownText: {color: '#000'},
  placeholderText: {color: '#999'},
  dropdownIcon: {fontSize: 16, color: '#555'},
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  calendarIcon: {fontSize: 20},
  uploadButton: {
    height: 48,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5A2AAF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf7ff',
  },
  uploadButtonText: {color: '#5A2AAF', fontWeight: '500'},
  submitButton: {
    height: 48,
    backgroundColor: '#5A2AAF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
  },
  submitButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  vehicleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {paddingVertical: 8, alignSelf: 'flex-start'},
  addButtonText: {color: '#5A2AAF', fontWeight: 'bold'},
  removeButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 20,
  },
  removeButtonText: {color: '#ef4444', fontWeight: 'bold', fontSize: 16},
});
