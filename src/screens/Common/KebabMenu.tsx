import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';

const KebabMenu = (props: any) => {
    const [visible, setVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const kebabRef = useRef(null);
  
    const toggleMenu = () => {
      kebabRef.current?.measureInWindow((x, y, width, height) => {
        setMenuPosition({ x, y: y + height });
        setVisible(true);
      });
    };

  return (
    <View style={styles.itemContainer}>
    {/* <Text>{props.name}</Text> */}

    <TouchableOpacity ref={kebabRef} onPress={toggleMenu} style={styles.kebabIcon}>
      <Text style={styles.dot}>⋮</Text>
    </TouchableOpacity>

    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setVisible(false)}
      >
        <View style={[styles.menu, { top: menuPosition.y, left: menuPosition.x - 100 }]}>
          <Text style={styles.menuItem}>View</Text>
          <Text style={styles.menuItem}>Edit</Text>
          <Text style={styles.menuItem}>Delete</Text>
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
      width: 140,
    },
    menuItem: {
      paddingVertical: 8,
      fontSize: 16,
    },
  });
  
  
export default KebabMenu;