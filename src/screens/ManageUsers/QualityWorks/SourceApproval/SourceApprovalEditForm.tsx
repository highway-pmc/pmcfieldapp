import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import DropdownPicker from '../../../../components/UI/DropdownPicker';
import MultiSelectDropdown from '../../../Common/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { putSourceApproval } from '../../actions';
import { useSnackbar } from '../../../../context/SnackbarContext';
import { useIsFocused } from '@react-navigation/native';

/* ---------------- CONSTANTS ---------------- */

const sourceProposedForOptions = [
  'CONCRETE',
  'DBM',
  'BC',
  'CTSB',
  'WMM',
  'CTB',
];

export default function SourceApprovalEditForm({route, navigation}: any) {
  const existingData = route?.params?.sourceData || {};

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();

  const { putSourceApprovalData, error } = useSelector(
    (state: any) => state.SourceApprovals,
  );


  useEffect(() => {
    if (putSourceApprovalData) {
      showSnackbar('Source updated successfully', 'success');
      navigation.goBack();
    }
    if (error) {
      showSnackbar(error, 'error');
    }
  }, [putSourceApprovalData, error]);

  /* ---------------- STATE ---------------- */

  const [workCategory] = useState(
    existingData?.testWorkCategoryId?.name || '',
  );

  const [materialName] = useState(
    existingData?.testMaterialId?.name || '',
  );

  const [materialCategory] = useState(
    existingData?.materialCategory || '',
  );

  const [sourceName, setSourceName] = useState(existingData?.name || '');

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    existingData?.sourceProposedFor || [],
  );

  const [location, setLocation] = useState(
    [
      existingData?.address,
      existingData?.district,
      existingData?.state,
      existingData?.country,
    ]
      .filter(Boolean)
      .join(', '),
  );

  const [unit] = useState(
    existingData?.testMaterialId?.materialUnit || '',
  );

  const [unitRate, setUnitRate] = useState(
    existingData?.unitRate?.toString() || '',
  );

  const [approxQty, setApproxQty] = useState(
    existingData?.approxQty?.toString() || '',
  );

  const [remarks, setRemarks] = useState(existingData?.remarks || '');

  /* ---------------- FILE STATES ---------------- */

  const [specificationsFile, setSpecificationsFile] = useState<any>(null);
  const [vendorCredentialsFile, setVendorCredentialsFile] = useState<any>(null);
  const [quotationFile, setQuotationFile] = useState<any>(null);

  /* ---------------- FILE PICKER ---------------- */

  const pickFile = async (
    type: 'Specifications' | 'Vendor' | 'Quotation',
  ) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const fileObj = {
        uri: res.uri,
        name: res.name,
        type: res.type,
      };

      if (type === 'Specifications') setSpecificationsFile(fileObj);
      if (type === 'Vendor') setVendorCredentialsFile(fileObj);
      if (type === 'Quotation') setQuotationFile(fileObj);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'File selection failed');
      }
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append('id', existingData._id);
    formData.append('projectId', existingData.projectId);
    formData.append('testMaterialId', existingData.testMaterialId._id);
    formData.append('testWorkCategoryId', existingData.testWorkCategoryId._id);
    formData.append(
      'testWorkCategoryType',
      existingData.testWorkCategoryId.name,
    );
    formData.append('testMaterialType', existingData.testMaterialType);

    formData.append('name', sourceName);
    formData.append('materialCategory', materialCategory);
    formData.append('location', location);
    formData.append('unit', unit);
    formData.append('unitRate', unitRate);
    formData.append('approxQty', approxQty);
    formData.append('remarks', remarks);

    selectedOptions.forEach(item => {
      formData.append('sourceProposedFor[]', item);
    });

    if (specificationsFile)
      formData.append('specificationsFile', specificationsFile);
    if (vendorCredentialsFile)
      formData.append('vendorCredentialsFile', vendorCredentialsFile);
    if (quotationFile)
      formData.append('quotationFile', quotationFile);


    dispatch(putSourceApproval({projectId: existingData?.projectId, 
      testMaterialId: existingData.testMaterialId._id, id: existingData._id || existingData.id, body: formData}));
    //Alert.alert('Success', 'Source updated successfully');
    navigation.goBack();
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return '';
    return decodeURIComponent(url.split('/').pop().split('?')[0]);
  };

  /* ---------------- UI ---------------- */

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        {/* DISABLED FIELDS */}
        <DropdownPicker
          label="Work Category*"
          items={[{label: workCategory, value: workCategory}]}
          value={workCategory}
          inputStyle={styles.readOnlyInput}
          disabled
        />

        <DropdownPicker
          label="Material Name*"
          items={[{label: materialName, value: materialName}]}
          value={materialName}
          inputStyle={styles.readOnlyInput}
          disabled
        />

        <DropdownPicker
          label="Material Category*"
          items={[{label: materialCategory, value: materialCategory}]}
          value={materialCategory}
          inputStyle={styles.readOnlyInput}
          disabled
        />

        {/* EDITABLE FIELDS */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Source Name*</Text>
          <TextInput
            style={styles.input}
            value={sourceName}
            onChangeText={setSourceName}
          />
        </View>

        <Text style={styles.label}>Source Proposed For</Text>
        <MultiSelectDropdown
          options={sourceProposedForOptions}
          selectedItems={selectedOptions}
          onSelectionChange={setSelectedOptions}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location*</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={location}
            onChangeText={setLocation}
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={unit}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit Rate*</Text>
          <TextInput
            style={styles.input}
            value={unitRate}
            onChangeText={setUnitRate}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Approx Qty*</Text>
          <TextInput
            style={styles.input}
            value={approxQty}
            onChangeText={setApproxQty}
            keyboardType="decimal-pad"
          />
        </View>

        {/* FILE UPLOADS */}
        {[
          ['Specifications', specificationsFile, existingData?.specificationsFile],
          ['Vendor', vendorCredentialsFile, existingData?.vendorCredentialsFile],
          ['Quotation', quotationFile, existingData?.quotationFile],
        ].map(([type, file, existing]) => (
          <View style={styles.formGroup} key={type}>
            <Text style={styles.label}>Upload {type}</Text>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickFile(type)}>
              <Text style={styles.uploadButtonText}>
                {file ? 'Change File' : 'Upload File'}
              </Text>
            </TouchableOpacity>

            {(file || existing) && (
              <Text style={[styles.label, { marginTop: 6 }]}>
                Selected:{' '}
                {file?.name || getFileNameFromUrl(existing)}
              </Text>
            )}
          </View>
        ))}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update Source</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  formContainer: {padding: 16},
  formGroup: {marginBottom: 15},
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500'
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 12,
  },
  textArea: {height: 80, textAlignVertical: 'top'},
  readOnlyInput: {backgroundColor: '#f1f1f1', pointerEvents: 'none'},
 uploadButton: {
    height: 44,
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
    backgroundColor: '#5A2AAF',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {color: '#fff', fontWeight: 'bold'},
});
