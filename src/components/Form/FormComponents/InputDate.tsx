import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {format} from 'date-fns';
import {InputComponentProps} from '../DynamicForm.types';
// @ts-ignore
import formStyles from '../DynamicForm.styles';

const InputDate: React.FC<InputComponentProps> = ({
  input,
  value,
  onChange,
  error,
}) => {
  const [show, setShow] = useState(false);
  const dateValue = value || '';

  const onDayPress = (day: any) => {
    setShow(false);
    // Format date to 'dd/MM/yyyy' as per your original logic
    const formattedDate = format(new Date(day.dateString), 'dd/MM/yyyy');
    // Call the form-wide onChange with the input object
    onChange(input, formattedDate);
  };

  // Convert 'dd/MM/yyyy' back to 'YYYY-MM-DD' for react-native-calendars
  const selectedDateKey = dateValue
    ? dateValue.split('/').reverse().join('-')
    : undefined;

  return (
    <View key={`input-${input.id}`} style={formStyles.inputGridItem}>
      <Text style={formStyles.inputLabel}>{input.label}</Text>

      <TouchableOpacity
        style={[
          formStyles.textInput, // Use textInput style for the button appearance
          error ? formStyles.inputErrorBorder : {},
          // Override height if necessary, but textInput is 40px
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 40, // Make space for the icon
          },
        ]}
        onPress={() => setShow(true)}>
        {dateValue ? (
          <Text style={formStyles.dateInputText}>{dateValue}</Text>
        ) : (
          <Text style={formStyles.datePlaceholderText}>
            {input.placeholder || `Select ${input.label}`}
          </Text>
        )}

        <Image
          style={formStyles.CalendarIcon}
          source={require('./../../../images/common/calenderIcon.png')}
        />
      </TouchableOpacity>
      {error && <Text style={formStyles.errorText}>{error}</Text>}

      {/* Modal is still rendered for the Calendar */}
      {show && (
        <Modal transparent={true} animationType="slide" visible={show}>
          <View style={formStyles.modalContainer}>
            <View style={formStyles.calendarContainer}>
              <Calendar
                onDayPress={onDayPress}
                markedDates={{
                  [selectedDateKey || '']: {
                    selected: true,
                    selectedColor: '#007BFF', // Blue color for selected date
                  },
                }}
              />
              <TouchableOpacity
                style={formStyles.closeButton}
                onPress={() => setShow(false)}>
                <Text style={formStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default InputDate;
