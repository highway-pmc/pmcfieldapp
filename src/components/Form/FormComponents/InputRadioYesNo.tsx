import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
// @ts-ignore
import styles from '../DynamicForm.styles';
import {InputComponentProps} from '../DynamicForm.types';

const YES_NO_OPTIONS = [
  {key: 'Yes', label: 'Yes', color: '#52b552'},
  {key: 'NO', label: 'NO', color: '#dc3545'},
  {key: 'NA', label: 'NA', color: '#6c757d'},
];

const YesNoRadioInput: React.FC<InputComponentProps> = ({
  input,
  value,
  onChange,
  error,
}) => {
  const handlePress = (optionKey: string) => {
    onChange(input, optionKey);
  };

  return (
    <View
      style={[
        styles.radioComponentContainer,
        error ? styles.radioErrorOuterBorder : {},
      ]}>
      <View style={styles.radioLabelWrapper}>
        <Text style={styles.inputLabel}>{input.label}</Text>
      </View>

      <View style={styles.radioGroupRow}>
        {YES_NO_OPTIONS.map((option, index) => {
          const isSelected = value === option.key;

          const buttonStyle = [
            styles.radioButton,
            isSelected
              ? {backgroundColor: option.color, borderColor: option.color}
              : styles.unselectedRadioButton,
            index > 0 && {marginLeft: 6},
          ];

          const textStyle = isSelected
            ? styles.radioTextSelected
            : styles.radioTextUnselected;

          return (
            <TouchableOpacity
              key={option.key}
              style={buttonStyle}
              onPress={() => handlePress(option.key)}>
              <Text style={textStyle}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default YesNoRadioInput;
