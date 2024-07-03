// Input.js
import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const Input = ({
  label,
  value,
  onChange,
  isReadOnly = false,
  isRequired = false,
  style = {},
  ...props
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
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, isReadOnly && styles.readOnly]}
        value={value}
        onChangeText={onChange}
        onBlur={handleBlur}
        editable={!isReadOnly}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  readOnly: {
    backgroundColor: '#f5f5f5',
  },
  error: {
    color: '#d9534f',
    marginTop: 5,
  },
});

export default Input;
