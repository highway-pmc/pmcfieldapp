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
  cssStyle?: any;
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
  cssStyle
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
    // <View style={label ? [styles.container, style] : {}}></View>
    <View style={[styles.container, style]}>
      {
        label && 
        <Text style={[styles.label, cssStyle]}>{label}</Text>
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
    width: '100%',
    marginBottom: 15,
    fontSize: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    fontSize: 12,
    color: '#2c2c2c',
    position: 'relative',
    height: 44
},
picker: {
  width: '100%',
  color: '#2c2c2c',
  fontSize: 12,
},
error: {
  color: '#d9534f',
  marginTop: 5,
},
});

export default DropdownPicker;