import React, {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface DropdownPickerProps {
  label?: string;
  value: string;
  lableField?: string;
  valueField?: string;
  items: any[],
  isRequired?: boolean,
  style?: any,
  onChange: any;
}

const DropdownPicker: React.FC<DropdownPickerProps> = ({
  label,
  value,
  lableField = "label",
  valueField = "value",
  items,
  isRequired,
  style = {},
  onChange,
}) => {

  const [error, setError] = useState('');

  const handleBlur = () => {
    if (isRequired && !value) {
      setError(`${label} is required`);
    } else {
      setError('');
    }
  };

  
  return (
    <View style={label ? [styles.container, style] : {}}>
      {
        label && 
        <Text style={styles.label}>{label}</Text>
      }
      <View style={[styles.pickerContainer]}>
        <Picker
          selectedValue={value}
          style={styles.picker}
          onBlur={handleBlur}
          onValueChange={onChange}>
          {items.map((option, index) => (
              <Picker.Item key={index} label={option[lableField]} value={option[valueField]} />
          ))}
        </Picker>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  pickerContainer: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    height: 50
},
picker: {
  width: '100%',
},
error: {
  color: '#d9534f',
  marginTop: 5,
},
});

export default DropdownPicker;