import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({label, value, onChange}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedTime = format(date, 'HH:mm');
    onChange(formattedTime);
    hideDatePicker();
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text style={styles.inputText}>
          {value || `Select ${label.toLowerCase()}`}
        </Text>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
  },
  inputText: {
    color: '#333',
  },
});

export default TimePicker;