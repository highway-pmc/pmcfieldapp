import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';

interface TimePickerProps {
  label: string;
  value: string;
  style?: any;
  styleCont?: any;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({label, value, style, styleCont, onChange}) => {
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
    <View style={[styles.inputContainer, styleCont]}>
      <Text style={[styles.label, style]}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text style={styles.inputText}>
          {value || `Select ${label.toLowerCase()}`}
        </Text>
        <Image style={styles.CalendarIcon} source={require('./../../images/timing.png')} />
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
  CalendarIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 15,
    top: 10
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%'
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    fontSize: 12,
    color: '#2c2c2c',
    position: 'relative',
    height: 44
  },
  inputText: {
    color: '#2c2c2c',
    fontSize: 12,
  },
});

export default TimePicker;