import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const CustomSelectDropdown = ({
  label,
  data,
  selectedValue,
  onSelect,
  itemTypeOf = 'object',
  valueField = '_id',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = item => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Dropdown Button */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.selectedText} numberOfLines={1}>
          {itemTypeOf === 'string'
            ? selectedValue || 'Select an option'
            : selectedValue?.name || 'Select an option'}
        </Text>
        <Image
          style={styles.CloseIcon}
          source={require('./../../images/right-arrow.png')}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {itemTypeOf === 'string' ? (
              <FlatList
                data={data}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => handleSelect(item)}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <FlatList
                data={data}
                keyExtractor={item => item[valueField]}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => handleSelect(item)}>
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  dropdownButton: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    color: '#2c2c2c',
    fontSize: 12,
    width: '93%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 14,
    color: '#000',
  },
  CloseIcon: {
    width: 28,
    height: 28,
    tintColor: '#999',
    transform: 'rotate(90deg)',
  },
});

export default CustomSelectDropdown;
