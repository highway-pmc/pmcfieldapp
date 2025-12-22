import React from 'react';
import {View, Text} from 'react-native';
// @ts-ignore
import styles from '../DynamicForm.styles';
import {InputComponentProps} from '../DynamicForm.types';

const DataCalculated: React.FC<InputComponentProps> = ({
  input,
  value,
  error,
}) => {
  // Logic: Check for null, undefined, or empty string
  const hasValue = value !== null && value !== undefined && value !== '';
  const displayValue = hasValue ? value.toString() : '—';

  return (
    <View key={`input-${input.id}`} style={styles.inputGridItem}>
      <Text style={styles.inputLabel}>{input.label}</Text>

      <View
        style={[
          styles.textInput,
          {
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            borderStyle: 'dashed',
            borderColor: '#ccc',
          },
          error ? styles.inputErrorBorder : {},
        ]}>
        <Text
          style={{
            fontSize: 16,
            color: hasValue ? '#333' : '#999',
            fontWeight: hasValue ? '600' : '400',
          }}>
          {displayValue}
        </Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default DataCalculated;
