import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, Image} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {format} from 'date-fns';

interface CalendarPickerProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [show, setShow] = useState(false);

  const onDayPress = (day: any) => {
    setShow(false);
    const formattedDate = format(new Date(day.dateString), 'dd/MM/yyyy');
    onChange(formattedDate);
  };

  return (
    <View style={label ? [styles.inputContainer] : {}}>
      {
        label && 
        <Text style={styles.label}>{label}</Text>
      }
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text style={styles.inputText}>
          {value || `Select ${label?.toLowerCase() || 'Date'}`}
        </Text>
        <Image style={styles.CalendarIcon} source={require('./../../images/date-icon.png')} />
      </TouchableOpacity>
      {show && (
        <Modal transparent={true} animationType="slide" visible={show}>
          <View style={styles.modalContainer}>
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={onDayPress}
                markedDates={{
                  [value?.split('/').reverse().join('-')]: {
                    selected: true,
                    selectedColor: '#007BFF',
                  },
                }}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShow(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500'
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
    paddingRight: 32,
  },
  inputText: {
    color: '#2c2c2c',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 10,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CalendarPicker;