import React, {useEffect, useMemo, useState} from 'react';
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
import DropdownPicker from '../../../../components/UI/DropdownPicker';
import {HeaderItems} from '../../../../constants/constants';
import {getSourceApprovals, getVendorForm} from '../../actions';
import {useDispatch, useSelector} from 'react-redux';

// Static options for the 'Source Proposed For' dropdown
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

export default function SourceApprovalForm({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const testWorkCategoriesData = route.params.workCategories || [];
  const isFocused = useIsFocused();
  const {getVendorFormData} = useSelector((state: any) => state.VendorForm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.sourceApprovalForm);
      // Fetch initial data needed for the form
      dispatch(getVendorForm());
      dispatch(getSourceApprovals());
    }
  }, [isFocused, dispatch]);

  // 2. PROCESS DYNAMIC DATA FOR DROPDOWNS
  // `useMemo` is used to transform the API data into a format that's easy for the dropdowns to use.
  // This calculation only re-runs if the `testWorkCategoriesData` prop changes.
  const processedData = useMemo(() => {
    if (!testWorkCategoriesData || testWorkCategoriesData.length === 0) {
      return {};
    }
    const formattedData = {};
    testWorkCategoriesData.forEach((workCat: any) => {
      const materials = {};
      workCat.materialsData.forEach(mat => {
        // Store the sub-categories for each material
        materials[mat.name] = {
          categories: mat.category || [],
        };
      });
      formattedData[workCat.name] = {
        // A flag to conditionally show the "Source Proposed For" dropdown
        isAggregate: workCat.type === 'aggregates',
        materials,
      };
    });
    return formattedData;
  }, [testWorkCategoriesData]);

  // Form state management
  const [workCategory, setWorkCategory] = useState<string>('');
  const [materialName, setMaterialName] = useState<string>('');
  const [materialCategory, setMaterialCategory] = useState<string>('');
  const [sourceName, setSourceName] = useState<string>('');
  const [sourceProposedFor, setSourceProposedFor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [unitRate, setUnitRate] = useState<string>('');
  const [approxQty, setApproxQty] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // State for dynamic dropdown options
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<
    string[]
  >([]);
  const [showSourceProposedFor, setShowSourceProposedFor] = useState(false);

  // 3. UPDATE MATERIAL DROPDOWN WHEN WORK CATEGORY CHANGES
  useEffect(() => {
    if (workCategory && processedData[workCategory]) {
      const categoryData = processedData[workCategory];
      setShowSourceProposedFor(categoryData.isAggregate || false);
      setMaterialOptions(Object.keys(categoryData.materials || {}));
    } else {
      setShowSourceProposedFor(false);
      setMaterialOptions([]);
    }
    // Reset dependent fields when the parent dropdown changes
    setMaterialName('');
    setMaterialCategory('');
    setUnit('');
  }, [workCategory, processedData]);

  // 4. UPDATE CATEGORY DROPDOWN AND UNIT WHEN MATERIAL CHANGES
  useEffect(() => {
    let options: string[] = [];
    let unitValue = '';

    if (materialName && workCategory && processedData[workCategory]) {
      // Get the sub-category options for the selected material
      options =
        processedData[workCategory].materials[materialName]?.categories || [];

      // Find the selected material in the original data to get its unit
      const materialData = testWorkCategoriesData
        .find(wc => wc.name === workCategory)
        ?.materialsData.find(m => m.name === materialName);

      unitValue = materialData?.materialUnit || '';
    }

    setMaterialCategoryOptions(options);
    setUnit(unitValue);
    setMaterialCategory(''); // Reset sub-category selection
  }, [materialName, workCategory, processedData, testWorkCategoriesData]);

  const handleUpload = (fileName: string) =>
    Alert.alert('Upload', `Simulating upload for: ${fileName}`);

  const handleSubmit = () => {
    // Enhanced validation
    if (
      !workCategory ||
      !materialName ||
      (materialCategoryOptions.length > 0 && !materialCategory) || // Category is required only if options exist
      !sourceName ||
      !location ||
      !selectedVendor ||
      !unitRate ||
      !approxQty
    ) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields marked with *.',
      );
      return;
    }

    const formData = {
      workCategory,
      materialName,
      materialCategory: materialCategory || 'N/A', // Send 'N/A' if not applicable
      sourceName,
      sourceProposedFor: showSourceProposedFor ? sourceProposedFor : 'N/A',
      location,
      vendor: selectedVendor,
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
        {/* 5. RENDER DYNAMIC DROPDOWNS */}
        <DropdownPicker
          label="Work Category*"
          items={[
            {label: 'Select Work Category', value: ''},
            ...Object.keys(processedData).map(cat => ({
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

        {/* Conditionally render the Material Category dropdown */}
        {materialCategoryOptions.length > 0 && (
          <DropdownPicker
            label="Material Category*"
            items={[
              {label: 'Select Material Category', value: ''},
              ...materialCategoryOptions.map(cat => ({label: cat, value: cat})),
            ]}
            value={materialCategory}
            onChange={setMaterialCategory}
          />
        )}

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

        {Array.isArray(getVendorFormData) && getVendorFormData.length > 0 ? (
          <DropdownPicker
            label="Select an existing vendor*"
            items={[
              {label: 'Select an existing vendor', value: ''},
              ...getVendorFormData.map((v: any) => ({
                label: v.name,
                value: v.name,
              })),
            ]}
            value={selectedVendor}
            onChange={setSelectedVendor}
          />
        ) : null}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit</Text>
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

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9f9'},
  formContainer: {padding: 16},
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
