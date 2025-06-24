import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import KebabMenu from '../Common/KebabMenu';

export default function ProductionSummary() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      module: 'Project Module/ Segment/ Component',
      materialType: 'PCC',
      materialCategory: 'M20',
      totalQtyProduced: 100,
      status: 'pending',
      projectDescription: 'Project',
      contractorName: 'ProCraft Builders',
      plantDetails: 'Detail from equipment',
      mixDesignCategory: 'Concrete (Structure)',
      mixDesignDetails:
        'selecting and proportioning ingredients to achieve desired properties',
      workDescription: 'Module/ Segment/ Component/ Sub component',
      concreteOrderedBy: 'User who ordered concrete from Mobile app',
      concreteOrderedTime: 'Automatic from System',
      gradeRequested: 'Grade of Concrete from Web App',
      totalQtyRequired: 'Details of Concrete qty required in Cum from Web App',
      vehicleDigitNo: '4 digit Integer',
      concreteDispatchTime: 'To be entered (from Clock)',
      batchNo: 'Char, Max 100',
    },
    {
      id: 2,
      module: 'Project Module/ Foundation/ Base',
      materialType: 'RCC',
      materialCategory: 'M25',
      totalQtyProduced: 150,
      status: 'pending',
      projectDescription: 'Project',
      contractorName: 'ProCraft Builders',
      plantDetails: 'Detail from equipment',
      mixDesignCategory: 'Concrete (Structure)',
      mixDesignDetails:
        'selecting and proportioning ingredients to achieve desired properties',
      workDescription: 'Module/ Foundation/ Base',
      concreteOrderedBy: 'User who ordered concrete from Mobile app',
      concreteOrderedTime: 'Automatic from System',
      gradeRequested: 'Grade of Concrete from Web App',
      totalQtyRequired: 'Details of Concrete qty required in Cum from Web App',
      vehicleDigitNo: '4 digit Integer',
      concreteDispatchTime: 'To be entered (from Clock)',
      batchNo: 'Char, Max 100',
    },
    {
      id: 3,
      module: 'Project Module/ Structure/ Column',
      materialType: 'PCC',
      materialCategory: 'M30',
      totalQtyProduced: 75,
      status: 'pending',
      projectDescription: 'Project',
      contractorName: 'ProCraft Builders',
      plantDetails: 'Detail from equipment',
      mixDesignCategory: 'Concrete (Structure)',
      mixDesignDetails:
        'selecting and proportioning ingredients to achieve desired properties',
      workDescription: 'Module/ Structure/ Column',
      concreteOrderedBy: 'User who ordered concrete from Mobile app',
      concreteOrderedTime: 'Automatic from System',
      gradeRequested: 'Grade of Concrete from Web App',
      totalQtyRequired: 'Details of Concrete qty required in Cum from Web App',
      vehicleDigitNo: '4 digit Integer',
      concreteDispatchTime: 'To be entered (from Clock)',
      batchNo: 'Char, Max 100',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (orderId:any) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setFormData({
      mixDesignCategory: order.mixDesignCategory,
      materialType: order.materialType,
      materialCategory: order.materialCategory,
      mixDesignDetails: order.mixDesignDetails,
      workDescription: order.workDescription,
      totalQtyProduced: order.totalQtyProduced.toString(),
      vehicleDigitNo: order.vehicleDigitNo,
      concreteDispatchTime: order.concreteDispatchTime,
      batchNo: order.batchNo,
    });
    setModalVisible(true);
  };

  const handleView = orderId => {
    Alert.alert('Reject Order', 'Are you sure you want to reject this order?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId ? {...order, status: 'rejected'} : order,
            ),
          );
          Alert.alert('Success', 'Order rejected successfully!');
        },
      },
    ]);
  };

  const handleSaveForm = () => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id
          ? {
              ...order,
              mixDesignCategory: formData.mixDesignCategory,
              materialType: formData.materialType,
              materialCategory: formData.materialCategory,
              mixDesignDetails: formData.mixDesignDetails,
              workDescription: formData.workDescription,
              totalQtyProduced: parseInt(formData.totalQtyProduced),
              vehicleDigitNo: formData.vehicleDigitNo,
              concreteDispatchTime: formData.concreteDispatchTime,
              batchNo: formData.batchNo,
              status: 'accepted',
            }
          : order,
      ),
    );
    setModalVisible(false);
    Alert.alert('Success', 'Order updated successfully!');
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
    setFormData({});
  };

  const renderDropdown = (value, placeholder, isReadOnly = false) => (
    <View style={[styles.inputContainer, isReadOnly && styles.readOnlyInput]}>
      <Text style={[styles.inputText, isReadOnly && styles.readOnlyText]}>
        {value || placeholder}
      </Text>
      {!isReadOnly && <Text style={styles.dropdownArrow}>▼</Text>}
    </View>
  );

  const renderTextInput = (
    value,
    placeholder,
    onChangeText,
    isReadOnly = false,
  ) => (
    <TextInput
      style={[
        styles.textInput,
        isReadOnly && styles.readOnlyInput,
        isReadOnly && styles.readOnlyText,
      ]}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      editable={!isReadOnly}
      placeholderTextColor="#9CA3AF"
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}>
        {orders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F0F4FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientBackground}
            />
            <View style={styles.leftBorder} />

            <View style={styles.orderCardContent}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderModule}>{order.module}</Text>
                <Text style={styles.detailText}>
                  Material Type:{' '}
                  <Text style={styles.detailValue}>{order.materialType}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Material Category:{' '}
                  <Text style={styles.detailValue}>
                    {order.materialCategory}
                  </Text>
                </Text>
                <Text style={styles.detailText}>
                  Total Qty produced in Cum:{' '}
                  <Text style={styles.detailValue}>
                    {order.totalQtyProduced}
                  </Text>
                </Text>
              </View>

              <View style={styles.actionContainer}>
                <KebabMenu
                  onEdit={() => handleEdit(order.id)}
                  onView={() => handleView(order.id)}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View></View>
              <Text style={styles.modalTitle}>RMC Plant</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}>
              {/* Basic Information Section */}
              <View style={styles.sectionContainer}>
                {/* Project Description - Read Only */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Project Description</Text>
                  {renderTextInput(
                    selectedOrder?.projectDescription,
                    'Project',
                    null,
                    true,
                  )}
                </View>

                {/* Name of the Contractor - Read Only */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Name of the Contractor</Text>
                  {renderTextInput(
                    selectedOrder?.contractorName,
                    'ProCraft Builders',
                    null,
                    true,
                  )}
                </View>

                {/* Plant Details - Read Only */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Plant Details</Text>
                  {renderTextInput(
                    selectedOrder?.plantDetails,
                    'Detail from equipment',
                    null,
                    true,
                  )}
                </View>
              </View>

              {/* Mix Design Section */}
              <View style={styles.sectionContainer}>
                {/* Mix Design Category - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Mix Design Category</Text>
                  {renderDropdown(
                    formData.mixDesignCategory,
                    'Select Mix Design Category',
                  )}
                </View>

                {/* Material Type - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Material Type</Text>
                  {renderDropdown(
                    formData.materialType,
                    'Select Material Type',
                  )}
                </View>

                {/* Material Category - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Material Category</Text>
                  {renderDropdown(
                    formData.materialCategory,
                    'Select Material Category',
                  )}
                </View>

                {/* Mix Design Details - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Mix Design Details</Text>
                  {renderDropdown(
                    formData.mixDesignDetails,
                    'Select Mix Design Details',
                  )}
                </View>
              </View>

              {/* Work Details Section */}
              <View style={styles.sectionContainer}>
                {/* Description of Work - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Description of Work</Text>
                  {renderTextInput(
                    formData.workDescription,
                    'Module/ Segment/ Component/ Sub component',
                    text =>
                      setFormData(prev => ({...prev, workDescription: text})),
                  )}
                </View>

                {/* Concrete Ordered By - Read Only */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Concrete Ordered By</Text>
                  {renderTextInput(
                    selectedOrder?.concreteOrderedBy,
                    'User who ordered concrete from Mobile app',
                    null,
                    true,
                  )}
                </View>

                {/* Concrete Ordered Time - Read Only */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Concrete Ordered Time</Text>
                  {renderTextInput(
                    selectedOrder?.concreteOrderedTime,
                    'Automatic from System',
                    null,
                    true,
                  )}
                </View>
              </View>

              {/* Quantity & Grade Section */}
              <View style={styles.sectionContainer}>
                {/* Grade of Concrete Requested - Read Only */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    Grade of Concrete Requested
                  </Text>
                  {renderTextInput(
                    selectedOrder?.gradeRequested,
                    'Grade of Concrete from Web App',
                    null,
                    true,
                  )}
                </View>

                {/* Total Qty required in Cum - Read Only */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    Total Qty required in Cum
                  </Text>
                  {renderTextInput(
                    selectedOrder?.totalQtyRequired,
                    'Details of Concrete qty required in Cum from Web App',
                    null,
                    true,
                  )}
                </View>

                {/* Total Qty produced in Cum - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    Total Qty produced in Cum
                  </Text>
                  {renderTextInput(
                    formData.totalQtyProduced,
                    '0.3 dec, max limit 10000',
                    text =>
                      setFormData(prev => ({...prev, totalQtyProduced: text})),
                  )}
                </View>
              </View>

              {/* Dispatch Details Section */}
              <View style={styles.sectionContainer}>
                {/* Vehicle 4 digit no. - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Vehicle 4 digit no.</Text>
                  {renderTextInput(
                    formData.vehicleDigitNo,
                    '4 digit Integer',
                    text =>
                      setFormData(prev => ({...prev, vehicleDigitNo: text})),
                  )}
                </View>

                {/* Concrete Dispatch time - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Concrete Dispatch time</Text>
                  {renderTextInput(
                    formData.concreteDispatchTime,
                    'To be entered (from Clock)',
                    text =>
                      setFormData(prev => ({
                        ...prev,
                        concreteDispatchTime: text,
                      })),
                  )}
                </View>

                {/* Batch No. - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Batch No.</Text>
                  {renderTextInput(formData.batchNo, 'Char, Max 100', text =>
                    setFormData(prev => ({...prev, batchNo: text})),
                  )}
                </View>

                {/* Upload Batch Slip - Editable */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Upload Batch Slip</Text>
                  <TouchableOpacity style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>
                      Upload the Slip option (Image/ PDF)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveForm}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  listContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ABBEFD',
    position: 'relative',
    minHeight: 140,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: '15%',
    bottom: '15%',
    width: 2,
    backgroundColor: '#6366F1',
  },
  orderCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingLeft: 24,
    width: '100%',
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  orderModule: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    width: '100%',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    width: '100%',
    flexWrap: 'wrap',
    gap: 20,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 4,
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusContainer: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    minWidth: 40,
  },
  menuIconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column-reverse',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '85%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    maxHeight: '75%',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    minHeight: 52,
  },
  inputText: {
    fontSize: 15,
    color: '#1F2937',
    flex: 1,
    lineHeight: 20,
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    minHeight: 52,
    lineHeight: 20,
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
  },
  readOnlyText: {
    color: '#9CA3AF',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6366F1',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
