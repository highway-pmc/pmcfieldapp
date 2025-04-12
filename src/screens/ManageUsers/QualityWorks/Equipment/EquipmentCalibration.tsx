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
  getEquipmentsCalibrationData,
  saveEquipmentsCalibrationdInfo,
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
  const [recommend, setRecommend] = useState<any>();
  const dispatch = useDispatch();

  const {
    error,
    savedEquipmentsCalibrationFormInfo,
    equipmentsCalibrationData,
  } = useSelector((state: any) => state.EquipmentsCalibration);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.equipmentInfo);
  }

  useEffect(() => {
    if (focus == true) {
      dispatch(getEquipmentsCalibrationData());
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
    if (equipmentsCalibrationData) {
      setEquipmentCalibrationFormInfoData(equipmentsCalibrationData);
      console.log('=====', equipmentsCalibrationData);
    }
    if (error) {
      showSnackbar('Unable to saveMix design data');
      console.log('=======ERROR=======', error);
    }
  }, [savedEquipmentsCalibrationFormInfo, equipmentsCalibrationData, error]);

  const handleCategorySelect = (selectedOption: any) => {
    setSelectedTestCategoryData({...selectedOption});
    setSelectedMaterialTypeData(null);
  };

  const handleMixDesignTypeSelect = (selectedOption: any) => {
    setSelectedMaterialTypeData({...selectedOption});
    setSelectedMaterialTypeCategoryData('');
    console.log('======', selectedOption);
  };

  const handleMixDesignTypeCateorySelect = (selectedOption: any) => {
    setSelectedMaterialTypeCategoryData(selectedOption);
    console.log('======', selectedOption);
  };

  const handleInputChange = (item: any, value: string, fieldName: string) => {
    item[fieldName] = value;
  };

  // const onSubmit = () => {
  //   const materialsData: any = [];
  //   qualityMixDesignFormInfoData.forEach((item: any) => {
  //     console.log('selectedSource', item.selectedSource);
  //     console.log('selectedMaterialQty', item.qty);
  //     materialsData.push({
  //       _id: item._id,
  //       materialType: item.materialType,
  //       name: item.name,
  //       selectedSource: item.selectedSource
  //         ? {
  //             _id: item.selectedSource._id,
  //             name: item.selectedSource.name,
  //           }
  //         : null,
  //       qty: item.qty,
  //     });
  //   });

  //   console.log(
  //     '===============',
  //     selectedTestCategoryData,
  //     selectedMaterialTypeData,
  //     selectedMaterialTypeCategoryData,
  //   );
  //   if (
  //     !selectedTestCategoryData ||
  //     !selectedMaterialTypeData ||
  //     !selectedMaterialTypeCategoryData
  //   ) {
  //     return;
  //   }

  //   // save mix design data
  //   dispatch(
  //     saveMixDesignFormInfo({
  //       projectId: loggedInUser.projectId,
  //       testWorkCategoryType: selectedTestCategoryData?.type,
  //       testMaterialId: selectedMaterialTypeData?._id,
  //       body: {
  //         name: `${selectedTestCategoryData.name}-${selectedMaterialTypeData.name}-${selectedMaterialTypeCategoryData}`,
  //         comments: recommend,
  //         mixDesignData: {
  //           dateOfCalibration: getDbDateFromDDMMYYYY(dateOfCalibration),
  //           nextDateOfCalibration: getDbDateFromDDMMYYYY(nextDateOfCalibration),
  //           materialCategory: selectedMaterialTypeCategoryData,
  //           materialsData: materialsData,
  //         },
  //       },
  //     }),
  //   );
  // };
  const onSubmit = () => {
    const materialsData: any = [];

    if (
      !selectedTestCategoryData ||
      !selectedMaterialTypeData ||
      !selectedMaterialTypeCategoryData
    ) {
      return;
    }

    // save mix design data
    dispatch(
      saveEquipmentsCalibrationdInfo({
        projectId: loggedInUser.projectId,
        testWorkCategoryType: selectedTestCategoryData?.type,
        testEquipmentTypeId: selectedMaterialTypeData?._id,
        body: {
          name: `${selectedTestCategoryData.name}`,
          comments: recommend,
          equipmentCalibrationData: {
            dateOfCalibration: getDbDateFromDDMMYYYY(dateOfCalibration),
            nextDateOfCalibration: getDbDateFromDDMMYYYY(nextDateOfCalibration),
            materialCategory: selectedMaterialTypeCategoryData,
            materialsData: materialsData,
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
          <CustomSelectDropdown
            label="Sub Type"
            data={selectedMaterialTypeData?.subTypes}
            selectedValue={selectedMaterialTypeCategoryData}
            onSelect={handleMixDesignTypeCateorySelect}
          />
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

export default EquipmentCalibration;
