import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {format} from 'date-fns';

interface CalendarPickerProps {
  label: string;
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
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text style={styles.inputText}>
          {value || `Select ${label.toLowerCase()}`}
        </Text>
      </TouchableOpacity>
      {show && (
        <Modal transparent={true} animationType="slide" visible={show}>
          <View style={styles.modalContainer}>
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={onDayPress}
                markedDates={{
                  [value.split('/').reverse().join('-')]: {
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