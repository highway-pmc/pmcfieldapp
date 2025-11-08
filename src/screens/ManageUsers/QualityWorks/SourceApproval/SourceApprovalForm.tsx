import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  NativeEventEmitter,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
// 1. Import your custom DropdownPicker component
import DropdownPicker from '../../../../components/UI/DropdownPicker';
import {HeaderItems} from '../../../../constants/constants';

// --- MOCK DATA FOR THE FORM ---
const sourceApprovalDataSource = {
  Aggregates: {
    isAggregate: true, // Flag to show the conditional dropdown
    materials: {
      'Crushed Stone': {
        categories: {'20mm': {unit: 'Cu.M.'}, '40mm': {unit: 'Cu.M.'}},
      },
      Sand: {
        categories: {'Zone II': {unit: 'Cu.M.'}},
      },
    },
  },
  'Structural Steel': {
    isAggregate: false,
    materials: {
      'TMT Bars': {
        categories: {'Fe-500D': {unit: 'Tonne'}, 'Fe-550': {unit: 'Tonne'}},
      },
    },
  },
};

const sourceProposedForOptions = [
  'CONCRETE',
  'DBM',
  'BC',
  'CTSB',
  'WMM',
  'CTB',
  'DLC',
  'PQC',
  'SMA',
  'MICRO-SURFACING',
];
const existingVendors = [
  'Reliable Builders Ltd.',
  'Infra Suppliers Co.',
  'National Materials Inc.',
];

export default function SourceApprovalForm({navigation}: any) {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.sourceApprovalForm);
    }
  }, [isFocused]);
  const [workCategory, setWorkCategory] = useState<string>('');
  const [materialName, setMaterialName] = useState<string>('');
  const [materialCategory, setMaterialCategory] = useState<string>('');
  const [sourceName, setSourceName] = useState<string>('');
  const [sourceProposedFor, setSourceProposedFor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [newVendor, setNewVendor] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [unitRate, setUnitRate] = useState<string>('');
  const [approxQty, setApproxQty] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // Dropdown options state
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<
    string[]
  >([]);

  // UI state for conditional rendering
  const [showSourceProposedFor, setShowSourceProposedFor] = useState(false);

  // --- CASCADING & CONDITIONAL LOGIC ---
  useEffect(() => {
    const categoryData = sourceApprovalDataSource[workCategory];
    setShowSourceProposedFor(categoryData?.isAggregate || false);
    setMaterialOptions(Object.keys(categoryData?.materials || {}));
    setMaterialName(''); // Reset downstream fields
  }, [workCategory]);

  useEffect(() => {
    const categories =
      sourceApprovalDataSource[workCategory]?.materials[materialName]
        ?.categories || {};
    setMaterialCategoryOptions(Object.keys(categories));
    setMaterialCategory(''); // Reset downstream fields
  }, [materialName, workCategory]);

  useEffect(() => {
    const categoryData =
      sourceApprovalDataSource[workCategory]?.materials[materialName]
        ?.categories[materialCategory];
    setUnit(categoryData?.unit || '');
  }, [materialCategory, materialName, workCategory]);

  // --- HANDLER FUNCTIONS ---
  const handleUpload = (fileName: string) =>
    Alert.alert('Upload', `Simulating upload for: ${fileName}`);

  const handleSubmit = () => {
    if (
      !workCategory ||
      !materialName ||
      !materialCategory ||
      !sourceName ||
      !location
    ) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields marked with *.',
      );
      return;
    }
    if (!selectedVendor && !newVendor) {
      Alert.alert(
        'Validation Error',
        'Please select an existing vendor or enter a new one.',
      );
      return;
    }

    const formData = {
      workCategory,
      materialName,
      materialCategory,
      sourceName,
      sourceProposedFor: showSourceProposedFor ? sourceProposedFor : 'N/A',
      location,
      vendor: selectedVendor || newVendor,
      unit,
      unitRate,
      approxQty,
      remarks,
    };
    console.log('Form Submitted:', JSON.stringify(formData, null, 2));
    Alert.alert('Success', 'Source Approval details submitted!');
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        {/* Using DropdownPicker for all dropdowns */}
        <DropdownPicker
          label="Work Category*"
          items={[
            {label: 'Select Work Category', value: ''},
            ...Object.keys(sourceApprovalDataSource).map(cat => ({
              label: cat,
              value: cat,
            })),
          ]}
          value={workCategory}
          onChange={setWorkCategory}
        />
        <DropdownPicker
          label="Material Name*"
          items={[
            {label: 'Select Material', value: ''},
            ...materialOptions.map(mat => ({label: mat, value: mat})),
          ]}
          value={materialName}
          onChange={setMaterialName}
        />
        <DropdownPicker
          label="Material category*"
          items={[
            {label: 'Select Material Category', value: ''},
            ...materialCategoryOptions.map(cat => ({label: cat, value: cat})),
          ]}
          value={materialCategory}
          onChange={setMaterialCategory}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Source Name*</Text>
          <TextInput
            style={styles.input}
            value={sourceName}
            onChangeText={setSourceName}
            placeholder="Enter source name"
            maxLength={50}
          />
        </View>

        {/* Conditional Dropdown */}
        {showSourceProposedFor && (
          <DropdownPicker
            label="Source Proposed for"
            items={[
              {label: 'Select Proposed Use', value: ''},
              ...sourceProposedForOptions.map(opt => ({
                label: opt,
                value: opt,
              })),
            ]}
            value={sourceProposedFor}
            onChange={setSourceProposedFor}
          />
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location*</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter State/District/Address"
            multiline
          />
        </View>

        {/* Vendor selection with your DropdownPicker */}
        <DropdownPicker
          label="Select an existing vendor*"
          items={[
            {label: 'Select an existing vendor', value: ''},
            ...existingVendors.map(v => ({label: v, value: v})),
          ]}
          value={selectedVendor}
          onChange={setSelectedVendor}
        />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Enter New Vendor Name</Text>
          <TextInput
            style={styles.input}
            value={newVendor}
            onChangeText={setNewVendor}
            placeholder="Enter if vendor is new"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit*</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={unit}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit rates (in INR without GST)*</Text>
          <TextInput
            style={styles.input}
            value={unitRate}
            onChangeText={setUnitRate}
            keyboardType="decimal-pad"
            placeholder="Enter rate"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Approx Qty*</Text>
          <TextInput
            style={styles.input}
            value={approxQty}
            onChangeText={setApproxQty}
            keyboardType="decimal-pad"
            placeholder="Enter quantity"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Upload Specifications (if applicable)
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUpload('Specifications')}>
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Upload Vendor Credentials (if applicable)
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUpload('Vendor Credentials')}>
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload Quotation (if applicable)</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUpload('Quotation')}>
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks (if any)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks"
            multiline
            maxLength={500}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit for Approval</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles adapted for use with an external DropdownPicker component
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9f9'},
  formContainer: {padding: 16},
  // FormGroup can be used for non-dropdown inputs
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 15,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#555',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
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
  uploadButtonText: {
    color: '#5A2AAF',
    fontWeight: '500',
  },
  submitButton: {
    height: 48,
    backgroundColor: '#5A2AAF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#777',
    fontWeight: 'bold',
  },
});
