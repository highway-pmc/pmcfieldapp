import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  NativeEventEmitter,
  Modal,
  FlatList,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { HeaderItems } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../../context/SnackbarContext";
import { postVendorForm, putVendorForm } from "../ManageUsers/actions";

const AddVendorForm = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { postVendorFormData, loading: any, error } = useSelector(
    (state) => state.VendorForm
  );

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit("headerEvent", HeaderItems.addVendorForm);
    }
  }, [isFocused]);

  useEffect(() => {
    if (postVendorFormData) {
      showSnackbar("Source status updated successfully", "success");
      handleCancel();
    } else if (error) {
      showSnackbar(error, "error");
    }
  }, [postVendorFormData, error]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({
    state: false,
    district: false,
  });

  const stateDistricts = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
    Punjab: ["Mohali", "Ludhiana", "Amritsar", "Jalandhar"],
    Delhi: ["New Delhi", "North Delhi", "South Delhi", "East Delhi"],
  };

  // Prefill formData if editing
  useEffect(() => {
    if (route?.params?.vendorData) {
      setFormData({
        name: route.params.vendorData.name || "",
        email: route.params.vendorData.email || "",
        phone: route.params.vendorData.phone || "",
        address: route.params.vendorData.address || "",
        district: route.params.vendorData.district || "",
        state: route.params.vendorData.state || "",
      });
    }
  }, [route?.params?.vendorData]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "state" ? { district: "" } : {}),
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const toggleDropdown = (field) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const selectDropdownItem = (field, value) => {
    handleInputChange(field, value);
    setDropdownVisible((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    if (route?.params?.vendorData) {
        console.log("Form Data Submitted: ", route?.params?.vendorData);
        dispatch(putVendorForm({ id: route?.params?.vendorData._id, body: formData }));
        navigation.navigate('VendorFormLists');
    } else {
        dispatch(postVendorForm({ body: formData }));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      district: "",
      state: "",
    });
    setErrors({});
  };

  const renderInput = (field, label, placeholder, keyboardType = "default", multiline = false, required = true) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        autoCapitalize={field === "email" ? "none" : "words"}
        autoCorrect={false}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderDropdown = (field, label, placeholder, options, required = true) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity style={[styles.dropdownButton, errors[field] && styles.inputError]} onPress={() => toggleDropdown(field)}>
        <Text style={[styles.dropdownText, !formData[field] && styles.placeholderText]}>
          {formData[field] || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={dropdownVisible[field]} transparent={true} animationType="fade" onRequestClose={() => toggleDropdown(field)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => toggleDropdown(field)}>
          <View style={styles.dropdownModal}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dropdownItem} onPress={() => selectDropdownItem(field, item)}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const getDistrictOptions = () => {
    return formData.state ? stateDistricts[formData.state] || [] : [];
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{route?.params?.vendorData ? "Edit Vendor" : "Add Vendor Form"}</Text>
          <Text style={styles.subtitle}>Fill in the Vendor details below</Text>
        </View>

        <View style={styles.form}>
          {renderInput("name", "Vendor Name", "Enter vendor name")}
          {renderInput("email", "Email Address", "Enter email address", "email-address")}
          {renderInput("phone", "Phone Number", "Enter 10-digit phone number", "phone-pad")}
          {renderInput("address", "Address", "Enter complete address", "default", true)}
          {renderDropdown("state", "State", "Select State", Object.keys(stateDistricts))}
          {renderDropdown("district", "District", "Select District", getDistrictOptions())}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel} disabled={loading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.submitButton, loading && styles.disabledButton]} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? "Saving..." : route?.params?.vendorData ? "Update Vendor" : "Add Vendor"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500'
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    fontSize: 12,
    color: '#2c2c2c',
    position: 'relative',
    height: 42,
    paddingHorizontal: 10,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 11,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 12,
    color: '#2c3e50',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 300,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    borderWidth: 1,
    borderColor: '#7f8c8d',
  },
  submitButton: {
    backgroundColor: '#3498db',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddVendorForm;