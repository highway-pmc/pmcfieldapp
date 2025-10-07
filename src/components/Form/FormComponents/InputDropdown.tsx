import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';
// @ts-ignore
import styles from '../DynamicForm.styles';
import {InputComponentProps} from '../DynamicForm.types';

const DropdownInput: React.FC<InputComponentProps> = ({
  input,
  value,
  onChange,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption =
    input.validations.options?.find(opt => opt.key === value)?.label ||
    input.placeholder;

  const handleSelect = (optionKey: string) => {
    onChange(input, optionKey);
    setModalVisible(false);
  };

  return (
    <View style={styles.gridItem}>
      <Text style={styles.inputLabel}>{input.label}</Text>
      <TouchableOpacity
        style={[
          styles.textInput,
          styles.dropdownButton,
          error ? styles.inputErrorBorder : {},
        ]}
        onPress={() => setModalVisible(true)}>
        <Text
          style={value ? styles.dropdownValue : styles.dropdownPlaceholder}
          numberOfLines={1}>
          {selectedOption}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={input.validations.options || []}
              keyExtractor={item => item.key}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item.key)}>
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownInput;
