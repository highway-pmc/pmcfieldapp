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
import DropdownPicker from '../../components/UI/DropdownPicker';

// --- MOCK DATA FOR CASCADING DROPDOWNS ---
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
};

export default function AddPurchase({navigation}) {
  const isFocused = useIsFocused();

  // --- FORM STATE ---
  const [workCategory, setWorkCategory] = useState<string>('');
  const [materialName, setMaterialName] = useState<string>('');
  const [materialCategory, setMaterialCategory] = useState<string>('');
  const [sourceName, setSourceName] = useState<string>('');
  const [vendorName, setVendorName] = useState<string>('');
  const [vehicleNumbers, setVehicleNumbers] = useState<string[]>([]);
  const [currentVehicleInput, setCurrentVehicleInput] = useState<string>('');
  const [lotNumbers, setLotNumbers] = useState<string[]>([]);
  const [currentLotInput, setCurrentLotInput] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [unitRate, setUnitRate] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // State for dropdown options
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<
    string[]
  >([]);
  const [sourceOptions, setSourceOptions] = useState<string[]>([]);
  const [vendorOptions, setVendorOptions] = useState<string[]>([]);

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.addPurchase); // Update header
    }
  }, [isFocused]);

  // --- CASCADING DROPDOWN LOGIC ---
  useEffect(() => {
    const materials = procurementDataSource[workCategory]?.materials || {};
    setMaterialOptions(Object.keys(materials));
    setMaterialName('');
  }, [workCategory]);

  useEffect(() => {
    const categories =
      procurementDataSource[workCategory]?.materials[materialName]
        ?.categories || {};
    setMaterialCategoryOptions(Object.keys(categories));
    setMaterialCategory('');
  }, [materialName, workCategory]);

  useEffect(() => {
    const categoryData =
      procurementDataSource[workCategory]?.materials[materialName]?.categories[
        materialCategory
      ];
    const sources = categoryData?.sources || {};
    setSourceOptions(Object.keys(sources));
    setUnit(categoryData?.unit || '');
    setSourceName('');
  }, [materialCategory, materialName, workCategory]);

  useEffect(() => {
    const vendors =
      procurementDataSource[workCategory]?.materials[materialName]?.categories[
        materialCategory
      ]?.sources[sourceName]?.vendors || [];
    setVendorOptions(vendors);
    setVendorName('');
  }, [sourceName, materialCategory, materialName, workCategory]);

  // --- HANDLER FUNCTIONS ---
  const handleVehicleInputChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 4) {
      setCurrentVehicleInput(numericText);
    }
  };

  const addVehicle = () => {
    if (currentVehicleInput.length === 4) {
      if (!vehicleNumbers.includes(currentVehicleInput)) {
        setVehicleNumbers([...vehicleNumbers, currentVehicleInput]);
        setCurrentVehicleInput('');
      } else {
        Alert.alert(
          'Duplicate Entry',
          'This vehicle number has already been added.',
        );
      }
    } else {
      Alert.alert(
        'Invalid Input',
        'Please enter exactly 4 digits for the vehicle number.',
      );
    }
  };

  const removeVehicle = (index: number) => {
    setVehicleNumbers(vehicleNumbers.filter((_, i) => i !== index));
  };

  // --- LOT NUMBER HANDLERS ---
  const handleLotInputChange = (text: string) => {
    setCurrentLotInput(text);
  };

  const addLot = () => {
    if (currentLotInput.trim() !== '') {
      if (!lotNumbers.includes(currentLotInput.trim())) {
        setLotNumbers([...lotNumbers, currentLotInput.trim()]);
        setCurrentLotInput('');
      } else {
        Alert.alert(
          'Duplicate Entry',
          'This lot number has already been added.',
        );
      }
    } else {
      Alert.alert('Invalid Input', 'Please enter a lot number to add.');
    }
  };

  const removeLot = (index: number) => {
    setLotNumbers(lotNumbers.filter((_, i) => i !== index));
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || purchaseDate;
    setShowDatePicker(Platform.OS === 'ios');
    setPurchaseDate(currentDate);
  };

  const handleUpload = (fileName: string) =>
    Alert.alert('Upload', `Simulating upload for: ${fileName}`);

  const handleSubmit = () => {
    if (
      !workCategory ||
      !materialName ||
      !unitRate ||
      !quantity ||
      !invoiceNumber ||
      lotNumbers.length === 0
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
      lotNumbers,
      unit,
      unitRate,
      quantity,
      purchaseDate,
      invoiceNumber,
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

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <DropdownPicker
          label="Work Category"
          items={[
            {label: 'Select Work Category', value: ''},
            ...Object.keys(procurementDataSource).map(cat => ({
              label: cat,
              value: cat,
            })),
          ]}
          value={workCategory}
          onChange={setWorkCategory}
          inputStyle={styles.formInput}
        />
        <DropdownPicker
          label="Material Name"
          items={[
            {label: 'Select Material', value: ''},
            ...materialOptions.map(mat => ({label: mat, value: mat})),
          ]}
          value={materialName}
          onChange={setMaterialName}
          inputStyle={styles.formInput}
        />
        <DropdownPicker
          label="Material category"
          items={[
            {label: 'Select Material Category', value: ''},
            ...materialCategoryOptions.map(cat => ({label: cat, value: cat})),
          ]}
          value={materialCategory}
          onChange={setMaterialCategory}
          inputStyle={styles.formInput}
        />
        <DropdownPicker
          label="Source Name*"
          items={[
            {label: 'Select Source', value: ''},
            ...sourceOptions.map(src => ({label: src, value: src})),
          ]}
          value={sourceName}
          onChange={setSourceName}
          inputStyle={styles.formInput}
        />
        <DropdownPicker
          label="Vendor Name*"
          items={[
            {label: 'Select Vendor', value: ''},
            ...vendorOptions.map(v => ({label: v, value: v})),
          ]}
          value={vendorName}
          onChange={setVendorName}
          inputStyle={styles.formInput}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Vehicle No. (last 4 digit)*</Text>
          <View style={styles.vehicleInputContainer}>
            <View style={styles.vehicleInput}>
              <TextInput
                style={styles.formInput}
                value={currentVehicleInput}
                onChangeText={handleVehicleInputChange}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="Enter 4 digits (e.g., 1234)"
              />
            </View>
            <TouchableOpacity
              onPress={addVehicle}
              style={[styles.addButton]}
              disabled={currentVehicleInput.length !== 4}>
              <Text style={[styles.addButtonText]}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {vehicleNumbers.length > 0 && (
            <View style={styles.addedVehiclesContainer}>
              <Text style={styles.addedVehiclesTitle}>Added Vehicles:</Text>
              <View style={styles.vehicleTagsContainer}>
                {vehicleNumbers.map((vehicle, index) => (
                  <View key={index} style={styles.vehicleTag}>
                    <Text style={styles.vehicleTagText}>{vehicle}</Text>
                    <TouchableOpacity
                      onPress={() => removeVehicle(index)}
                      style={styles.removeTagButton}>
                      <Text style={styles.removeTagButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit*</Text>
          <TextInput
            style={[styles.formInput, styles.readOnlyInput]}
            value={unit}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit rates (in INR without GST)</Text>
          <TextInput
            style={styles.formInput}
            value={unitRate}
            onChangeText={setUnitRate}
            keyboardType="decimal-pad"
            placeholder="Enter rate"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Qty purchased</Text>
          <TextInput
            style={styles.formInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            placeholder="Enter quantity"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Purchase Date</Text>
          <TouchableOpacity
            style={[styles.formInput, styles.dateInput]}
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Invoice No.*</Text>
          <TextInput
            style={styles.formInput}
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="Enter invoice number"
            maxLength={50}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload weight slip/Invoice*</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUpload('Invoice')}>
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Lot No. (if applicable)*</Text>
          <View style={styles.vehicleInputContainer}>
            <View style={styles.vehicleInput}>
              <TextInput
                style={styles.formInput}
                value={currentLotInput}
                onChangeText={handleLotInputChange}
                placeholder="Enter lot number"
              />
            </View>
            <TouchableOpacity
              onPress={addLot}
              style={[styles.addButton]}
              disabled={currentLotInput.trim() === ''}>
              <Text style={[styles.addButtonText]}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {lotNumbers.length > 0 && (
            <View style={styles.addedVehiclesContainer}>
              <Text style={styles.addedVehiclesTitle}>Added Lot Numbers:</Text>
              <View style={styles.vehicleTagsContainer}>
                {lotNumbers.map((lot, index) => (
                  <View key={index} style={styles.vehicleTag}>
                    <Text style={styles.vehicleTagText}>{lot}</Text>
                    <TouchableOpacity
                      onPress={() => removeLot(index)}
                      style={styles.removeTagButton}>
                      <Text style={styles.removeTagButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload MTC (if applicable)*</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUpload('MTC')}>
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks (if any)</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
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

  // Consolidated and updated styling for all input boxes
  formInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 14, // A slightly smaller font size to fit the new height
    color: '#333',
  },

  readOnlyInput: {backgroundColor: '#f0f0f0'},
  textArea: {height: 100, textAlignVertical: 'top', paddingTop: 12},
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarIcon: {fontSize: 20},
  uploadButton: {
    height: 42,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5A2AAF',
    borderRadius: 4,
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
  addedVehiclesContainer: {
    marginTop: 8,
  },
  addedVehiclesTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  vehicleTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vehicleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#5A2AAF30',
  },
  vehicleTagText: {
    fontSize: 13.5,
    color: '#5A2AAF',
    fontWeight: '400',
    marginRight: 4,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#5A2AAF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTagButtonText: {
    color: '#5A2AAF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  submitButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  vehicleInputContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  vehicleInput: {flex: 5},
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#5A2AAF',
    alignSelf: 'flex-start',
    maxWidth: '35%',
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {color: '#FFF', fontWeight: 'bold', alignItems: 'center'},
  addedVehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  addedVehicleText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  removeButton: {
    width: 28,
    height: 28,
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {color: '#ef4444', fontWeight: 'bold', fontSize: 14},
});
