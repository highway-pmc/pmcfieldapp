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
  Alert,
} from 'react-native';
import {HeaderItems} from '../../../../constants/constants';
import {useSnackbar} from '../../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../../../Common/LoadingAnimation';
import Pdf from 'react-native-pdf';
import KebabMenu from '../../../Common/KebabMenu';
import LinearGradient from 'react-native-linear-gradient';
import {
  clearEquipmentData,
  getEquipmentsListData,
  saveEquipmentsCalibrationInfo,
  editEquipmentsCalibration,
  deleteEquipmentCalibration,
  generateEquipmentCalibrationReport,
} from './actions';
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

  const {height, width} = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const {showSnackbar} = useSnackbar();
  const focus = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const dispatch = useDispatch();

  const {
    loading,
    error,
    savedEquipmentsCalibrationFormInfo,
    editedEquipmentsCalibrationFormInfo,
    deletedEquipmentCalibration,
    equipmentCalibrationReport,
  } = useSelector((state: any) => state.EquipmentsCalibration);

  const [calibrationListData, setCalibrationListData]: any = useState([]);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCalibrationId, setCurrentCalibrationId] = useState('');

  // Report modal state
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);

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
        setPdfSource(null);
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
      setCalibrationListData([
        ...calibrationListData,
        savedEquipmentsCalibrationFormInfo,
      ]);
      resetFormFields();
    }
  }, [savedEquipmentsCalibrationFormInfo, error]);

  // Add effect for handling edited calibration data
  useEffect(() => {
    if (editedEquipmentsCalibrationFormInfo) {
      showSnackbar('Calibration data updated successfully');
      setModalVisible(false);

      // Update the calibration list with the edited data
      setCalibrationListData(
        calibrationListData.map((item: any) =>
          item._id === editedEquipmentsCalibrationFormInfo._id
            ? editedEquipmentsCalibrationFormInfo
            : item,
        ),
      );

      resetFormFields();
    }
  }, [editedEquipmentsCalibrationFormInfo]);

  useEffect(() => {
    if (deletedEquipmentCalibration) {
      showSnackbar('Calibration record deleted successfully');
      setCalibrationListData((prevCalibrationList: any) =>
        prevCalibrationList.filter(
          (item: any) => item._id !== deletedEquipmentCalibration._id,
        ),
      );

      dispatch(clearEquipmentData());
    }
  }, [deletedEquipmentCalibration]);

  // Handle report generation
  useEffect(() => {
    if (equipmentCalibrationReport) {
      setReportModalVisible(true);
      setPdfSource({
        uri: 'data:application/pdf;base64,' + equipmentCalibrationReport,
      });
    }
  }, [equipmentCalibrationReport]);

  const resetFormFields = () => {
    setDateOfCalibration('');
    setNextDateOfCalibration('');
    setCalibrationDoneBy('');
    setCalibrationName('');
    setIsEditing(false);
    setCurrentCalibrationId('');
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

    const calibrationData = {
      name: calibrationName,
      dateOfCalibration: getDbDateFromDDMMYYYY(dateOfCalibration),
      nextDateOfCalibration: getDbDateFromDDMMYYYY(nextDateOfCalibration),
      calibrationDoneBy: calibrationDoneBy,
      additionalData: {},
    };

    if (isEditing) {
      // Handle edit
      dispatch(
        editEquipmentsCalibration({
          projectId: loggedInUser.projectId,
          testEquipmentId: _id,
          testEquipmentCalibrationId: currentCalibrationId,
          body: calibrationData,
        }),
      );
    } else {
      // Handle add
      dispatch(
        saveEquipmentsCalibrationInfo({
          projectId: loggedInUser.projectId,
          testEquipmentId: _id,
          body: calibrationData,
        }),
      );
    }
  };

  // New function to handle report generation
  const handleGenerateReport = (calibration: any) => {
    setPdfSource(null);
    dispatch(clearEquipmentData());

    setTimeout(() => {
      dispatch(
        generateEquipmentCalibrationReport({
          projectId: loggedInUser.projectId,
          testEquipmentId: _id,
          testEquipmentCalibrationId: calibration._id,
        }),
      );
    }, 100);
  };

  // New function to handle calibration edit
  const handleEditCalibration = (calibration: any) => {
    // Convert date format from database to DD/MM/YYYY for display
    const formatDateForDisplay = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Set form fields with calibration data
    setCalibrationName(calibration.name || '');
    setDateOfCalibration(
      formatDateForDisplay(calibration.dateOfCalibration) || '',
    );
    setNextDateOfCalibration(
      formatDateForDisplay(calibration.nextDateOfCalibration) || '',
    );
    setCalibrationDoneBy(calibration.calibrationDoneBy || '');

    // Set editing state
    setIsEditing(true);
    setCurrentCalibrationId(calibration._id);

    // Open modal
    setModalVisible(true);
  };

  const handleDeleteCalibration = (calibrationId: string) => {
    Alert.alert(
      'Delete Calibration Record',
      'Are you sure you want to delete this calibration record? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(
              deleteEquipmentCalibration({
                projectId: loggedInUser.projectId,
                testEquipmentId: _id,
                testEquipmentCalibrationId: calibrationId,
              }),
            );
          },
          style: 'destructive',
        },
      ],
    );
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const renderCalibrationItem = (calibration: any) => {
    return (
      <LinearGradient
        key={calibration._id}
        colors={['#FFFFFF', '#F2E3E9']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.itemContainer}>
        <View style={styles.leftBorder} />
        <View style={styles.equipmentInfo}>
          <Text style={styles.equipmentName}>{calibration.name}</Text>
          <Text style={styles.equipmentDetails}>
            Calibration Date: {formatDate(calibration.dateOfCalibration)}
          </Text>
          <Text style={styles.equipmentDetails}>
            Next Calibration Date:{' '}
            {formatDate(calibration.nextDateOfCalibration)}
          </Text>
          <Text style={styles.equipmentDetails}>
            Done by: {calibration.calibrationDoneBy || 'N/A'}
          </Text>
        </View>
        <View style={{position: 'absolute', right: 0, top: 0}}>
          <KebabMenu
            onView={() => handleGenerateReport(calibration)}
            onEdit={() => handleEditCalibration(calibration)}
            onDelete={() => handleDeleteCalibration(calibration._id)}
          />
        </View>
      </LinearGradient>
    );
  };

  // Modal for adding/editing calibration details
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
            <Text style={styles.modalTitle}>
              {isEditing
                ? 'Edit Calibration Details'
                : 'Add Calibration Details'}
            </Text>

            <View style={styles.equipmentInfoContainer}>
              <Text style={styles.equipmentNameTitle}>{name}</Text>

              <View style={styles.equipmentPropertyContainer}>
                <Text style={styles.propertyLabel}>Category:</Text>
                <Text style={styles.propertyValue}>
                  {testEquipmentCategoryName}
                </Text>
              </View>

              <View style={styles.equipmentPropertyContainer}>
                <Text style={styles.propertyLabel}>Type:</Text>
                <Text style={styles.propertyValue}>
                  {testEquipmentTypeName}
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
                <Text style={styles.submitButtonText}>
                  {isEditing ? 'Update' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderReportModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => {
          setReportModalVisible(false);
          setPdfSource(null);
        }}>
        <View style={styles.reportModalContainer}>
          <View style={styles.reportCenteredView}>
            <View style={styles.reportModalView}>
              <View style={styles.reportModalHeader}>
                <Text style={styles.reportModalTitle}>Calibration Report</Text>
                <TouchableOpacity
                  style={styles.reportButtonClose}
                  onPress={() => {
                    setReportModalVisible(false);
                    setPdfSource(null);
                  }}>
                  <Image
                    style={styles.closeIcon}
                    tintColor={'#333'}
                    source={require('./../../../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              {pdfSource && (
                <View style={styles.pdfContainer}>
                  <Pdf
                    source={pdfSource}
                    onLoadComplete={(numberOfPages, filePath) => {
                      console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                      console.log(`Current page: ${page}`);
                    }}
                    onError={error => {
                      console.log(error);
                    }}
                    onPressLink={uri => {
                      console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={[styles.headerContainer]}>
          <TouchableOpacity
            style={styles.btnCtaOutline}
            onPress={() => {
              resetFormFields();
              setModalVisible(true);
            }}>
            <Text style={styles.btnCtaTextOutline}>Add Calibration</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {calibrationListData && calibrationListData.length > 0 ? (
          calibrationListData.map(renderCalibrationItem)
        ) : (
          <Text style={styles.noDataText}>No calibration data found</Text>
        )}
      </ScrollView>

      {renderCalibrationModal()}
      {renderReportModal()}

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
    borderColor: '#9D4C6C',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
  },
  btnCtaTextOutline: {
    color: '#9D4C6C',
    fontSize: 12,
    fontWeight: '500',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
    flex: 3,
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  // Item styles for the list
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: '#9D4C6C',
  },
  equipmentInfo: {
    flex: 1,
    paddingLeft: 8,
  },
  equipmentName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  equipmentDetails: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666666',
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
    color: '#9D4C6C',
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
    borderColor: '#9D4C6C',
    backgroundColor: '#9D4C6C',
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
  // Report modal styles
  reportModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  reportCenteredView: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 60,
  },
  reportModalView: {
    minHeight: 150,
  },
  reportModalHeader: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
  },
  reportModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
    textAlign: 'center',
  },
  reportButtonClose: {
    position: 'absolute',
    right: 15,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  pdfContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    height: Dimensions.get('screen').height - 200,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
});

export default EquipmentCalibration;
