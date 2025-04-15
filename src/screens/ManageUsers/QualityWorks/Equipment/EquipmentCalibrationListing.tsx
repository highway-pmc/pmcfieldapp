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
import CustomSelectDropdown from '../../../Common/CustomSelectDropdown';
import {useSnackbar} from '../../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../../../Common/LoadingAnimation';
import {getEquipmentsListData, saveEquipmentsCalibrationInfo} from './actions';
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
  const {testEquipmentCategoryId, testEquipmentCategoryName, testEquipmentCategoryType} = route.params;
  const {height} = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const {showSnackbar} = useSnackbar();
  const focus = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  const dispatch = useDispatch();

  const {
    equipmentsListData,
    loading,
    error,
    savedEquipmentsCalibrationFormInfo,
  } = useSelector((state: any) => state.EquipmentsCalibration);
  const [equipmentListInfoData, setEquipmentListInfoData] = useState<any[]>([]);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.equipmentListing);
  }

  useEffect(() => {
    if (focus == true) {
      dispatch(getEquipmentsListData({projectId: loggedInUser.projectId, testEquipmentCategoryType: testEquipmentCategoryType}));
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

  const handleEditEquipment = (equipment: any) => {};

  const handleDeleteEquipment = (equipmentId: string) => {
    // Implement delete functionality
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
    // setSelectedEquipment(equipment);
    // console.log('===  Eq  =====>', equipment);
    // setModalVisible(true);
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
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 100,
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
});

export default EquipmentCalibrationListing;
