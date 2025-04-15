import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  NativeEventEmitter,
  Image,
} from 'react-native';
import CustomSelectDropdown from '../../../Common/CustomSelectDropdown';
import { useSnackbar } from '../../../../context/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import LoadingAnimation from '../../../Common/LoadingAnimation';
import {
  getEquipmentsMasterData,
  getEquipmentsCalibrationListing,
  getEquipmentsListData,
  clearEquipmentData,
} from './actions';
import { HeaderItems } from '../../../../constants/constants';

const EquipmentListing = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { height } = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const { showSnackbar } = useSnackbar();
  const focus = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  const dispatch = useDispatch();

  const { equipmentsMasterData, equipmentsListData, loading, error } =
    useSelector((state: any) => state.EquipmentsCalibration);
  const [equipmentInfoData, setEquipmentInfoData] = useState([]);
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.equipmentListing);
  }

  useEffect(() => {
    if (focus == true) {
      console.log('==EquipmentListing==');
      dispatch(clearEquipmentData());
      setEquipmentInfoData([]);
      dispatch(getEquipmentsMasterData());
    }
  }, [focus]);

  const navigateToListOfEquipment = (item: any) => {
    console.log("==Params==", item);
    navigation.navigate('EquipmentCalibrationListing', {
      testEquipmentCategoryId: item._id,
      testEquipmentCategoryName: item.name,
      testEquipmentCategoryType: item.type,
    });
  };
  useEffect(() => {
    if (error) {
      showSnackbar('Unable to saveMix design data');
    }
    if (equipmentsMasterData && !equipmentInfoData?.length) {
      setEquipmentInfoData(equipmentsMasterData);
      dispatch(getEquipmentsListData({ projectId: loggedInUser.projectId }));
    }
    if (equipmentsListData) {
      equipmentInfoData.forEach((item: any) => {
        item.noOfEquipment = equipmentsListData.filter((euip: any) => euip.testEquipmentCategoryId == item._id)?.length || 0;
      });

      setEquipmentInfoData([...equipmentInfoData]);
    }
  }, [equipmentsMasterData, equipmentsListData, error]);

  // Show loader until the equipmentsMasterData is loaded
  if (!equipmentsMasterData || loading) {
    return <LoadingAnimation loading={true} />;
  }
  return (
    <View style={styles.recentWorkContainer}>
      <TouchableOpacity
        style={styles.btnCtaOutline}
        onPress={() => {
          console.log('Add Equipment');
          navigation.navigate('Equipment');
        }}>
        <Text style={styles.btnCtaTextOutline}>Add Equipment </Text>
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.innerScrollView}>
          {equipmentInfoData &&
            equipmentInfoData.map((item: any, index: any) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigateToListOfEquipment(item)}
                style={styles.equipmentCard}>
                <View style={styles.equipmentCardContent}>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                </View>
                <View style={styles.equipmentCardContent}>
                  <Text style={styles.equipmentCount}>
                    {item.noOfEquipment}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      <LoadingAnimation loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  ActionIcon: {
    width: 20,
    height: 20,
  },
  // container: {
  //     flex: 1,
  //     paddingTop: 40,
  //     paddingHorizontal: 20,
  //   },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 2,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderLeftWidth: 8,
  },
  itemContainerSourceDetailList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 2,
    backgroundColor: '#f9f9f9',
  },
  itemText: {
    fontSize: 14,
    maxWidth: 200,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 110,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  recentWorkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  innerScrollView: {
    paddingBottom: 10,
    paddingTop: 15,
  },
  footerButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginTop: 15,
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
  mixDesignContainer: {
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    fontSize: 14,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderCell: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    paddingRight: 5,
  },
  tableCellDropdown: {
    paddingHorizontal: 5,
  },
  tableCellInput: {
    paddingLeft: 5,
  },
  qtyInput: {
    height: 40,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  materialDropdown: {
    width: '100%',
  },
  equipmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  equipmentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  equipmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  equipmentCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
});

export default EquipmentListing;
