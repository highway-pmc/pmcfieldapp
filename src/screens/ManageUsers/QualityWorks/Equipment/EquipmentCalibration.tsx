import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  NativeEventEmitter,
  Image,
  Modal,
} from 'react-native';
import {HeaderItems} from '../../../../constants/constants';
import {useSnackbar} from '../../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../../../Common/LoadingAnimation';
import {clearEquipmentData, getEquipmentsListData, saveEquipmentsCalibrationInfo} from './actions';
import CalendarPicker from '../../../../components/UI/CalenderPicker';
import Input from '../../../../components/UI/Input';
import {getDbDateFromDDMMYYYY} from '../../../../utils/Utils';

const EquipmentCalibration = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {
    _id,
    name,
    testEquipmentCategoryName,
    testEquipmentTypeName,
    testEquipmentSubTypeName,
    equipmentData,
  } = route.params;

  const {height} = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const {showSnackbar} = useSnackbar();
  const focus = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const dispatch = useDispatch();

  const {loading, error, savedEquipmentsCalibrationFormInfo} = useSelector(
    (state: any) => state.EquipmentsCalibration,
  );

  const [calibrationListData, setCalibrationListData]: any = useState([]);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);

  // Form fields for the modal
  const [dateOfCalibration, setDateOfCalibration] = useState('');
  const [nextDateOfCalibration, setNextDateOfCalibration] = useState('');
  const [calibrationDoneBy, setCalibrationDoneBy] = useState('');
  const [calibrationName, setCalibrationName] = useState('');

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.equipmentCalibrationListing);
  }

  useEffect(() => {
    if (focus) {
      // If equipment data is passed, extract the calibration data
      if (equipmentData) {
        dispatch(clearEquipmentData());
        setCalibrationListData([]);
        setCalibrationListData([...equipmentData]);
      }
    }
  }, [focus, equipmentData]);

  useEffect(() => {
    if (error) {
      showSnackbar('Unable to save calibration data');
    }

    if (savedEquipmentsCalibrationFormInfo) {
      showSnackbar('Calibration data saved successfully');
      setModalVisible(false);
      setCalibrationListData([...calibrationListData, savedEquipmentsCalibrationFormInfo])
      // Add the new calibration to the list
      
      resetFormFields();
    }
  }, [savedEquipmentsCalibrationFormInfo, error]);

  const resetFormFields = () => {
    setDateOfCalibration('');
    setNextDateOfCalibration('');
    setCalibrationDoneBy('');
    setCalibrationName('');
    dispatch(clearEquipmentData());
  };

  const handleSubmitCalibration = () => {
    if (
      !dateOfCalibration ||
      !nextDateOfCalibration ||
      !calibrationDoneBy ||
      !calibrationName
    ) {
      showSnackbar('Please fill all required fields');
      return;
    }

    dispatch(
      saveEquipmentsCalibrationInfo({
        projectId: loggedInUser.projectId,
        testEquipmentId: _id,
        body: {
          name: calibrationName,
          dateOfCalibration: getDbDateFromDDMMYYYY(dateOfCalibration),
          nextDateOfCalibration: getDbDateFromDDMMYYYY(nextDateOfCalibration),
          calibrationDoneBy: calibrationDoneBy,
          additionalData: {},
        },
      }),
    );
  };

  //Format date for display
  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const renderCalibrationItem = (calibration: any) => {
    return (
      <View key={calibration._id} style={styles.itemContainer}>
        <View style={styles.equipmentInfo}>
          <Text style={styles.equipmentName}>{calibration.name}</Text>
          <Text style={styles.equipmentDetails}>
            Calibration Date: {formatDate(calibration.dateOfCalibration)} 
          </Text>
          <Text style={styles.equipmentDetails}>
            Next Calibration Date:{' '}
            {formatDate(calibration.nextDateOfCalibration)}
          </Text>
        </View>
      </View>
    );
  };

  // Modal for adding calibration details
  const renderCalibrationModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetFormFields();
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calibration Details</Text>

            <View style={styles.equipmentInfoContainer}>
              <Text style={styles.equipmentNameTitle}>{name}</Text>

              <View style={styles.equipmentPropertyContainer}>
                <Text style={styles.propertyLabel}>Category:</Text>
                <Text style={styles.propertyValue}>
                  {testEquipmentCategoryName || 'N/A'}
                </Text>
              </View>

              <View style={styles.equipmentPropertyContainer}>
                <Text style={styles.propertyLabel}>Type:</Text>
                <Text style={styles.propertyValue}>
                  {testEquipmentTypeName || 'N/A'}
                </Text>
              </View>

              {testEquipmentSubTypeName && (
                <View style={styles.equipmentPropertyContainer}>
                  <Text style={styles.propertyLabel}>Sub Type:</Text>
                  <Text style={styles.propertyValue}>
                    {testEquipmentSubTypeName}
                  </Text>
                </View>
              )}

              <View style={styles.divider} />
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Name</Text>
                <Input
                  value={calibrationName}
                  style={styles.input}
                  label=""
                  onChange={(value: string) => setCalibrationName(value)}
                  isRequired={true}
                />
              </View>

              <CalendarPicker
                label="Date of Calibration"
                value={dateOfCalibration}
                onChange={(value: any) => {
                  setDateOfCalibration(value);
                }}
              />

              <CalendarPicker
                label="Next Date of Calibration"
                value={nextDateOfCalibration}
                onChange={(value: any) => {
                  setNextDateOfCalibration(value);
                }}
              />

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Calibration Done By</Text>
                <Input
                  value={calibrationDoneBy}
                  style={styles.input}
                  label=""
                  onChange={(value: string) => setCalibrationDoneBy(value)}
                  isRequired={true}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  resetFormFields();
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitCalibration}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{name} </Text>
      <View style={[styles.headerContainer, {justifyContent: 'center'}]}>
        <TouchableOpacity
          style={styles.btnCtaOutline}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.btnCtaTextOutline}>
            Add Calibration
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {calibrationListData && calibrationListData.length > 0 ? (
          calibrationListData.map(renderCalibrationItem)
        ) : (
          <Text style={styles.noDataText}>No calibration data found</Text>
        )}
      </ScrollView>

      {renderCalibrationModal()}

      <LoadingAnimation loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 15,
  },
  btnCtaOutline: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#1C58C0',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
  },
  btnCtaTextOutline: {
    color: '#1C58C0',
    fontSize: 14,
    fontWeight: '500',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#1C58C0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  addIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginRight: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  equipmentInfoContainer: {
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  equipmentNameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C58C0',
    marginBottom: 8,
    textAlign: 'center',
  },
  equipmentPropertyContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  propertyLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
    width: 110,
  },
  propertyValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 8,
  },
  formContainer: {
    maxHeight: 360,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    fontSize: 14,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#1C58C0',
    backgroundColor: '#1C58C0',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Item styles for the list
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1C58C0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  equipmentInfo: {
    flex: 1,
    paddingRight: 10,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  equipmentDetails: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  equipmentId: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  equipmentDate: {
    fontSize: 11,
    color: '#999999',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666666',
  },
});

export default EquipmentCalibration;
