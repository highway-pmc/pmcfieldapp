import React from 'react';
import {View, Text, TextInput} from 'react-native';
// @ts-ignore
import styles from '../DynamicForm.styles';
import {InputComponentProps} from '../DynamicForm.types';

const InputText: React.FC<InputComponentProps> = ({
  input,
  value,
  onChange,
  error,
}) => {
  return (
    <View key={`input-${input.id}`} style={styles.gridItem}>
      <Text style={styles.inputLabel}>{input.label}</Text>
      <TextInput
        style={[styles.textInput, error ? styles.inputErrorBorder : {}]}
        placeholder={input.placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={text => onChange(input, text)}
        keyboardType={input.type === 'number' ? 'numeric' : 'default'}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default InputText;
