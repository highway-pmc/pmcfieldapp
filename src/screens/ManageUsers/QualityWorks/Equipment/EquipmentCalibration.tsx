import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  NativeEventEmitter,
} from 'react-native';
import {
  HeaderItems,
  RFIs_TYPE,
  SAMPLE_BY_LIST,
  TEST_CONDUCTED_BY_LIST,
} from '../../../../constants/constants';
import CustomSelectDropdown from '../../../Common/CustomSelectDropdown';
import CalendarPicker from '../../../../components/UI/CalenderPicker';
import TimePicker from '../../../../components/UI/TimePicker';
import {useSnackbar} from '../../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../../../Common/LoadingAnimation';
import {
  getEquipmentsMasterData,
  saveEquipmentsCalibrationInfo,
} from './actions';
import appConfig from '../../../../common/app.config';
import {set} from 'date-fns';
import DropdownPicker from '../../../../components/UI/DropdownPicker';
import Input from '../../../../components/UI/Input';
import {getDbDateFromDDMMYYYY} from '../../../../utils/Utils';

const EquipmentCalibration = ({
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
  const [selectedMaterialTypeData, setSelectedMaterialTypeData] = useState<any>(
    {},
  );
  const [
    selectedMaterialTypeCategoryData,
    setSelectedMaterialTypeCategoryData,
  ] = useState<any>({});
  const [dateOfCalibration, setDateOfCalibration] = useState('');
  const [nextDateOfCalibration, setNextDateOfCalibration] = useState('');
  const [
    equipmentCalibrationFormInfoData,
    setEquipmentCalibrationFormInfoData,
  ]: any = useState(null);
  const [calibrationDoneBy, setCalibrationDoneBy] = useState<any>();
  const dispatch = useDispatch();

  const {
    error,
    loading,
    savedEquipmentsCalibrationFormInfo,
    equipmentsMasterData,
  } = useSelector((state: any) => state.EquipmentsCalibration);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.equipmentInfo);
  }

  useEffect(() => {
    if (focus == true) {
      dispatch(getEquipmentsMasterData());
      setDateOfCalibration('');
      setNextDateOfCalibration('');
      setSelectedTestCategoryData(null);
      setSelectedMaterialTypeData(null);
      setSelectedMaterialTypeCategoryData('');
    }
  }, [focus]);

  useEffect(() => {
    console.log(
      '=======savedEquipmentsCalibrationFormInfo=======',
      savedEquipmentsCalibrationFormInfo,
    );
    if (savedEquipmentsCalibrationFormInfo) {
      showSnackbar('Data saved Succesfull');
      setTimeout(() => {
        navigation.navigate('EquipmentCalibrationListing');
      }, 3000);
    }
    if (equipmentsMasterData) {
      setEquipmentCalibrationFormInfoData(equipmentsMasterData);
      console.log('=====', equipmentsMasterData);
    }
    if (error) {
      showSnackbar('Unable to saveMix design data');
      console.log('=======ERROR=======', error);
    }
  }, [savedEquipmentsCalibrationFormInfo, equipmentsMasterData, error]);

  const handleCategorySelect = (selectedOption: any) => {
    setSelectedTestCategoryData({...selectedOption});
    setSelectedMaterialTypeData(null);
    setSelectedMaterialTypeCategoryData(null);
  };

  const handleMixDesignTypeSelect = (selectedOption: any) => {
    setSelectedMaterialTypeData({...selectedOption});
    setSelectedMaterialTypeCategoryData(null);
    console.log('======', selectedOption);
  };

  const handleMixDesignTypeCateorySelect = (selectedOption: any) => {
    setSelectedMaterialTypeCategoryData(selectedOption);
    console.log('======', selectedOption);
  };

  const handleInputChange = (item: any, value: string, fieldName: string) => {
    item[fieldName] = value;
  };

  const onSubmit = () => {
    console.log('=======Submit========');
    if (!selectedTestCategoryData || !selectedMaterialTypeData) {
      return;
    }

    // save mix design data
    dispatch(
      saveEquipmentsCalibrationInfo({
        projectId: loggedInUser.projectId,
        testWorkCategoryType: selectedTestCategoryData?.type,
        testEquipmentTypeId: selectedMaterialTypeData?._id,
        testEquipmentSubTypeId: selectedMaterialTypeCategoryData?._id,
        body: {
          name: `${selectedTestCategoryData.name}`,
          equipmentCalibrationData: {
            dateOfCalibration: getDbDateFromDDMMYYYY(dateOfCalibration),
            nextDateOfCalibration: getDbDateFromDDMMYYYY(nextDateOfCalibration),
            subType: selectedMaterialTypeCategoryData,
            calibrationDoneBy: calibrationDoneBy,
          },
        },
      }),
    );
  };
  return (
    <View style={styles.recentWorkContainer}>
      <ScrollView>
        <View style={styles.innerScrollView}>
          <View>
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
          </View>

          <CustomSelectDropdown
            label="Equipment Category"
            data={equipmentCalibrationFormInfoData}
            selectedValue={selectedTestCategoryData}
            onSelect={handleCategorySelect}
          />
          <CustomSelectDropdown
            label="Equipment type"
            data={selectedTestCategoryData?.equipmentTypeData}
            selectedValue={selectedMaterialTypeData}
            onSelect={handleMixDesignTypeSelect}
          />
          {selectedMaterialTypeData?.subTypes?.length > 0 && (
            <CustomSelectDropdown
              label="Sub Type"
              data={selectedMaterialTypeData?.subTypes}
              selectedValue={selectedMaterialTypeCategoryData}
              onSelect={handleMixDesignTypeCateorySelect}
            />
          )}
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
        </View>

        <TouchableOpacity style={styles.btnCtaOutline}>
          <Text style={styles.btnCtaTextOutline}>Upload</Text>
        </TouchableOpacity>

        <View style={styles.footerButton}>
          <TouchableOpacity style={styles.btnCtaOutline} onPress={onSubmit}>
            <Text style={styles.btnCtaTextOutline}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LoadingAnimation loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default EquipmentCalibration;
