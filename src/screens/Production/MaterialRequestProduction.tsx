import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import DetailsCard from '../Common/DetailsCard';
import DropdownPicker from '../../components/UI/DropdownPicker';


const taskMappingData = {
  workCategory: 'Cement',
  materialName: 'OPC Cement',
  taskPath: 'Project Y / Section 2 / Piling / Cast-in-Situ',
  userName: 'Ravi Sharma (Production Manager)',
};


const materialDataSource = {
  'TMT Bars': {
    categories: {
      'Fe-500D': {unit: 'Tonne'},
      'Fe-550': {unit: 'Tonne'},
    },
    plants: ['Cutting & Bending Yard A', 'Fabrication Shop B'],
  },
  'OPC Cement': {
    categories: {
      'Grade 43': {unit: 'Bag'},
      'Grade 53': {unit: 'Bag'},
    },
    plants: ['Batching Plant 1', 'Batching Plant 2', 'Silo Storage 3'],
  },
};

export default function MaterialProductionRequestForm({navigation}: any) {
  const isFocused = useIsFocused();

  // --- FORM STATE ---
  const [materialCategory, setMaterialCategory] = useState<string>('');
  const [selectedPlant, setSelectedPlant] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [requestDateTime, setRequestDateTime] = useState<string>('');

  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<
    {label: string; value: string}[]
  >([]);
  const [plantOptions, setPlantOptions] = useState<
    {label: string; value: string}[]
  >([]);

  useEffect(() => {
    if (isFocused) {
      // Set the current date and time
      const now = new Date();
      const formattedDateTime = `${now.toLocaleDateString(
        'en-IN',
      )} ${now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
      setRequestDateTime(formattedDateTime);

      // Populate dropdown options based on the incoming material name
      const materialData = materialDataSource[taskMappingData.materialName];
      if (materialData) {
        const categoryOpts = Object.keys(materialData.categories).map(cat => ({
          label: cat,
          value: cat,
        }));
        const plantOpts = materialData.plants.map(plant => ({
          label: plant,
          value: plant,
        }));
        setMaterialCategoryOptions(categoryOpts);
        setPlantOptions(plantOpts);
      }
    }
  }, [isFocused]);

  // Update the unit whenever the material category changes
  useEffect(() => {
    const categoryData =
      materialDataSource[taskMappingData.materialName]?.categories[
        materialCategory
      ];
    setUnit(categoryData?.unit || '');
  }, [materialCategory]);

  const handleSubmit = () => {
    // ... (Your validation logic remains the same)
    Alert.alert('Success', 'Material request has been submitted!');
    navigation.goBack();
  };

  // Prepare data for the DetailsCard
  const cardData = [
    {label: 'Work Category', value: taskMappingData.workCategory},
    {label: 'Material Name', value: taskMappingData.materialName},
    {label: 'Task Details', value: taskMappingData.taskPath},
    {type: 'divider' as const}, // Use "as const" for type safety
    {label: 'Requested By', value: taskMappingData.userName},
    {label: 'Request Time', value: requestDateTime},
  ];

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <DetailsCard title="Request Details" data={cardData} />
      <View style={styles.formContainer}>
        <DropdownPicker
          label="Material Category*"
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
          <Text style={styles.label}>Qty Required*</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            placeholder="Enter quantity (e.g., 200)"
          />
        </View>

        <DropdownPicker
          label="Select Plant*"
          items={[{label: 'Select Plant', value: ''}, ...plantOptions]}
          value={selectedPlant}
          onChange={setSelectedPlant}
        />

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
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FF',
  },
  formContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    elevation: 2,
  },
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
    height: 42,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
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
    paddingTop: 10,
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
