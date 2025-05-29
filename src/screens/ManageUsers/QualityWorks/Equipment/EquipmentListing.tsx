import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  NativeEventEmitter,
} from 'react-native';
import {useSnackbar} from '../../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../../../Common/LoadingAnimation';
import {
  getEquipmentsMasterData,
  getEquipmentsCalibrationListing,
  getEquipmentsListData,
  clearEquipmentData,
} from './actions';
import {HeaderItems} from '../../../../constants/constants';
import LinearGradient from 'react-native-linear-gradient';

// Fix for EquipmentListing.tsx

// Fix issue with useIsFocused being called in render
const EquipmentListing = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {height} = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const {showSnackbar} = useSnackbar();
  const focus = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const dispatch = useDispatch();

  const {equipmentsMasterData, equipmentsListData, loading, error} =
    useSelector((state: any) => state.EquipmentsCalibration);

  interface EquipmentInfo {
    _id: string;
    name: string;
    type?: string;
    noOfEquipment?: number;
  }

  const [equipmentInfoData, setEquipmentInfoData] = useState<EquipmentInfo[]>(
    [],
  );

  // Move this to useEffect to avoid execution during render
  useEffect(() => {
    if (focus) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.equipmentListing);
    }
  }, [focus]);

  useEffect(() => {
    if (focus === true) {
      console.log('==EquipmentListing==');
      dispatch(clearEquipmentData());
      setEquipmentInfoData([]);
      dispatch(getEquipmentsMasterData());
    }
  }, [focus]);

  // Fix issue with equipmentInfoData update
  useEffect(() => {
    if (error) {
      showSnackbar('Unable to fetch equipment data');
    }

    if (
      equipmentsMasterData &&
      (!equipmentInfoData || equipmentInfoData.length === 0)
    ) {
      setEquipmentInfoData(equipmentsMasterData);
      dispatch(getEquipmentsListData({projectId: loggedInUser?.projectId}));
    }

    if (
      equipmentsListData &&
      equipmentInfoData &&
      equipmentInfoData.length > 0
    ) {
      // Create a new array to avoid directly mutating state
      const updatedEquipmentData = equipmentInfoData.map((item: any) => {
        // Count equipment of this category
        const count =
          equipmentsListData.filter(
            (equip: any) => equip.testEquipmentCategoryId === item._id,
          )?.length || 0;

        // Return a new object with the count
        return {
          ...item,
          noOfEquipment: count,
        };
      });

      setEquipmentInfoData(updatedEquipmentData);
    }
  }, [equipmentsMasterData, equipmentsListData, error]);

  const navigateToListOfEquipment = (item: any) => {
    if (!item || !item._id) {
      showSnackbar('Invalid equipment category');
      return;
    }

    console.log('==Params==', item);
    navigation.navigate('EquipmentCalibrationListing', {
      testEquipmentCategoryId: item._id,
      testEquipmentCategoryName: item.name,
      testEquipmentCategoryType: item.type,
    });
  };

  // Show loader until the equipmentsMasterData is loaded
  if (loading) {
    return <LoadingAnimation loading={true} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>List</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            console.log('Add Equipment');
            navigation.navigate('Equipment');
          }}>
          <Text style={styles.addButtonText}>Add Equipment</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.listContainer}>
          {equipmentInfoData && equipmentInfoData.length > 0 ? (
            equipmentInfoData.map((item: any, index: any) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigateToListOfEquipment(item)}
                style={styles.equipmentCard}>
                <LinearGradient
                  colors={['#FFFFFF', '#F2E3E9']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradientBackground}
                />
                <View style={styles.leftBorder} />
                <View style={styles.equipmentCardContent}>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                  <View style={styles.equipmentCountContainer}>
                    <Text style={styles.equipmentCount}>
                      {item.noOfEquipment}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No equipment categories found</Text>
          )}
        </View>
      </ScrollView>
      <LoadingAnimation loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#9D4C6C',
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#9D4C6C',
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  equipmentCard: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F8C5CD',
    position: 'relative',
    height: 70,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  leftBorder: {
    paddingVertical: 3,
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    zIndex: 100,
    width: 2,
    backgroundColor: '#9D4C6C',
  },

  equipmentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    height: '100%',
  },
  equipmentName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginLeft: 6,
  },
  equipmentCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9D4C6C',
  },
  equipmentCountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EquipmentListing;
