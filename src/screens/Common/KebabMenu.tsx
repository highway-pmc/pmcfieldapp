import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';

const KebabMenu = ({
  onView,
  onEdit,
  onDelete,
  onAdd,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
  const kebabRef = useRef(null);

  const toggleMenu = () => {
    kebabRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({x, y: y + height});
      setVisible(true);
    });
  };

  const handlePress = (callback: () => void) => {
    setVisible(false);
    callback();
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        ref={kebabRef}
        onPress={toggleMenu}
        style={styles.kebabIcon}>
        <Text style={styles.dot}>⋮</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}>
          <View
            style={[
              styles.menu,
              {top: menuPosition.y, left: menuPosition.x - 100},
            ]}>
            {onAdd && (
              <Text
                style={[styles.menuItem, {borderBottomWidth: 1}]}
                onPress={() => handlePress(onAdd)}>
                Add
              </Text>
            )}
            {onView && (
              <Text
                style={[styles.menuItem, {borderBottomWidth: 1}]}
                onPress={() => handlePress(onView)}>
                View
              </Text>
            )}
            {onEdit && (
              <Text
                style={[styles.menuItem, {borderBottomWidth: 1}]}
                onPress={() => handlePress(onEdit)}>
                Edit
              </Text>
            )}
            {onDelete && (
              <Text
                style={styles.menuItem}
                onPress={() => handlePress(onDelete)}>
                Delete
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 3,
    paddingHorizontal: 10,
  },
  kebabIcon: {
    padding: 5,
  },
  dot: {
    fontSize: 22,
    color: '#333',
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    elevation: 5,
    width: 120,
  },
  menuItem: {
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    
  },
});

export default KebabMenu;
