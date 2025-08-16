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
import DropdownPicker from '../../components/UI/DropdownPicker';
import {HeaderItems, REQUEST_TYPES} from '../../constants/constants';

// In a real app, this data would come from navigation params or a Redux selector
const taskMappingData = {
  workCategory: 'Structural Steel',
  materialName: 'TMT Bars',
  taskPath: 'Project X / Tower A / Foundation / Raft',
  userName: 'Prakash Kumar (Site Engineer)',
};

const materialDataSource = {
  'TMT Bars': {
    categories: {
      'Fe-500D': {unit: 'Tonne'},
      'Fe-550': {unit: 'Tonne'},
      'Epoxy Coated': {unit: 'Kg'},
    },
  },
  // Add other materials here
};

export default function MaterialStoreRequestForm({route, navigation}: any) {
  const isFocused = useIsFocused();
  const {requestType} = route.params || {};

  const [materialCategory, setMaterialCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [remarks, setRemarks] = useState('');
  const [reason, setReason] = useState('');
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState([]);
  const [requestDateTime, setRequestDateTime] = useState('');
  const focus = useIsFocused();
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit(
        'headerEvent',
        requestType === REQUEST_TYPES.CONTINGENCE_REQUEST
          ? HeaderItems.contigencyRequest
          : HeaderItems.inventryRequest,
      );
    }
  }, [focus]);
  useEffect(() => {
    if (isFocused) {
      const now = new Date();
      const formattedDateTime = `${now.toLocaleDateString(
        'en-IN',
      )} ${now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
      setRequestDateTime(formattedDateTime);

      const categories =
        materialDataSource[taskMappingData.materialName]?.categories || {};
      const options = Object.keys(categories).map(cat => ({
        label: cat,
        value: cat,
      }));
      setMaterialCategoryOptions(options);
    }
  }, [isFocused]);

  React.useEffect(() => {
    const categoryData =
      materialDataSource[taskMappingData.materialName]?.categories[
        materialCategory
      ];
    setUnit(categoryData?.unit || '');
  }, [materialCategory]);

  const handleSubmit = () => {
    if (!materialCategory || !quantity) {
      Alert.alert(
        'Validation Error',
        'Please select a material category and enter the required quantity.',
      );
      return;
    }

    const formData = {
      ...taskMappingData,
      materialCategory,
      unit,
      quantity,
      remarks,
      requestDateTime,
      requestType, // Include the requestType in the submission
    };

    console.log('Form Submitted:', JSON.stringify(formData, null, 2));
    Alert.alert('Success', 'Material request has been submitted!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Work Category</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={taskMappingData.workCategory}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Material Name</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={taskMappingData.materialName}
            editable={false}
          />
        </View>

        <DropdownPicker
          label="Material category*"
          items={[
            {label: 'Select Material Category', value: ''},
            ...materialCategoryOptions,
          ]}
          value={materialCategory}
          onChange={setMaterialCategory}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={unit}
            editable={false}
            placeholder="Unit will be set automatically"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Qty required*</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            placeholder="Enter quantity (e.g., 150.5)"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Task details</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput, styles.textArea]}
            value={taskMappingData.taskPath}
            editable={false}
            multiline
          />
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

        {requestType === REQUEST_TYPES.CONTINGENCE_REQUEST && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Reason for Contingency*</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={reason}
              onChangeText={setReason}
              placeholder="Enter reason for contingency request"
              multiline
              maxLength={500}
            />
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Requested by</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={taskMappingData.userName}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Request date and time</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={requestDateTime}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 14,
    paddingVertical: 10,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#555',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
});
