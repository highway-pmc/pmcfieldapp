import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface MultiSelectDropdownProps {
  options: string[];
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown = ({
  options,
  selectedItems,
  onSelectionChange,
  placeholder = "Select items"
}: MultiSelectDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleSelection = (item: string) => {
    const isSelected = selectedItems.includes(item);
    const newSelection = isSelected
      ? selectedItems.filter((selected) => selected !== item)
      : [...selectedItems, item];
    onSelectionChange(newSelection);
  };

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = selectedItems.includes(item);
    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => toggleSelection(item)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {selectedItems.length > 0
            ? `${selectedItems.length} selected`
            : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {selectedItems.length > 0 && (
        <ScrollView horizontal style={styles.selectedContainer} showsHorizontalScrollIndicator={false}>
          {selectedItems.map((item, index) => (
            <View key={index} style={styles.selectedItem}>
              <Text style={styles.selectedText}>{item}</Text>
              <TouchableOpacity onPress={() => toggleSelection(item)}>
                <Text style={styles.removeButton}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Options</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.closeButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MultiSelectDropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 12,
    color: '#2c2c2c',
    position: 'relative',
    height: 42,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 12,
    color: '#666',
  },
  arrow: {
    fontSize: 11,
    color: '#666',
  },
  selectedContainer: {
    marginTop: 8,
    maxHeight: 100,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 40,
    paddingVertical: 1,
    paddingHorizontal: 12,
    paddingBottom: 2,
    marginRight: 8,
  },
  selectedText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 4,
  },
  removeButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  app: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
  },
});