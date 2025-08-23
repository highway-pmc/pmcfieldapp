// src/screens/MaterialApprovalForm.tsx

import {useIsFocused} from '@react-navigation/native';
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
import {HeaderItems, MATERIAL_REQUEST_STATUS} from '../../constants/constants';
import DropdownPicker from '../../components/UI/DropdownPicker';
import DetailsCard from '../Common/DetailsCard';

// --- Type Definitions ---

interface RequestData {
  workCategory: string;
  materialName: string;
  materialCategory: string;
  unit: string;
  qtyRequested: number;
  qtyApproved: number;
  taskPath: string;
  userName: string;
  requestDateTime: string;
}

interface SourceOption {
  label: string;
  value: string;
}

interface DispatchSource {
  id: number;
  source: string;
  quantity: string;
}

// Assuming React Navigation types
type MaterialApprovalFormProps = {
  route: {params?: {status?: string}};
  navigation: any; // Replace 'any' with your actual navigation type for better safety
};

// --- Mock Data ---

const requestData: RequestData = {
  workCategory: 'Structural Steel',
  materialName: 'TMT Bars',
  materialCategory: 'Fe-500D',
  unit: 'Tonne',
  qtyRequested: 150.5,
  qtyApproved: 150,
  taskPath: 'Project X / Tower A / Foundation / Raft',
  userName: 'Prakash Kumar (Site Engineer)',
  requestDateTime: '15/08/2025 10:30 AM',
};

const sourcesData: SourceOption[] = [
  {label: 'Select Source', value: ''},
  {label: 'Main Warehouse', value: 'main_warehouse'},
  {label: 'Site Storage A', value: 'site_storage_a'},
  {label: 'Vendor Direct Supply', value: 'vendor_direct'},
  {label: 'Local Purchase', value: 'local_purchase'},
];

// --- Component ---

const MaterialApprovalForm: React.FC<MaterialApprovalFormProps> = ({route}) => {
  const {status} = route.params || {};
  const [qtyIssued, setQtyIssued] = useState<string>('');
  const [qtyApproved, setQtyApproved] = useState<string>(
    String(requestData.qtyApproved),
  );
  const [remarks, setRemarks] = useState<string>('');
  const [dispatchSources, setDispatchSources] = useState<DispatchSource[]>([
    {id: 1, source: '', quantity: ''},
  ]);
  const [nextId, setNextId] = useState<number>(2);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit(
        'headerEvent',
        status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL
          ? HeaderItems.materialApprove
          : HeaderItems.materialDispatch,
      );
    }
  }, [isFocused, status]);

  const detailsData = useMemo(() => {
    const data = [
      {label: 'Material Name', value: requestData.materialName},
      {label: 'Category', value: requestData.materialCategory},
      {label: 'Work Category', value: requestData.workCategory},
      {label: 'Unit', value: requestData.unit},
      {
        label: 'Qty Requested',
        value: `${requestData.qtyRequested} ${requestData.unit}`,
      },
    ];
    if (status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH) {
      data.push({
        label: 'Qty Approved',
        value: `${requestData.qtyApproved} ${requestData.unit}`,
      });
    }
    data.push({type: 'divider' as const});
    data.push(
      {label: 'Task Details', value: requestData.taskPath},
      {label: 'Requested by', value: requestData.userName},
      {label: 'Request Date', value: requestData.requestDateTime},
    );
    return data;
  }, [status]);

  const handleSourceChange = (value: string, id: number) => {
    const newSources = dispatchSources.map(item =>
      item.id === id ? {...item, source: value} : item,
    );
    setDispatchSources(newSources);
  };

  const handleQuantityChange = (text: string, id: number) => {
    const newSources = dispatchSources.map(item =>
      item.id === id ? {...item, quantity: text.replace(/[^0-9.]/g, '')} : item,
    );
    setDispatchSources(newSources);
  };

  const handleAddSourceRow = () => {
    setDispatchSources(prev => [
      ...prev,
      {id: nextId, source: '', quantity: ''},
    ]);
    setNextId(prev => prev + 1);
  };

  const handleRemoveSourceRow = (id: number) => {
    if (dispatchSources.length > 1) {
      setDispatchSources(prev => prev.filter(item => item.id !== id));
    }
  };

  const totalSourceQuantity = useMemo(() => {
    return dispatchSources.reduce(
      (total, row) => total + (parseFloat(row.quantity) || 0),
      0,
    );
  }, [dispatchSources]);

  const handleSubmit = () => {
    // ... (Your existing validation and submission logic remains the same)
    Alert.alert('Success', 'Form has been submitted successfully!');
  };

  const getAvailableSources = (currentRowId: number): SourceOption[] => {
    const selectedSources = dispatchSources
      .filter(row => row.id !== currentRowId && row.source)
      .map(row => row.source);
    return sourcesData.filter(opt => !selectedSources.includes(opt.value));
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <DetailsCard title="Material Request Details" data={detailsData} />

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>
          {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL
            ? 'Approval Details'
            : 'Dispatch Details'}
        </Text>

        {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL && (
          <View style={styles.formGroup}>
            {/* ... Approval Section JSX ... */}
            <Text style={styles.label}>
              Total Qty Approve <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={qtyApproved}
              onChangeText={setQtyApproved}
              keyboardType="decimal-pad"
              placeholder="Enter total issued quantity"
            />
            <Text style={styles.helperText}>
              Maximum: {requestData.qtyRequested} {requestData.unit} (Requested
              quantity)
            </Text>
          </View>
        )}

        {status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Total Qty Issued <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={qtyIssued}
                onChangeText={setQtyIssued}
                keyboardType="decimal-pad"
                placeholder="Enter total issued quantity"
              />
              <Text style={styles.helperText}>
                Maximum: {requestData.qtyApproved} {requestData.unit} (Approved
                quantity)
              </Text>
            </View>

            <View style={styles.sourceTableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, {flex: 2}]}>Source</Text>
                <Text style={[styles.tableHeaderText, {flex: 1.2}]}>
                  Quantity
                </Text>
                <View style={{width: 30}} />
              </View>

              {dispatchSources.map(row => (
                <View key={row.id} style={styles.tableRow}>
                  <View style={{flex: 2, marginRight: 8}}>
                    <DropdownPicker
                      items={getAvailableSources(row.id)}
                      value={row.source}
                      onChange={(value: any) =>
                        handleSourceChange(value, row.id)
                      }
                    />
                  </View>
                  <TextInput
                    style={[styles.input, {flex: 1.2, height: 42}]}
                    value={row.quantity}
                    onChangeText={text => handleQuantityChange(text, row.id)}
                    keyboardType="decimal-pad"
                    placeholder="Qty"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveSourceRow(row.id)}
                    style={styles.removeButton}
                    disabled={dispatchSources.length === 1}>
                    <Text
                      style={[
                        styles.removeButtonText,
                        dispatchSources.length === 1 && {color: '#ccc'},
                      ]}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                onPress={handleAddSourceRow}
                style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Source</Text>
              </TouchableOpacity>

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Sum of Source Qty:</Text>
                <Text
                  style={[
                    styles.totalValue,
                    totalSourceQuantity > parseFloat(qtyIssued) &&
                      styles.errorText,
                  ]}>
                  {totalSourceQuantity}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter any remarks or notes..."
            multiline
            maxLength={500}
          />
          <Text style={styles.helperText}>{remarks.length}/500 characters</Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL
              ? 'Approve Material'
              : 'Dispatch Material'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#5A2AAF',
    paddingBottom: 8,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  submitButton: {
    height: 52,
    backgroundColor: '#5A2AAF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sourceTableContainer: {
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  removeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#e74c3c',
  },
  addButton: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#5A2AAF',
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    marginRight: 10,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontWeight: 'bold',
    color: 'green',
  },
  errorText: {
    color: '#e74c3c',
  },
});

export default MaterialApprovalForm;
