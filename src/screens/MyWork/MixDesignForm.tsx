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
import DropdownPicker from '../../components/UI/DropdownPicker';
import CalendarPicker from '../../components/UI/CalenderPicker';
import {SAMPLE_BY_LIST} from '../../constants/constants';

// --- MOCK DATA FOR THE FORM ---
const mixDesignDataSource = {
  'Concrete Works': {
    materialTypes: {
      PQC: {
        categories: {'M40 Grade': {unit: 'Cu.M.'}},
      },
      DLC: {
        categories: {'M15 Grade': {unit: 'Cu.M.'}},
      },
    },
  },
  'Bituminous Works': {
    materialTypes: {
      DBM: {
        categories: {'Grade 1': {unit: 'Tonne'}},
      },
      BC: {
        categories: {'VG-30': {unit: 'Tonne'}},
      },
    },
  },
};

// Data source for the dynamic table's material dropdown
const tableMaterialSource = [
  {
    description: 'Crushed Stone Aggregate',
    category: '20mm',
    source: 'Local Quarry A',
    unit: 'Kg',
  },
  {
    description: 'Fine Aggregate (Sand)',
    category: 'Zone II',
    source: 'Riverbed Extraction B',
    unit: 'Kg',
  },
  {
    description: 'Portland Cement',
    category: 'OPC 53 Grade',
    source: 'UltraTech Plant C',
    unit: 'Kg',
  },
  {
    description: 'Admixture',
    category: 'Superplasticizer',
    source: 'BASF Chemicals',
    unit: 'Litre',
  },
  {
    description: 'Water',
    category: 'Potable',
    source: 'On-site Treatment Plant',
    unit: 'Litre',
  },
];

// --- TYPE DEFINITIONS ---
type TableRowData = {
  rowId: number;
  selectedMaterial: string | null;
  materialCategory: string;
  source: string;
  unit: string;
  qty: string;
};

export default function MixDesignForm({}) {
  const isFocused = useIsFocused();

  // --- FORM STATE ---
  // Top section state
  const [dateOfSampling, setDateOfSampling] = useState<string>('');
  const [dateOfTesting, setDateOfTesting] = useState<string>('');
  const [sampledBy, setSampledBy] = useState<string>('');
  const [conductedBy, setConductedBy] = useState<string>('');

  // Mix design info state
  const [mixDesignName, setMixDesignName] = useState('');
  const [workCategory, setWorkCategory] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [materialCategory, setMaterialCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [totalQtyComposition, setTotalQtyComposition] = useState('');

  // Dropdown options state
  const [materialTypeOptions, setMaterialTypeOptions] = useState<string[]>([]);
  const [materialCategoryOptions, setMaterialCategoryOptions] = useState<
    string[]
  >([]);

  // Table state
  const [tableData, setTableData] = useState<TableRowData[]>([
    {
      rowId: 1,
      selectedMaterial: null,
      materialCategory: '',
      source: '',
      unit: '',
      qty: '',
    },
  ]);
  const [totalQty, setTotalQty] = useState<number>(0);

  // --- LOGIC & EFFECTS ---
  // Cascading dropdown logic
  useEffect(() => {
    const types = mixDesignDataSource[workCategory]?.materialTypes || {};
    setMaterialTypeOptions(Object.keys(types));
    setMaterialType('');
  }, [workCategory]);

  useEffect(() => {
    const categories =
      mixDesignDataSource[workCategory]?.materialTypes[materialType]
        ?.categories || {};
    setMaterialCategoryOptions(Object.keys(categories));
    setMaterialCategory('');
  }, [materialType, workCategory]);

  useEffect(() => {
    const catData =
      mixDesignDataSource[workCategory]?.materialTypes[materialType]
        ?.categories[materialCategory];
    setUnit(catData?.unit || '');
  }, [materialCategory, materialType, workCategory]);

  // Calculate total quantity whenever table data changes
  useEffect(() => {
    const sum = tableData.reduce(
      (acc, row) => acc + (parseFloat(row.qty) || 0),
      0,
    );
    setTotalQty(sum);
  }, [tableData]);

  // --- HANDLER FUNCTIONS ---
  const handleAddRow = () => {
    setTableData(prev => [
      ...prev,
      {
        rowId: Date.now(),
        selectedMaterial: null,
        materialCategory: '',
        source: '',
        unit: '',
        qty: '',
      },
    ]);
  };

  const handleRemoveRow = (rowId: number) => {
    if (tableData.length > 1) {
      setTableData(prev => prev.filter(row => row.rowId !== rowId));
    }
  };

  // Auto-populates table row when a material is selected
  const handleMaterialSelection = (rowId: number, selectedDesc: string) => {
    const materialData = tableMaterialSource.find(
      m => m.description === selectedDesc,
    );
    setTableData(prev =>
      prev.map(row =>
        row.rowId === rowId
          ? {
              ...row,
              selectedMaterial: selectedDesc,
              materialCategory: materialData?.category || '',
              source: materialData?.source || '',
              unit: materialData?.unit || '',
            }
          : row,
      ),
    );
  };

  const handleQtyChange = (rowId: number, value: string) => {
    setTableData(prev =>
      prev.map(row => (row.rowId === rowId ? {...row, qty: value} : row)),
    );
  };

  const handleSubmit = () => {
    // Add validation as needed
    Alert.alert('Form Submitted', 'Mix design details have been submitted.');
    console.log({
      formData: {
        dateOfSampling,
        dateOfTesting,
        workCategory,
        tableData,
        totalQty,
      },
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        {/* Top Section */}
        <CalendarPicker
          label="Date of Sampling*"
          value={dateOfSampling}
          onChange={setDateOfSampling}
        />
        <CalendarPicker
          label="Date of Testing*"
          value={dateOfTesting}
          onChange={setDateOfTesting}
        />
        <DropdownPicker
          label="Sampled By"
          items={SAMPLE_BY_LIST}
          value={sampledBy}
          onChange={setSampledBy}
        />
        <DropdownPicker
          label="Mix design Conducted By"
          items={SAMPLE_BY_LIST}
          value={conductedBy}
          onChange={setConductedBy}
        />

        {/* Mix Design Information Section */}
        <Text style={styles.sectionTitle}>Mix Design Information</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mix Design Short Name</Text>
          <TextInput
            style={styles.input}
            value={mixDesignName}
            onChangeText={setMixDesignName}
            placeholder="Enter short name"
            maxLength={50}
          />
        </View>
        <DropdownPicker
          label="Work Category"
          items={[
            {label: 'Select...', value: ''},
            ...Object.keys(mixDesignDataSource).map(k => ({
              label: k,
              value: k,
            })),
          ]}
          value={workCategory}
          onChange={setWorkCategory}
        />
        <DropdownPicker
          label="Material Type"
          items={[
            {label: 'Select...', value: ''},
            ...materialTypeOptions.map(k => ({label: k, value: k})),
          ]}
          value={materialType}
          onChange={setMaterialType}
        />
        <DropdownPicker
          label="Material Category"
          items={[
            {label: 'Select...', value: ''},
            ...materialCategoryOptions.map(k => ({label: k, value: k})),
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
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Total qty of material considered for composition
          </Text>
          <TextInput
            style={styles.input}
            value={totalQtyComposition}
            onChangeText={setTotalQtyComposition}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Dynamic Table Section */}
        <Text style={styles.sectionTitle}>Material Composition</Text>
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.colMaterial]}>
                Description of Material
              </Text>
              <Text style={[styles.tableHeaderText, styles.colCategory]}>
                Material Category
              </Text>
              <Text style={[styles.tableHeaderText, styles.colSource]}>
                Source of Material
              </Text>
              <Text style={[styles.tableHeaderText, styles.colUnit]}>Unit</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.colAction]}>
                Action
              </Text>
            </View>
            {/* Table Body */}
            {tableData.map(row => (
              <View key={row.rowId} style={styles.tableBodyRow}>
                <View style={styles.colMaterial}>
                  <DropdownPicker
                    items={[
                      {label: 'Select...', value: ''},
                      ...tableMaterialSource.map(m => ({
                        label: m.description,
                        value: m.description,
                      })),
                    ]}
                    value={row.selectedMaterial || ''}
                    onChange={val => handleMaterialSelection(row.rowId, val)}
                  />
                </View>
                <View style={styles.colCategory}>
                  <Text style={styles.readOnlyText}>
                    {row.materialCategory || 'N/A'}
                  </Text>
                </View>
                <View style={styles.colSource}>
                  <Text style={styles.readOnlyText}>{row.source || 'N/A'}</Text>
                </View>
                <View style={styles.colUnit}>
                  <Text style={styles.readOnlyText}>{row.unit || 'N/A'}</Text>
                </View>
                <View style={styles.colQty}>
                  <TextInput
                    style={styles.input}
                    value={row.qty}
                    onChangeText={val => handleQtyChange(row.rowId, val)}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.colAction}>
                  <TouchableOpacity
                    onPress={() => handleRemoveRow(row.rowId)}
                    style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
          <Text style={styles.addButtonText}>+ Add Material</Text>
        </TouchableOpacity>

        {/* Total Section */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={totalQty.toFixed(3)}
            editable={false}
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
  label: {fontSize: 14, marginBottom: 8, color: '#333', fontWeight: '500'},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
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
  readOnlyInput: {backgroundColor: '#f0f0f0', color: '#555'},
  readOnlyText: {
    minHeight: 48,
    paddingHorizontal: 10,
    paddingTop: 14,
    color: '#555',
    fontSize: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    height: 48,
    backgroundColor: '#5A2AAF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
  },
  submitButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  // Table styles
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    paddingVertical: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {fontWeight: 'bold', textAlign: 'center', color: '#4338ca'},
  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 5,
  },
  colMaterial: {width: 200, paddingHorizontal: 2},
  colCategory: {width: 150, paddingHorizontal: 2},
  colSource: {width: 200, paddingHorizontal: 2},
  colUnit: {width: 100, paddingHorizontal: 2},
  colQty: {width: 120, paddingHorizontal: 2},
  colAction: {width: 60, justifyContent: 'center', alignItems: 'center'},
  addButton: {paddingVertical: 10, alignSelf: 'flex-start', marginTop: 10},
  addButtonText: {color: '#5A2AAF', fontWeight: 'bold', fontSize: 16},
  removeButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 20,
    padding: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {color: '#ef4444', fontWeight: 'bold', fontSize: 18},

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
    paddingRight: 70,
  },
  totalLabel: {fontSize: 16, fontWeight: 'bold', marginRight: 10},
});
