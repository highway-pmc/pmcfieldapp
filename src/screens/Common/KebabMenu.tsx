import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Image} from 'react-native-elements';

const KebabMenu = ({
  onView,
  onEdit,
  onDelete,
  onAdd,
  onAccept,
  onReject,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  onReject?: () => void;
  onAccept?: () => void;
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
              <TouchableOpacity onPress={() => handlePress(onAdd)}>
                <View style={styles.menuItem}>
                  <Image
                    source={require('../../images/menuaction/add.png')}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Add</Text>
                </View>
              </TouchableOpacity>
            )}
            {onView && (
              <TouchableOpacity onPress={() => handlePress(onView)}>
                <View style={styles.menuItem}>
                  <Image
                    source={require('../../images/menuaction/edit.png')}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>View</Text>
                </View>
              </TouchableOpacity>
            )}
            {onEdit && (
              <TouchableOpacity onPress={() => handlePress(onEdit)}>
                <View style={styles.menuItem}>
                  <Image
                    source={require('../../images/menuaction/edit.png')}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Edit</Text>
                </View>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={() => handlePress(onDelete)}>
                <View style={styles.menuItem}>
                  <Image
                    source={require('../../images/menuaction/delete.png')}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Delete</Text>
                </View>
              </TouchableOpacity>
            )}
            {onAccept && (
              <TouchableOpacity onPress={() => handlePress(onAccept)}>
                <View style={styles.menuItem}>
                  <Image
                    source={require('../../images/menuaction/delete.png')}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Accept</Text>
                </View>
              </TouchableOpacity>
            )}
            {onReject && (
              <TouchableOpacity onPress={() => handlePress(onReject)}>
                <View style={styles.menuItem}>
                  <Image
                    source={require('../../images/menuaction/delete.png')}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Reject</Text>
                </View>
              </TouchableOpacity>
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
    width: 150,
  },
  menuItem: {
    paddingVertical: 8,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default KebabMenu;
