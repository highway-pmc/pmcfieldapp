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
  saveEquipmentsInfo,
  editEquipmentsInfo,
} from './actions';
import appConfig from '../../../../common/app.config';
import {set} from 'date-fns';
import DropdownPicker from '../../../../components/UI/DropdownPicker';
import Input from '../../../../components/UI/Input';
import {getDbDateFromDDMMYYYY} from '../../../../utils/Utils';

const EquipmentAdd = ({navigation, route}: {navigation: any; route: any}) => {
  const {height} = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const {showSnackbar} = useSnackbar();
  const focus = useIsFocused();

  // Extract data from route params for edit mode
  const isEditMode = route.params?.isEditMode || false;
  const equipmentData = route.params?.equipmentData || null;
  const testEquipmentCategoryType =
    route.params?.testEquipmentCategoryType || null;

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
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [
    equipmentCalibrationFormInfoData,
    setEquipmentCalibrationFormInfoData,
  ]: any = useState(null);
  const [make, setMake] = useState<any>('');
  const [modelNumber, setModelNumber] = useState<any>('');
  const [name, setName] = useState('');
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
    if (focus === true) {
      dispatch(getEquipmentsMasterData());

      // Only reset fields if not in edit mode
      if (!isEditMode) {
        setDateOfPurchase('');
        setSelectedTestCategoryData(null);
        setSelectedMaterialTypeData(null);
        setSelectedMaterialTypeCategoryData(null);
        setName('');
        setMake('');
        setModelNumber('');
      }
    }
  }, [focus]);

  // Set up form data for edit mode
  useEffect(() => {
    if (isEditMode && equipmentData && equipmentsMasterData) {
      try {
        // Find the category by ID
        const categoryData = equipmentsMasterData.find(
          category => category._id === equipmentData.testEquipmentCategoryId,
        );

        if (categoryData) {
          setSelectedTestCategoryData(categoryData);

          // Find the equipment type within this category
          if (
            categoryData.equipmentTypeData &&
            categoryData.equipmentTypeData.length > 0
          ) {
            const typeData = categoryData.equipmentTypeData.find(
              type => type._id === equipmentData.testEquipmentTypeId,
            );

            if (typeData) {
              setSelectedMaterialTypeData(typeData);

              // Check for subtype in metaData
              if (equipmentData.metaData && equipmentData.metaData.subType) {
                // Find the matching subtype in the equipment type's subtypes array
                if (typeData.subTypes && typeData.subTypes.length > 0) {
                  const subTypeData = typeData.subTypes.find(
                    subType =>
                      subType.type === equipmentData.metaData.subType.type,
                  );

                  if (subTypeData) {
                    setSelectedMaterialTypeCategoryData(subTypeData);
                  }
                }
              }
            }
          }
        }

        // Set other form fields
        setName(equipmentData.name || '');
        setMake(equipmentData.make || '');
        setModelNumber(equipmentData.modelNo || '');

        // Format date of purchase if available
        if (equipmentData.dateOfPurchase) {
          // Format the date to DD/MM/YYYY
          const date = new Date(equipmentData.dateOfPurchase);
          const formattedDate = `${date
            .getDate()
            .toString()
            .padStart(2, '0')}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${date.getFullYear()}`;
          setDateOfPurchase(formattedDate);
        }
      } catch (err) {
        console.error('Error loading equipment data for edit:', err);
        showSnackbar('Error loading equipment data');
      }
    }
  }, [isEditMode, equipmentData, equipmentsMasterData]);

  useEffect(() => {
    if (savedEquipmentsCalibrationFormInfo) {
      showSnackbar(
        isEditMode
          ? 'Equipment updated successfully'
          : 'Data saved successfully',
      );
      setTimeout(() => {
        navigation.navigate('EquipmentListing');
      }, 1000);
    }
    if (equipmentsMasterData) {
      setEquipmentCalibrationFormInfoData(equipmentsMasterData);
    }
    if (error) {
      showSnackbar(
        isEditMode
          ? 'Unable to update equipment data'
          : 'Unable to save equipment data',
      );
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
    //console.log('======', selectedOption);
  };

  const onSubmit = () => {
    console.log('=======Submit========');
    if (!selectedTestCategoryData || !selectedMaterialTypeData || !name) {
      showSnackbar('Please fill in all required fields');
      return;
    }

    const equipmentBody = {
      name: name,
      testEquipmentType: selectedMaterialTypeData?.equipmentType,
      dateOfPurchase: dateOfPurchase
        ? getDbDateFromDDMMYYYY(dateOfPurchase)
        : null,
      make: make || '',
      modelNo: modelNumber || '',
      additionalData: {
        subType: selectedMaterialTypeCategoryData || null,
      },
    };
    console.log('======', equipmentBody);

    if (isEditMode && equipmentData) {
      // Call edit equipment API
      dispatch(
        editEquipmentsInfo({
          projectId: loggedInUser.projectId,
          testEquipmentCategory: selectedTestCategoryData?.type,
          testEquipmentTypeId: selectedMaterialTypeData?._id,
          testEquipmentId: equipmentData._id,
          body: equipmentBody,
        }),
      );
      navigation.navigate('EquipmentListing');
    } else {
      // Call save equipment API
      dispatch(
        saveEquipmentsInfo({
          projectId: loggedInUser.projectId,
          testWorkCategoryType: selectedTestCategoryData?.type,
          testEquipmentTypeId: selectedMaterialTypeData?._id,
          testEquipmentSubTypeId: selectedMaterialTypeCategoryData?._id || null,
          body: equipmentBody,
        }),
      );
    }
  };

  return (
    <View style={styles.recentWorkContainer}>
      <ScrollView>
        <View style={styles.innerScrollView}>
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
          <CalendarPicker
            label="Date of purchase"
            value={dateOfPurchase}
            onChange={(value: any) => {
              setDateOfPurchase(value);
            }}
          />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Name </Text>
            <Input
              value={name}
              style={styles.input}
              label=""
              onChange={(value: string) => setName(value)}
              isRequired={true}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Make </Text>
            <Input
              value={make}
              style={styles.input}
              label=""
              onChange={(value: string) => setMake(value)}
              isRequired={true}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Model no. </Text>
            <Input
              value={modelNumber}
              style={styles.input}
              label=""
              onChange={(value: string) => setModelNumber(value)}
              isRequired={true}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.btnCtaOutline}>
          <Text style={styles.btnCtaTextOutline}>
            Upload Manufacturing Certificate
          </Text>
        </TouchableOpacity>

        <View style={styles.footerButton}>
          <TouchableOpacity style={styles.btnCtaOutline} onPress={onSubmit}>
            <Text style={styles.btnCtaTextOutline}>
              {isEditMode ? 'Update' : 'Submit'}
            </Text>
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
    borderColor: '#9D4C6C',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
  },
  btnCtaTextOutline: {
    color: '#9D4C6C',
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
  },
  input: {
    height: 38,
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

export default EquipmentAdd;
