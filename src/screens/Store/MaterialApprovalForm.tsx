import {useIsFocused} from '@react-navigation/native';
import React, {useEffect} from 'react';
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

// In a real app, this data would come from the selected request
const requestData = {
  workCategory: 'Structural Steel',
  materialName: 'TMT Bars',
  materialCategory: 'Fe-500D',
  unit: 'Tonne',
  qtyRequested: 150.5,
  qtyApproved: 150, // This would come from the approval step
  taskPath: 'Project X / Tower A / Foundation / Raft',
  userName: 'Prakash Kumar (Site Engineer)',
  requestDateTime: '15/08/2025 10:30 AM',
};

export default function MaterialApprovalForm({route, navigation}: any) {
  const {status} = route.params || {};
  const [qtyIssued, setQtyIssued] = React.useState('');
  const [qtyApproved, setQtyApproved] = React.useState('150');
  const [remarks, setRemarks] = React.useState('');
  const focus = useIsFocused();
  useEffect(() => {
    if (focus == true) {
      console.log('Focus changed to Material Approval Form', status);
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit(
        'headerEvent',
        status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL
          ? HeaderItems.materialApprove
          : HeaderItems.materialDispatch,
      );
    }
  }, [focus]);
  const handleSubmit = () => {
    const issued = parseFloat(qtyIssued);
    if (isNaN(issued) || issued <= 0 || issued > 1000) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid issued quantity between 0 and 1000.',
      );
      return;
    }

    // Validate for up to 3 decimal places
    if (qtyIssued.includes('.') && qtyIssued.split('.')[1].length > 3) {
      Alert.alert(
        'Validation Error',
        'Issued quantity can have up to 3 decimal places.',
      );
      return;
    }

    const formData = {
      ...requestData,
      qtyIssued: issued,
      remarks,
      dispatchDateTime: new Date().toLocaleString('en-IN'),
    };

    console.log('Dispatch Form Submitted:', JSON.stringify(formData, null, 2));
    Alert.alert('Success', 'Material has been marked as issued!');
    // navigation.goBack(); // This would be handled by the parent component
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Work Category</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={requestData.workCategory}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Material Name</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={requestData.materialName}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Material Category</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={requestData.materialCategory}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Unit</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={requestData.unit}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Qty Requested</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={String(requestData.qtyRequested)}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Qty Approved</Text>
          <TextInput
            style={[
              styles.input,
              status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH
                ? styles.readOnlyInput
                : null,
            ]}
            value={String(qtyApproved)}
            editable={status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL}
          />
        </View>
        {status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Qty Issued*</Text>
            <TextInput
              style={styles.input}
              value={qtyIssued}
              onChangeText={setQtyIssued}
              keyboardType="decimal-pad"
              placeholder="Enter issued quantity"
            />
          </View>
        ) : null}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Details</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput, styles.textArea]}
            value={requestData.taskPath}
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
            value={requestData.userName}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Request Date and Time</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={requestData.requestDateTime}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL
              ? 'Approve Material'
              : ' Dispatch Material'}
          </Text>
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
