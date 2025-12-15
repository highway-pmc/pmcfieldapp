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
import { useDispatch, useSelector } from 'react-redux';
import { putSourceApproval } from '../../actions';
import { useSnackbar } from '../../../../context/SnackbarContext';

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
      'Fine Aggregate': {
        categories: {
          'natural-sand-(uncrushed-sand)': {unit: 'Cu.M.'},
          'crushed-stone-sand': {unit: 'Cu.M.'},
          'mixed-sand': {unit: 'Cu.M.'},
          'manufactured-sand': {unit: 'Cu.M.'}
        },
      },
      // NEW CASE: Material with no categories
      'Special Aggregate': {
        categories: {}, // Empty categories object
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
  'CONCRETE_WORKS',
  'STRUCTURAL_STEEL',
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

const existingVendors = [
  'Reliable Builders Ltd.',
  'Infra Suppliers Co.',
  'National Materials Inc.',
];

export default function SourceApprovalEditForm({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const isFocused = useIsFocused();
  
  // Get the existing data and type from route params
  const existingData = route?.params?.sourceData || {};
  const eventType = route?.params?.type || 'edit'; // Default to 'edit' if not provided
  
  // Determine if component should be in view-only mode
  const isViewMode = eventType === 'view';
  const isEditMode = eventType === 'edit';
  const isCreateMode = eventType === null;

  const {showSnackbar} = useSnackbar();

  const {
      putSourceApprovalData,
      loading,
      error,
    } = useSelector((state: any) => state.SourceApprovals);

  
  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.sourceApprovalEditForm);
      console.log('Existing data:', existingData);
      console.log('Event type:', eventType);
    }
  }, [isFocused]);

  useEffect(() => {
      if (putSourceApprovalData) {
        showSnackbar('Source status updated successfully', 'success'); // Show success snackbar
      } else if (error) {
        showSnackbar(error, 'error');
      }
    }, [putSourceApprovalData, error]);

  // Initialize state with existing data - FIXED FIELD MAPPINGS
  const [workCategory, setWorkCategory] = useState<string>(
    existingData.testWorkCategoryName || existingData.testWorkCategoryId || ''
  );
  const [materialName, setMaterialName] = useState<string>(
    existingData.testMaterialName || existingData.testMaterialId || ''
  );
  const [materialCategory, setMaterialCategory] = useState<string>(existingData.materialCategory || '');
  const [sourceName, setSourceName] = useState<string>(existingData.name || '');
  const [sourceProposedFor, setSourceProposedFor] = useState<string>(
    Array.isArray(existingData.sourceProposedFor) 
      ? existingData.sourceProposedFor.join(', ') 
      : existingData.sourceProposedFor || ''
  );
  // FIXED LOCATION CONCATENATION
  const [location, setLocation] = useState<string>(() => {
    const locationParts = [
      existingData.address,
      existingData.district,
      existingData.state,
      existingData.country
    ].filter(part => part && part.trim()); // Filter out empty/null values
    return locationParts.join(', ');
  });
  const [selectedVendor, setSelectedVendor] = useState<string>(existingData.vendorId || '');
  const [newVendor, setNewVendor] = useState<string>('');
  const [unit, setUnit] = useState<string>(''); // Will be set by useEffect
  const [unitRate, setUnitRate] = useState<string>(existingData.unitRate?.toString() || '');
  const [approxQty, setApproxQty] = useState<string>(existingData.approxQty?.toString() || '');
  const [remarks, setRemarks] = useState<string>(existingData.remarks || '');

  // Dropdown options state
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<string[]>([]);

  // UI state for conditional rendering
  const [showSourceProposedFor, setShowSourceProposedFor] = useState(false);
  // NEW STATE: Track if no categories are available
  const [noCategoriesAvailable, setNoCategoriesAvailable] = useState(false);

  // Get display names for readonly fields
  const [workCategoryDisplayName, setWorkCategoryDisplayName] = useState<string>('');
  const [materialDisplayName, setMaterialDisplayName] = useState<string>('');

  // --- CASCADING & CONDITIONAL LOGIC ---
  useEffect(() => {
    if (!workCategory) return;
    
    const categoryData = sourceApprovalDataSource[workCategory];
    setShowSourceProposedFor(categoryData?.isAggregate || false);
    setMaterialOptions(Object.keys(categoryData?.materials || {}));
    
    // Set display name for work category
    setWorkCategoryDisplayName(workCategory);
  }, [workCategory]);

  useEffect(() => {
    if (!materialName || !workCategory) return;
    
    const categories =
      sourceApprovalDataSource[workCategory]?.materials[materialName]
        ?.categories || {};
    const categoryKeys = Object.keys(categories);
    
    setMaterialCategoryOptions(categoryKeys);
    
    // NEW CASE: Handle when no categories are available
    if (categoryKeys.length === 0) {
      setNoCategoriesAvailable(true);
      setMaterialCategory('N/A'); // Set default value
      setUnit('N/A'); // Set default unit
      Alert.alert(
        'No Categories Available',
        `No specific categories are available for "${materialName}". The material category will be set to "N/A".`,
        [{text: 'OK'}]
      );
    } else {
      setNoCategoriesAvailable(false);
      // Reset category if it was previously set to N/A
      if (materialCategory === 'N/A') {
        setMaterialCategory('');
      }
    }
    
    // Set display name for material
    setMaterialDisplayName(materialName);
  }, [materialName, workCategory]);

  useEffect(() => {
    if (!materialCategory || !materialName || !workCategory) return;
    
    // NEW CASE: Skip unit setting if no categories available
    if (noCategoriesAvailable) {
      setUnit('N/A');
      return;
    }
    
    const categoryData =
      sourceApprovalDataSource[workCategory]?.materials[materialName]
        ?.categories[materialCategory];
    setUnit(categoryData?.unit || '');
  }, [materialCategory, materialName, workCategory, noCategoriesAvailable]);

  // Initialize readonly fields display names on component mount
  useEffect(() => {
    // Use the name fields if available, otherwise fall back to ID fields
    if (existingData.testWorkCategoryName) {
      setWorkCategoryDisplayName(existingData.testWorkCategoryName);
    } else if (existingData.testWorkCategoryId) {
      setWorkCategoryDisplayName(existingData.testWorkCategoryId);
    }
    
    if (existingData.testMaterialName) {
      setMaterialDisplayName(existingData.testMaterialName);
    } else if (existingData.testMaterialId) {
      setMaterialDisplayName(existingData.testMaterialId);
    }
  }, [existingData]);

  const dispatch = useDispatch();
  // --- HANDLER FUNCTIONS ---
  const handleUpload = (fileName: string) =>
    Alert.alert('Upload', `Simulating upload for: ${fileName}`);

// Updated handleSubmit function
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
  // Format the data according to the required API structure
  const apiPayload = {
    projectId: existingData.projectId, // Assuming this exists in existingData
    testMaterialId: existingData?.testMaterialId, // Using materialName as testMaterialId
    id: existingData._id || existingData.id, // The source approval ID
    body: {
      // Core source information
      name: sourceName,
      materialCategory,
      location,
      vendor: selectedVendor || newVendor,
      unit,
      unitRate: parseFloat(unitRate) || 0,
      approxQty: parseFloat(approxQty) || 0,
      remarks,
      
      // Conditional fields
      ...(showSourceProposedFor && {
        sourceProposedFor: sourceProposedFor.split(', ').filter(s => s.trim())
      }),
      
      // Additional flags and metadata
      noCategoriesAvailable,
      
      // Include any existing file references that should be preserved
      ...(existingData.specificationsFile && {
        specificationsFile: existingData.specificationsFile
      }),
      ...(existingData.vendorCredentialsFile && {
        vendorCredentialsFile: existingData.vendorCredentialsFile
      }),
      ...(existingData.quotationFile && {
        quotationFile: existingData.quotationFile
      }),
      
      // Timestamp for update tracking
      updatedAt: new Date().toISOString(),
    }
  };
  // Dispatch to patchSourceApproval API
  // Replace 'dispatch' with your actual dispatch method
      dispatch(putSourceApproval(apiPayload))
};

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        {/* Work Category - Read only in edit mode, editable in create mode */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Work Category* {(isEditMode || isViewMode) && '(Read Only)'}
          </Text>
          {isCreateMode ? (
            <DropdownPicker
              label=""
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
          ) : (
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={workCategoryDisplayName}
              editable={false}
            />
          )}
        </View>

        {/* Material Name - Read only in edit mode, editable in create mode */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Material Name* {(isEditMode || isViewMode) && '(Read Only)'}
          </Text>
          {isCreateMode ? (
            <DropdownPicker
              label=""
              items={[
                {label: 'Select Material', value: ''},
                ...materialOptions.map(mat => ({label: mat, value: mat})),
              ]}
              value={materialName}
              onChange={setMaterialName}
            />
          ) : (
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={materialDisplayName}
              editable={false}
            />
          )}
        </View>

        {/* NEW CASE: Conditional rendering based on categories availability */}
        {noCategoriesAvailable ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Material category*</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value="N/A - No categories available"
              editable={false}
            />
            <Text style={styles.helpText}>
              No specific categories are configured for this material.
            </Text>
          </View>
        ) : (
          <DropdownPicker
            label="Material category*"
            items={[
              {label: 'Select Material Category', value: ''},
              ...materialCategoryOptions.map(cat => ({label: cat, value: cat})),
            ]}
            value={materialCategory}
            onChange={isViewMode ? () => {} : setMaterialCategory}
            disabled={isViewMode}
          />
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Source Name*</Text>
          <TextInput
            style={[styles.input, isViewMode && styles.readOnlyInput]}
            value={sourceName}
            onChangeText={setSourceName}
            placeholder="Enter source name"
            maxLength={50}
            editable={!isViewMode}
          />
        </View>

        {/* Conditional Dropdown - disabled in view mode */}
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
            onChange={isViewMode ? () => {} : setSourceProposedFor}
            multiSelect={true}
            disabled={isViewMode}
          />
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location*</Text>
          <TextInput
            style={[styles.input, styles.textArea, isViewMode && styles.readOnlyInput]}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter State/District/Address"
            multiline
            editable={!isViewMode}
          />
        </View>

        {/* Vendor selection - disabled in view mode */}
        <DropdownPicker
          label="Select an existing vendor*"
          items={[
            {label: 'Select an existing vendor', value: ''},
            ...existingVendors.map(v => ({label: v, value: v})),
          ]}
          value={selectedVendor}
          onChange={isViewMode ? () => {} : setSelectedVendor}
          disabled={isViewMode}
        />
        {!isViewMode && <Text style={styles.orText}>OR</Text>}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {isViewMode ? 'Vendor Name' : 'Enter New Vendor Name'}
          </Text>
          <TextInput
            style={[styles.input, isViewMode && styles.readOnlyInput]}
            value={newVendor}
            onChangeText={setNewVendor}
            placeholder={isViewMode ? '' : 'Enter if vendor is new'}
            editable={!isViewMode}
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
            style={[styles.input, isViewMode && styles.readOnlyInput]}
            value={unitRate}
            onChangeText={setUnitRate}
            keyboardType="decimal-pad"
            placeholder="Enter rate"
            editable={!isViewMode}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Approx Qty*</Text>
          <TextInput
            style={[styles.input, isViewMode && styles.readOnlyInput]}
            value={approxQty}
            onChangeText={setApproxQty}
            keyboardType="decimal-pad"
            placeholder="Enter quantity"
            editable={!isViewMode}
          />
        </View>

        {/* File Upload Sections - Show appropriate text based on mode */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {isViewMode ? 'Specifications File' : 'Upload Specifications (if applicable)'}
          </Text>
          {!isViewMode ? (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleUpload('Specifications')}>
              <Text style={styles.uploadButtonText}>
                {existingData.specificationsFile ? 'Replace File' : 'Upload File'}
              </Text>
            </TouchableOpacity>
          ) : null}
          {existingData.specificationsFile && (
            <Text style={styles.existingFileText}>
              {isViewMode ? 'File: ' : 'Current: '}{existingData.specificationsFile}
            </Text>
          )}
          {isViewMode && !existingData.specificationsFile && (
            <Text style={styles.existingFileText}>No file uploaded</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {isViewMode ? 'Vendor Credentials File' : 'Upload Vendor Credentials (if applicable)'}
          </Text>
          {!isViewMode ? (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleUpload('Vendor Credentials')}>
              <Text style={styles.uploadButtonText}>
                {existingData.vendorCredentialsFile ? 'Replace File' : 'Upload File'}
              </Text>
            </TouchableOpacity>
          ) : null}
          {existingData.vendorCredentialsFile && (
            <Text style={styles.existingFileText}>
              {isViewMode ? 'File: ' : 'Current: '}{existingData.vendorCredentialsFile}
            </Text>
          )}
          {isViewMode && !existingData.vendorCredentialsFile && (
            <Text style={styles.existingFileText}>No file uploaded</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {isViewMode ? 'Quotation File' : 'Upload Quotation (if applicable)'}
          </Text>
          {!isViewMode ? (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleUpload('Quotation')}>
              <Text style={styles.uploadButtonText}>
                {existingData.quotationFile ? 'Replace File' : 'Upload File'}
              </Text>
            </TouchableOpacity>
          ) : null}
          {existingData.quotationFile && (
            <Text style={styles.existingFileText}>
              {isViewMode ? 'File: ' : 'Current: '}{existingData.quotationFile}
            </Text>
          )}
          {isViewMode && !existingData.quotationFile && (
            <Text style={styles.existingFileText}>No file uploaded</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks (if any)</Text>
          <TextInput
            style={[styles.input, styles.textArea, isViewMode && styles.readOnlyInput]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks"
            multiline
            maxLength={500}
            editable={!isViewMode}
          />
        </View>

        {/* Action Buttons - Different based on mode */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.submitButton, styles.cancelButton]} 
            onPress={() => navigation.goBack()}>
            <Text style={[styles.submitButtonText, styles.cancelButtonText]}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Text>
          </TouchableOpacity>
          
          {!isViewMode && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {isCreateMode ? 'Create Source' : 'Update Source'}
              </Text>
            </TouchableOpacity>
          )}
          
          {isViewMode && (
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => navigation.navigate('SourceApprovalEditForm', {
                sourceData: existingData, 
                type: 'edit'
              })}>
              <Text style={styles.submitButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
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
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 14,
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
  existingFileText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  submitButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#5A2AAF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5A2AAF',
  },
  cancelButtonText: {
    color: '#5A2AAF',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#777',
    fontWeight: 'bold',
  },
  // NEW STYLE: Help text for no categories case
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});