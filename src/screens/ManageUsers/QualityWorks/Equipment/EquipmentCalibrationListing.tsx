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
import CustomSelectDropdown from '../../../Common/CustomSelectDropdown';
import {useSnackbar} from '../../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../../../Common/LoadingAnimation';
import Pdf from 'react-native-pdf'; 
import {
  getEquipmentsListData,
  saveEquipmentsCalibrationInfo,
  deleteEquipment,
  generateEquipmentReport,
} from './actions';
import {HeaderItems} from '../../../../constants/constants';
import CalendarPicker from '../../../../components/UI/CalenderPicker';
import Input from '../../../../components/UI/Input';
import {getDbDateFromDDMMYYYY} from '../../../../utils/Utils';

const EquipmentCalibrationListing = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {
    testEquipmentCategoryId,
    testEquipmentCategoryName,
    testEquipmentCategoryType,
  } = route.params;
  const {height, width} = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const {showSnackbar} = useSnackbar();
  const focus = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  const dispatch = useDispatch();

  const {
    equipmentsListData,
    loading,
    error,
    equipmentReport,
    deletedEquipment,
  } = useSelector((state: any) => state.EquipmentsCalibration);
  const [equipmentListInfoData, setEquipmentListInfoData] = useState<any[]>([]);

  // Report modal state
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.equipmentCalibrationListing);
  }

  useEffect(() => {
    if (focus == true) {
      dispatch(
        getEquipmentsListData({
          projectId: loggedInUser.projectId,
          testEquipmentCategoryType: testEquipmentCategoryType,
        }),
      );
    }
  }, [focus]);

  useEffect(() => {
    if (error) {
      showSnackbar('Unable to fetch equipment data');
      console.log('=======ERROR=======', error);
    }

    if (equipmentsListData) {
      setEquipmentListInfoData(equipmentsListData);
    }
  }, [equipmentsListData, error]);

  useEffect(() => {
    if (deletedEquipment) {
      showSnackbar('Equipment deleted successfully');
      dispatch(
        getEquipmentsListData({
          projectId: loggedInUser.projectId,
          testEquipmentCategoryType: testEquipmentCategoryType,
        }),
      );
    }
  }, [deletedEquipment]);

  // Handle report generation response
  useEffect(() => {
    if (equipmentReport) {
      setReportModalVisible(true);
      setPdfSource({
        uri: 'data:application/pdf;base64,' + equipmentReport,
      });
    }
  }, [equipmentReport]);

  const handleEditEquipment = (equipment: any) => {
    console.log('Navigating to Equipment screen with props:', equipment);
    navigation.navigate('Equipment', {
      isEditMode: true,
      equipmentData: equipment,
      testEquipmentCategoryType: testEquipmentCategoryType,
    });
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    console.log('Clicked on delete function');
    Alert.alert(
      'Delete Equipment',
      'Are you sure you want to delete this equipment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(
              deleteEquipment({
                projectId: loggedInUser.projectId,
                testEquipmentId: equipmentId,
              }),
            );
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleGenerateReport = (equipmentId: string) => {
    setPdfSource(null);
    dispatch(
      generateEquipmentReport({
        projectId: loggedInUser.projectId,
        testEquipmentId: equipmentId,
      }),
    );
  };

  const handleAddDetails = (equipment: any) => {
    navigation.navigate('EquipmentCalibration', {
      _id: equipment._id,
      name: equipment.name,
      equipmentData: equipment.equipmentCalibrations,
      testEquipmentCategoryName: equipment.testEquipmentCategoryName,
      testEquipmentTypeName: equipment.testEquipmentTypeName,
      testEquipmentSubTypeName: equipment.testEquipmentSubTypeName,
    });
  };

  const renderEquipmentItem = (equipment: any) => {
    return (
      <View key={equipment._id} style={styles.itemContainer}>
        <View style={styles.equipmentInfo}>
          <Text style={styles.equipmentName}>{equipment.name}</Text>
          <Text style={styles.equipmentDetails}>
            {equipment.testEquipmentTypeName} • {equipment.make || 'N/A'} •{' '}
            {equipment.modelNo || 'N/A'}
          </Text>
          <Text style={styles.equipmentId}>
            ID: {equipment.uniqueEquipmentId}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          {/* View Report Button */}

          <View style={{flexDirection: 'row', gap: 5, marginBottom: 5}}>
            <TouchableOpacity onPress={() => handleAddDetails(equipment)}>
              <Image
                source={require('./../../../../images/plus.png')}
                style={styles.ActionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEditEquipment(equipment)}>
              <Image
                source={require('./../../../../images/edit.png')}
                style={styles.ActionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteEquipment(equipment._id)}>
              <Image
                source={require('./../../../../images/menu/delete.png')}
                style={styles.ActionIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleGenerateReport(equipment._id)}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Report modal component
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
                <Text style={styles.reportModalTitle}>Equipment Report</Text>
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
    <View style={styles.recentWorkContainer}>
      <ScrollView contentContainerStyle={styles.innerScrollView}>
        {equipmentListInfoData && equipmentListInfoData.length > 0 ? (
          equipmentListInfoData.map(renderEquipmentItem)
        ) : (
          <Text style={styles.noDataText}>No equipment data found</Text>
        )}
      </ScrollView>

      {renderReportModal()}
      <LoadingAnimation loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  ActionIcon: {
    width: 24,
    height: 24,
  },
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
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 130, // Increased width to accommodate View button
  },
  recentWorkContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 15,
  },
  innerScrollView: {
    paddingBottom: 60,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666666',
  },
  viewButton: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#27AE60',
    backgroundColor: '#27AE60',
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
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

export default EquipmentCalibrationListing;
