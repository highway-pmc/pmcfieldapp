import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
// @ts-ignore
import styles from '../DynamicForm.styles';
import {InputComponentProps} from '../DynamicForm.types';

const TimePicker: React.FC<InputComponentProps> = ({
  input,
  value,
  onChange,
  error,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedTime = format(date, 'HH:mm');
    // Matches the signature used in your InputText: onChange(input, value)
    onChange(input, formattedTime);
    hideDatePicker();
  };

  return (
    <View key={`input-${input.id}`} style={styles.inputGridItem}>
      <Text style={styles.inputLabel}>{input.label}</Text>

      <TouchableOpacity
        onPress={showDatePicker}
        // Combined styles to match TextInput look exactly
        style={[
          styles.textInput,
          {justifyContent: 'center', paddingRight: 35}, // Ensure text aligns vertically & make room for icon
          error ? styles.inputErrorBorder : {},
        ]}>
        <Text style={{color: value ? '#000' : '#999'}}>
          {value || input.placeholder || 'Select Time'}
        </Text>

        <Image
          style={{
            width: 20,
            height: 20,
            position: 'absolute',
            right: 10,
            tintColor: '#666',
          }}
          source={require('../../../images/dashboard/manage-user-icon.png')}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="time"
        // Handle iOS specific display if needed, or default
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default TimePicker;
