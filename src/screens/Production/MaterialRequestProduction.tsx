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
import DropdownPicker from '../../../components/UI/DropdownPicker'; // Using your custom component

// --- SIMULATED INCOMING DATA ---
// This data would typically come from navigation params or a Redux selector
const taskMappingData = {
  workCategory: 'Cement',
  materialName: 'OPC Cement',
  taskPath: 'Project Y / Section 2 / Piling / Cast-in-Situ',
  userName: 'Ravi Sharma (Production Manager)',
};

// Data source now includes a list of plants for each material
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

export default function MaterialProductionRequestForm({navigation}) {
  const isFocused = useIsFocused();

  // --- FORM STATE ---
  const [materialCategory, setMaterialCategory] = useState<string>('');
  const [selectedPlant, setSelectedPlant] = useState<string>(''); // New state for the plant
  const [unit, setUnit] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // Auto-populated and dropdown options state
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<
    {label: string; value: string}[]
  >([]);
  const [plantOptions, setPlantOptions] = useState<
    {label: string; value: string}[]
  >([]); // New state for plant options
  const [requestDateTime, setRequestDateTime] = useState<string>('');

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

  // --- DEPENDENT LOGIC ---
  useEffect(() => {
    // Update the unit whenever the material category changes
    const categoryData =
      materialDataSource[taskMappingData.materialName]?.categories[
        materialCategory
      ];
    setUnit(categoryData?.unit || '');
  }, [materialCategory]);

  // --- HANDLER FUNCTIONS ---
  const handleSubmit = () => {
    // Validation
    if (!materialCategory || !quantity || !selectedPlant) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields marked with *.',
      );
      return;
    }

    const formData = {
      ...taskMappingData,
      materialCategory,
      unit,
      quantity,
      selectedPlant,
      remarks,
      requestDateTime,
    };

    console.log('Form Submitted:', JSON.stringify(formData, null, 2));
    Alert.alert(
      'Success',
      'Material request has been submitted to production!',
    );
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
            placeholder="Enter quantity (e.g., 200)"
          />
        </View>

        {/* New Dropdown for Selecting a Plant */}
        <DropdownPicker
          label="Select Plant*"
          items={[{label: 'Select Plant', value: ''}, ...plantOptions]}
          value={selectedPlant}
          onChange={setSelectedPlant}
        />

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
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 15,
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
