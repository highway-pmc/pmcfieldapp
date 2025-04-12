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
} from 'react-native';
import CustomSelectDropdown from '../../../Common/CustomSelectDropdown';
import {useSnackbar} from '../../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../../../Common/LoadingAnimation';
import {getEquipmentsCalibrationListing} from './actions';
import {HeaderItems} from '../../../../constants/constants';

const EquipmentCalibrationListing = ({
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
  const [selectedTestCategoryData, setSelectedTestCategoryData] = useState<any>(
    {},
  );
  const dispatch = useDispatch();

  const {
    qualityMasterListing,
    equipmentsCalibrationData,
    equipmentsCalibrationListing,
    loading,
    error,
  } = useSelector((state: any) => state.EquipmentsCalibration);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.equipmentListing);
  }

  useEffect(() => {
    if (focus == true) {
    }
  }, [focus]);

  useEffect(() => {
    if (error) {
      showSnackbar('Unable to saveMix design data');
      console.log('=======ERROR=======', error);
    }
  }, [error]);

  const handleCategorySelect = (selectedOption: any) => {
    setSelectedTestCategoryData({...selectedOption});
    handleFormData(selectedOption);
  };

  const handleFormData = async (testCategoryData: any) => {
    dispatch(
      getEquipmentsCalibrationListing({
        projectId: loggedInUser.projectId,
        testWorkCategoryType: testCategoryData.type,
        testMaterialId: 'NA',
      }),
    );
    console.log('======qualityMixDesign=======', equipmentsCalibrationListing);
  };

  return (
    <View style={styles.recentWorkContainer}>
      <ScrollView>
        <TouchableOpacity
          style={styles.btnCtaOutline}
          onPress={() => {
            navigation.navigate('EquipmentCalibration');
          }}>
          <Text style={styles.btnCtaTextOutline}>
            Add Equipment Calibartion{' '}
          </Text>
        </TouchableOpacity>
        <View style={styles.innerScrollView}>
          <CustomSelectDropdown
            label="Test Category"
            data={qualityMasterListing?.testWorkCategoryData}
            selectedValue={selectedTestCategoryData}
            onSelect={handleCategorySelect}
          />
        </View>
        {equipmentsCalibrationListing?.map((item: any, index: number) => {
          return (
            <>
              <View style={[styles.itemContainerSourceDetailList]}>
                <Text style={styles.itemText}>{item.name}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => console.log('Edit')}>
                    <Image
                      style={styles.ActionIcon}
                      tintColor={'#333'}
                      source={require('./../../../../images/edit.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => console.log('Trash')}>
                    <Image
                      style={styles.ActionIcon}
                      tintColor={'#333'}
                      source={require('./../../../../images/trash.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          );
        })}
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
});

export default EquipmentCalibrationListing;
