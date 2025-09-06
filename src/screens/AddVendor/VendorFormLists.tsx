import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
  NativeEventEmitter,
  Modal,
} from 'react-native';
import { useSnackbar } from '../../context/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderItems } from '../../constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import { deleteVendorForm, getVendorForm } from '../ManageUsers/actions';

const { width } = Dimensions.get('window');

const VendorFormLists = ({route, navigation}: {route: any; navigation: any;}) => {
    const isFocused = useIsFocused();
    const {showSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const {
            getVendorFormData,
            putVendorFormData,
            deleteVendorFormData,
            loading: any,
            error,
          } = useSelector((state: any) => state.VendorForm);

    useEffect(() => {
        if (isFocused) {
          const eventEmitter = new NativeEventEmitter();
          eventEmitter.emit('headerEvent', HeaderItems.vendorFormLists);
        }
      }, [isFocused]);

      useEffect(() => {
          dispatch(getVendorForm());
          if (putVendorFormData || getVendorFormData || deleteVendorFormData) {
            return
          }
          }, [putVendorFormData, getVendorFormData, deleteVendorFormData, error]);

  // Mapping for fields
  const fieldMapping = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    district: "District",
    state: "State",
    country: "Country",
    isActive: "Active",
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handle menu actions
  const handleMenuAction = (type: any) => {
    console.log(`${type} vendor:`, selectedVendor);
    if (type === 'edit') {
        navigation.navigate('AddVendorForm', {
           vendorData: selectedVendor 
        });
    } else if (type === 'delete') {
          Alert.alert(
                'Delete Source',
                'Are you sure you want to delete this Vendor?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: () => {
                      dispatch(
                        deleteVendorForm({
                          id: selectedVendor._id || '',
                        }),
                      );
                    },
                    style: 'destructive',
                  },
                ],
              );
              setMenuVisible(false);
          return
        }
    setMenuVisible(false);
  };

  // Render vendor card
  const renderVendor = ({ item }) => (
    <LinearGradient
      colors={["#FFFFFF", "#E0E7FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.requestCard}
    >
      {/* Kebab Menu */}
      <TouchableOpacity
        style={styles.kebabButton}
        onPress={() => {
          setSelectedVendor(item);
          setMenuVisible(true);
        }}
      >
        <Text style={styles.kebabDots}>⋮</Text>
      </TouchableOpacity>

      <View style={styles.cardContentWrapper}>
        <View style={styles.cardContent}>
          {Object.entries(fieldMapping).map(([key, label]) => {
            if (item[key] === undefined || item[key] === null) return null;
            return (
              <Text key={key} style={styles.workCategory}>
                {label}:
                <Text style={styles.categoryValue}>
                  {" "}
                  {label === "Active" ? (item[key] ? "Yes" : "No") : String(item[key])}
                </Text>
              </Text>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.cardFooter}>
          {item.createdAt && (
            <Text style={styles.workCategory}>
              Created At:
              <Text style={styles.categoryValue}> {formatDate(item.createdAt)}</Text>
            </Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
        <View style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 15}}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {navigation.navigate('AddVendorForm')}}>
                <Text style={styles.addButtonText}>+ Add New Vendor</Text>
            </TouchableOpacity>
        </View>
      {/* Vendor List */}
      <FlatList
        data={getVendorFormData}
        keyExtractor={(item) => item._id}
        renderItem={renderVendor}
      />

      {/* Kebab Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction("view")}>
              <Text style={styles.menuItemText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction("edit")}>
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction("delete")}>
              <Text style={[styles.menuItemText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
  },
  addButtonText: {
    color: '#4E36A3',
    fontWeight: 'bold',
  },
  requestCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    padding: 15,
    position: "relative",
    elevation: 3,
  },
  kebabButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 2,
  },
  kebabDots: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardContentWrapper: {
    marginTop: 10,
  },
  cardContent: {
    marginBottom: 8,
  },
  workCategory: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  categoryValue: {
    fontWeight: "400",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    width: 180,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default VendorFormLists;