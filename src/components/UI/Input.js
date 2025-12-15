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
  marginBottom = true,
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
    <View style={[marginBottom && styles.container, style]}>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    fontSize: 12,
    color: '#2c2c2c',
    position: 'relative',
    height: 44,
    paddingHorizontal: 15,
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
