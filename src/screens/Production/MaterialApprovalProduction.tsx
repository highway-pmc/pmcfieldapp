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
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {HeaderItems, MATERIAL_REQUEST_STATUS} from '../../constants/constants';
import DropdownPicker from '../../components/UI/DropdownPicker';
import DetailsCard from '../Common/DetailsCard'; // Make sure this path is correct
// import FilePickerComponent from '../../components/UI/FilePickerComponent'; // Placeholder for your file picker

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

interface DropdownOption {
  label: string;
  value: string;
}

type MaterialApprovalFormProps = {
  route: {params?: {status?: string}};
  navigation: any;
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

const mixDesignData: DropdownOption[] = [
  {label: 'Select Mix Design', value: ''},
  {label: 'M25-Grade Concrete', value: 'm25'},
  {label: 'M30-Grade Concrete', value: 'm30'},
  {label: 'M40-Grade Concrete', value: 'm40'},
];

// --- Component ---
const MaterialApprovalProductionForm: React.FC<MaterialApprovalFormProps> = ({
  route,
}) => {
  const {status} = route.params || {};
  const isFocused = useIsFocused();

  // Common State
  const [remarks, setRemarks] = useState<string>('');
  const [qtyApproved, setQtyApproved] = useState<string>(
    String(requestData.qtyApproved),
  );

  // Dispatch-specific State
  const [mixDesign, setMixDesign] = useState<string>('');
  const [qtyIssued, setQtyIssued] = useState<string>('');
  const [vehicleNumbers, setVehicleNumbers] = useState<string[]>([]);
  const [currentVehicleInput, setCurrentVehicleInput] = useState<string>('');
  const [batchNo, setBatchNo] = useState<string>('');
  const [dispatchTime, setDispatchTime] = useState<Date>(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  // const [batchSlip, setBatchSlip] = useState<any>(null); // State for the uploaded file

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

  // Read-only data for the top card
  const detailsData = useMemo(() => {
    const data = [
      {label: 'Work Category', value: requestData.workCategory},
      {label: 'Material Name', value: requestData.materialName},
      {label: 'Material Category', value: requestData.materialCategory},
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
      {label: 'Request Date & Time', value: requestData.requestDateTime},
    );
    return data;
  }, [status]);

  // --- Vehicle Handlers ---
  const handleVehicleInputChange = (text: string) => {
    setCurrentVehicleInput(text.replace(/[^0-9]/g, ''));
  };

  const addVehicle = () => {
    if (currentVehicleInput.length === 4) {
      if (!vehicleNumbers.includes(currentVehicleInput)) {
        setVehicleNumbers([...vehicleNumbers, currentVehicleInput]);
        setCurrentVehicleInput('');
      } else {
        Alert.alert(
          'Duplicate Entry',
          'This vehicle number has already been added.',
        );
      }
    } else {
      Alert.alert(
        'Invalid Input',
        'Please enter exactly 4 digits for the vehicle number.',
      );
    }
  };

  const removeVehicle = (index: number) => {
    setVehicleNumbers(vehicleNumbers.filter((_, i) => i !== index));
  };

  // --- DateTime Picker Handler ---
  const onDateTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dispatchTime;
    setShowDateTimePicker(Platform.OS === 'ios');
    setDispatchTime(currentDate);
  };

  // --- Form Submission ---
  const handleSubmit = () => {
    // Implement your validation and submission logic here based on status
    console.log({
      status,
      qtyApproved,
      remarks,
      mixDesign,
      qtyIssued,
      vehicleNumbers,
      batchNo,
      dispatchTime,
      // batchSlip
    });
    Alert.alert('Success', 'Form has been submitted successfully!');
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

        {/* --- APPROVAL FORM --- */}
        {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Qty Approved <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={qtyApproved}
                onChangeText={setQtyApproved}
                keyboardType="decimal-pad"
                placeholder="Enter approved quantity"
              />
              <Text style={styles.helperText}>
                Max: {requestData.qtyRequested} {requestData.unit}
              </Text>
            </View>
          </>
        )}

        {/* --- DISPATCH FORM --- */}
        {status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH && (
          <>
            <DropdownPicker
              label="Mix Design Details*"
              items={mixDesignData}
              value={mixDesign}
              onChange={setMixDesign}
            />
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Qty Issued <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={qtyIssued}
                onChangeText={setQtyIssued}
                keyboardType="decimal-pad"
                placeholder="e.g., 120.500"
              />
              <Text style={styles.helperText}>
                Max: {requestData.qtyApproved} {requestData.unit}
              </Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Vehicle 4 Digit No. <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.vehicleInputContainer}>
                <TextInput
                  style={[styles.input, {flex: 1}]}
                  value={currentVehicleInput}
                  onChangeText={handleVehicleInputChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="e.g., 1234"
                />
                <TouchableOpacity
                  onPress={addVehicle}
                  style={styles.addButton}
                  disabled={currentVehicleInput.length !== 4}>
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagContainer}>
                {vehicleNumbers.map((vehicle, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{vehicle}</Text>
                    <TouchableOpacity onPress={() => removeVehicle(index)}>
                      <Text style={styles.tagRemove}> ✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Batch No.</Text>
              <TextInput
                style={styles.input}
                value={batchNo}
                onChangeText={setBatchNo}
                maxLength={100}
                placeholder="Enter batch number"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Upload Batch Slip</Text>
              {/* <FilePickerComponent onFileSelect={setBatchSlip} /> */}
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Choose File</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Material Dispatch Time</Text>
              <TouchableOpacity onPress={() => setShowDateTimePicker(true)}>
                <TextInput
                  style={styles.input}
                  value={dispatchTime.toLocaleString('en-IN')}
                  editable={false}
                  placeholder="Select Date & Time"
                />
              </TouchableOpacity>
              {showDateTimePicker && (
                <DateTimePicker
                  value={dispatchTime}
                  mode="datetime"
                  display="default"
                  onChange={onDateTimeChange}
                />
              )}
            </View>
          </>
        )}

        {/* --- COMMON REMARKS FIELD --- */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks (if any)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter any remarks or notes..."
            multiline
            maxLength={500}
          />
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
    marginBottom: 16,
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
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  vehicleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#5A2AAF',
    paddingHorizontal: 20,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: '#e8deff',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  tagText: {
    color: '#5A2AAF',
    fontWeight: '500',
  },
  tagRemove: {
    color: '#5A2AAF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  uploadButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#5A2AAF',
    fontWeight: '500',
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
});

export default MaterialApprovalProductionForm;