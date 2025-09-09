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

// --- REMOVED MOCK DATA ---
// const sourceApprovalDataSource = { ... }; // This has been removed

const sourceProposedForOptions = [
  'Concrete',
  'DBM',
  'BC',
  'CTSB',
  'WMM',
  'CTB',
  'DLC',
  'PQC',
  'SMA',
  'Micro Surfacing',
];

export default function SourceApprovalForm({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  // 1. Get the dynamic data from route params
  const {testWorkCategoriesData} = route.params.workCategories; // Use default empty array for safety
  const isFocused = useIsFocused();
  const {getVendorFormData, loading, error} = useSelector(
    (state: any) => state.VendorForm,
  );

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.sourceApprovalForm);
    }
  }, [isFocused]);

  // 2. Process the dynamic data into a usable format with useMemo
  const processedData = useMemo(() => {
    if (!testWorkCategoriesData || testWorkCategoriesData.length === 0) {
      return {};
    }
    const formattedData = {};
    testWorkCategoriesData.forEach(workCat => {
      const materials = {};
      workCat.materialsData.forEach(mat => {
        const categories = {};
        // Handle materials with defined categories
        if (mat.category && mat.category.length > 0) {
          mat.category.forEach(catName => {
            categories[catName] = {unit: mat.materialUnit || ''};
          });
        } else {
            // Handle materials with no categories (e.g., WMM)
            // Use a placeholder if needed, or allow it to be empty
            // For this example, we'll allow an empty category list.
        }
        materials[mat.name] = {categories};
      });

      formattedData[workCat.name] = {
        // Condition for the "Source Proposed For" dropdown
        isAggregate: workCat.type === 'aggregates',
        materials,
      };
    });
    return formattedData;
  }, [testWorkCategoriesData]);

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
  const dispatch = useDispatch();

  const [materialOptions, setMaterialOptions] = useState<string[]>([]);
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<string[]>([]);
  const [showSourceProposedFor, setShowSourceProposedFor] = useState(false);

  // 3. Update useEffect hooks to use the new `processedData`
  useEffect(() => {
    if (workCategory && processedData[workCategory]) {
      const categoryData = processedData[workCategory];
      setShowSourceProposedFor(categoryData.isAggregate || false);
      setMaterialOptions(Object.keys(categoryData.materials || {}));
    } else {
      setMaterialOptions([]);
    }
    setMaterialName(''); // Reset downstream fields
  }, [workCategory, processedData]);

  useEffect(() => {
    if (materialName && processedData[workCategory]) {
      const categories =
        processedData[workCategory].materials[materialName]?.categories || {};
      setMaterialCategoryOptions(Object.keys(categories));
    } else {
      setMaterialCategoryOptions([]);
    }
    setMaterialCategory(''); // Reset downstream fields
  }, [materialName, workCategory, processedData]);

  useEffect(() => {
    if (materialCategory && materialName && processedData[workCategory]) {
      const categoryData =
        processedData[workCategory].materials[materialName]?.categories[
          materialCategory
        ];
      setUnit(categoryData?.unit || '');
    } else {
        // If there's no specific category, check if the material itself has a unit.
        // This handles cases like WMM where `category` array is empty.
        const materialData = testWorkCategoriesData.find(wc => wc.name === workCategory)
          ?.materialsData.find(m => m.name === materialName);
        setUnit(materialData?.materialUnit || '');
    }
    // You might want to move these dispatches to a more suitable place,
    // e.g., when the component mounts or the form is submitted.
    dispatch(getVendorForm());
    dispatch(getSourceApprovals());
  }, [materialCategory, materialName, workCategory, processedData, testWorkCategoriesData]);

  // --- HANDLER FUNCTIONS (No changes needed here) ---
  const handleUpload = (fileName: string) =>
    Alert.alert('Upload', `Simulating upload for: ${fileName}`);

  const handleSubmit = () => {
    if (
      !workCategory ||
      !materialName ||
      // materialCategory is now optional for items with no sub-categories
      (materialCategoryOptions.length > 0 && !materialCategory) ||
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
      materialCategory: materialCategory || 'N/A', // Send N/A if not applicable
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
        {/* 4. Update Dropdowns to use the dynamic data */}
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
        {/* Only show material category dropdown if there are options */}
        {materialCategoryOptions.length > 0 && (
          <DropdownPicker
            label="Material category*"
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

// Styles (No changes needed here)
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