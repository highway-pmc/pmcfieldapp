// src/screens/MaterialStoreRequestForm.tsx

import React, {useEffect, useState, useMemo} from 'react';
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
import DetailsCard from '../Common/DetailsCard';

// --- Type Definitions ---

interface TaskMappingData {
  workCategory: string;
  materialName: string;
  taskPath: string;
  userName: string;
}

interface MaterialDataSource {
  [materialName: string]: {
    categories: {
      [category: string]: {unit: string};
    };
  };
}

interface DropdownOption {
  label: string;
  value: string;
}

type MaterialStoreRequestFormProps = {
  route: {params?: {requestType?: string}};
  navigation: any; // Replace with your actual navigation type
};

// --- Mock Data ---

const taskMappingData: TaskMappingData = {
  workCategory: 'Structural Steel',
  materialName: 'TMT Bars',
  taskPath: 'Project X / Tower A / Foundation / Raft',
  userName: 'Prakash Kumar (Site Engineer)',
};

const materialDataSource: MaterialDataSource = {
  'TMT Bars': {
    categories: {
      'Fe-500D': {unit: 'Tonne'},
      'Fe-550': {unit: 'Tonne'},
      'Epoxy Coated': {unit: 'Kg'},
    },
  },
  // Add other materials here
};

// --- Component ---

export default function MaterialStoreRequestForm({
  route,
  navigation,
}: MaterialStoreRequestFormProps) {
  const isFocused = useIsFocused();
  const {requestType} = route.params || {};

  const [materialCategory, setMaterialCategory] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<
    DropdownOption[]
  >([]);
  const [requestDateTime, setRequestDateTime] = useState<string>('');

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit(
        'headerEvent',
        requestType === REQUEST_TYPES.CONTINGENCY_REQUEST
          ? HeaderItems.contigencyRequest
          : HeaderItems.inventryRequest,
      );

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
  }, [isFocused, requestType]);

  useEffect(() => {
    const categoryData =
      materialDataSource[taskMappingData.materialName]?.categories[
        materialCategory
      ];
    setUnit(categoryData?.unit || '');
  }, [materialCategory]);

  const handleSubmit = () => {
    // ... (Your existing validation and submission logic remains the same)
    Alert.alert('Success', 'Material request has been submitted!');
    navigation.goBack();
  };

  // Data for the read-only details card
  const detailsData = useMemo(
    () => [
      {label: 'Work Category', value: taskMappingData.workCategory},
      {label: 'Material Name', value: taskMappingData.materialName},
      {label: 'Task Details', value: taskMappingData.taskPath},
      {label: 'Requested by', value: taskMappingData.userName},
      {label: 'Request Date & Time', value: requestDateTime},
    ],
    [requestDateTime],
  );

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Read-only data is now displayed cleanly in the DetailsCard */}
      <DetailsCard title="Request Details" data={detailsData} />

      {/* A separate card for user inputs */}
      <View style={styles.formContainer}>
        <Text style={styles.cardTitle}>Material Specifications</Text>
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

        {requestType === REQUEST_TYPES.CONTINGENCY_REQUEST && (
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
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
  submitButton: {
    height: 52,
    backgroundColor: '#5A2AAF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
