import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {HeaderItems} from '../../constants/constants';
import {useIsFocused} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddPurchase({navigation}) {
  const focus = useIsFocused();

  // Form state
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [rate, setRate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sample data for dropdowns
  const categories = [
    'Raw Materials',
    'Equipment',
    'Office Supplies',
    'Services',
  ];
  const materials = ['Steel', 'Plastic', 'Wood', 'Concrete', 'Glass'];

  useEffect(() => {
    if (focus) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.addPurchase);
    }
  }, [focus]);

  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || purchaseDate;
    setShowDatePicker(Platform.OS === 'ios');
    setPurchaseDate(currentDate);
  };

  const handleSubmit = () => {
    // Implement your submit logic here
    console.log({
      category,
      material,
      purchaseDate,
      rate,
      invoiceNumber,
    });
    alert('Form submitted!');
  };

  const renderDropdown = (items, value, onChange, placeholder) => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() =>
            setShowDropdown(showDropdown === placeholder ? null : placeholder)
          }>
          <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

        {showDropdown === placeholder && (
          <View style={styles.dropdownMenu}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  onChange(item);
                  setShowDropdown(null);
                }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          {renderDropdown(categories, category, setCategory, 'Select Category')}
        </View> */}

        {/* <View style={styles.formGroup}>
          <Text style={styles.label}>Material</Text>
          {renderDropdown(materials, material, setMaterial, 'Select Material')}
        </View> */}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Purchase Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}>
            <Text>{formatDate(purchaseDate)}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={purchaseDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rate per unit (Without GST)</Text>
          <TextInput
            style={styles.input}
            value={rate}
            onChangeText={setRate}
            keyboardType="numeric"
            placeholder="Enter rate"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Invoice number</Text>
          <TextInput
            style={styles.input}
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="Enter invoice number"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload Invoice</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Invoice</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload Invoice</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>
              Upload MTC's as applicable
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 38,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  dropdownText: {
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 14,
    color: '#555',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    zIndex: 2,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  calendarIcon: {
    fontSize: 16,
  },
  uploadButton: {
    height: 46,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5A2AAF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  uploadButtonText: {
    color: '#666',
  },
  submitButton: {
    height: 48,
    backgroundColor: '#6a5acd',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
