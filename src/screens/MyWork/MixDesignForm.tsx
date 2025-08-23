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
} from '../../constants/constants';
import CustomSelectDropdown from '../Common/CustomSelectDropdown';
import CalendarPicker from '../../components/UI/CalenderPicker';
import TimePicker from '../../components/UI/TimePicker';
import {useSnackbar} from '../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../Common/LoadingAnimation';
import {
  getQualityMasterList,
  getMixDesignFormInfo,
  saveMixDesignFormInfo,
  clearRFITasksEvent,
} from '../RFIs/actions';
import appConfig from '../../common/app.config';
import {set} from 'date-fns';
import DropdownPicker from '../../components/UI/DropdownPicker';
import Input from '../../components/UI/Input';
import {getDbDateFromDDMMYYYY} from '../../utils/Utils';

const MixDesign = ({navigation, route}: {navigation: any; route: any}) => {
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
  ] = useState<any>('');
  const [dateOfSampling, setDateOfSampling] = useState('');
  const [totalQty, setTotalQty] = useState('');
  const [sampleBy, setSampleBy] = useState('Concessionaire');
  const [mixDesignConductedBy, setMixDesignConductedBy] =
    useState('Concessionaire');
  const [qualityMixDesignFormInfoData, setQualityMixDesignFormInfoData]: any =
    useState(null);
  const [recommend, setRecommend] = useState<any>();
  const dispatch = useDispatch();

  const {
    savedMixDesignFormInfo,
    qualityMasterListing,
    qualityMixDesignFormInfo,
    loading,
    error,
  } = useSelector((state: any) => state.RFIs);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.mixDesignInfo);
  }

  useEffect(() => {
    if (focus == true) {
      dispatch(clearRFITasksEvent());
      dispatch(getQualityMasterList({testType: 'mix-design'}));
      setDateOfSampling('');
      setTotalQty('');
      setSampleBy('Concessionaire');
      setMixDesignConductedBy('Concessionaire');
      setSelectedTestCategoryData(null);
      setSelectedMaterialTypeData(null);
      setSelectedMaterialTypeCategoryData('');
      setQualityMixDesignFormInfoData(null);
    }
  }, [focus]);

  useEffect(() => {
    if (savedMixDesignFormInfo) {
      showSnackbar('Data saved Succesfull');
      setTimeout(() => {
        navigation.navigate('MixDesignListing');
      }, 3000);
    }
    if (qualityMixDesignFormInfo) {
      setQualityMixDesignFormInfoData(qualityMixDesignFormInfo);
    }
    if (error) {
      showSnackbar('Unable to saveMix design data');
      console.log('=======ERROR=======', error);
    }
  }, [savedMixDesignFormInfo, qualityMixDesignFormInfo, error]);

  const handleCategorySelect = (selectedOption: any) => {
    setSelectedTestCategoryData({...selectedOption});
    setSelectedMaterialTypeData(null);
    handleFormData(selectedOption);
    console.log('======', selectedOption);
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

  const handleFormData = async (testCategoryData: any) => {
    dispatch(
      getMixDesignFormInfo({
        projectId: loggedInUser.projectId,
        testWorkCategoryType: testCategoryData.type,
        testMaterialId: selectedMaterialTypeData?._id || 'NA',
      }),
    );
  };

  const handleSourceSelect = (item: any, selectedOption: any) => {
    item.selectedSource = selectedOption;

    setQualityMixDesignFormInfoData([...qualityMixDesignFormInfoData]);
  };

  const handleInputChange = (item: any, value: string, fieldName: string) => {
    item[fieldName] = value;
  };

  const onSubmit = () => {
    const materialsData: any = [];
    qualityMixDesignFormInfoData.forEach((item: any) => {
      console.log('selectedSource', item.selectedSource);
      console.log('selectedMaterialQty', item.qty);
      materialsData.push({
        _id: item._id,
        materialType: item.materialType,
        name: item.name,
        selectedSource: item.selectedSource
          ? {
              _id: item.selectedSource._id,
              name: item.selectedSource.name,
            }
          : null,
        qty: item.qty,
      });
    });

    console.log(
      '===============',
      selectedTestCategoryData,
      selectedMaterialTypeData,
      selectedMaterialTypeCategoryData,
    );
    if (
      !selectedTestCategoryData ||
      !selectedMaterialTypeData ||
      !selectedMaterialTypeCategoryData
    ) {
      return;
    }

    // save mix design data
    dispatch(
      saveMixDesignFormInfo({
        projectId: loggedInUser.projectId,
        testWorkCategoryType: selectedTestCategoryData?.type,
        testMaterialId: selectedMaterialTypeData?._id,
        body: {
          name: `${selectedTestCategoryData.name}-${selectedMaterialTypeData.name}-${selectedMaterialTypeCategoryData}`,
          comments: recommend,
          mixDesignData: {
            dateOfSampling: getDbDateFromDDMMYYYY(dateOfSampling),
            sampleBy: sampleBy,
            conductedBy: mixDesignConductedBy,
            materialCategory: selectedMaterialTypeCategoryData,
            totalQty: totalQty,
            materialsData: materialsData,
          },
        },
      }),
    );
  };

  const renderMixDesign = () => {
    return (
      <View style={styles.mixDesignContainer}>
        <View style={styles.totalQtyContainer}>
          <Text style={styles.inputLabel}>
            Total qty of {selectedMaterialTypeData?.name} in Kg considered for
            composition
          </Text>
          <Input
            value={totalQty}
            style={styles.formInput}
            label=""
            onChange={(value: string) => setTotalQty(value)}
            isRequired={true}
          />
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, {flex: 2}]}>
              Description of Material
            </Text>
            <Text style={[styles.tableHeaderCell, {flex: 3}]}>
              Source of Material
            </Text>
            <Text style={[styles.tableHeaderCell, {flex: 1}]}>Qty in Kg</Text>
          </View>

          {qualityMixDesignFormInfoData?.map((item: any, index: number) => {
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 2}]}>{item.name}</Text>
                <View style={[styles.tableCellDropdown, {flex: 3}]}>
                  <CustomSelectDropdown
                    label=""
                    data={item.sourceApprovals}
                    selectedValue={item.selectedSource}
                    onSelect={(selectedItem: any) =>
                      handleSourceSelect(item, selectedItem)
                    }
                    inputStyle={styles.formInput}
                  />
                </View>
                <View style={[styles.tableCellInput, {flex: 1}]}>
                  <Input
                    label=""
                    value={item.qty}
                    onChange={(value: string) =>
                      handleInputChange(item, value, 'qty')
                    }
                    style={styles.formInput}
                  />
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Recommendation</Text>
          <Input
            value={recommend}
            style={[styles.formInput, styles.textArea]}
            label=""
            onChange={(value: string) => setRecommend(value)}
            isRequired={true}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.recentWorkContainer}>
      <ScrollView>
        <View style={styles.innerScrollView}>
          <View>
            <CalendarPicker
              label="Date of sampling"
              value={dateOfSampling}
              onChange={(value: any) => {
                setDateOfSampling(value);
              }}
              inputStyle={styles.formInput}
            />
            <DropdownPicker
              label="Sampled By"
              items={SAMPLE_BY_LIST}
              value={sampleBy}
              onChange={(value: any) => {
                setSampleBy(value);
              }}
              inputStyle={styles.formInput}
            />
            <DropdownPicker
              label="Conducted By"
              items={TEST_CONDUCTED_BY_LIST}
              value={mixDesignConductedBy}
              onChange={(value: any) => {
                setMixDesignConductedBy(value);
              }}
              inputStyle={styles.formInput}
            />
          </View>

          <CustomSelectDropdown
            label="Test Category"
            data={qualityMasterListing?.testWorkCategoryData}
            selectedValue={selectedTestCategoryData}
            onSelect={handleCategorySelect}
            inputStyle={styles.formInput}
          />
          <CustomSelectDropdown
            label="Mix Design Type"
            data={selectedTestCategoryData?.materialTypeData}
            selectedValue={selectedMaterialTypeData}
            onSelect={handleMixDesignTypeSelect}
            inputStyle={styles.formInput}
          />
          <CustomSelectDropdown
            label="Mix Design Type Category"
            data={selectedMaterialTypeData?.category}
            selectedValue={selectedMaterialTypeCategoryData}
            itemTypeOf="string"
            onSelect={handleMixDesignTypeCateorySelect}
            inputStyle={styles.formInput}
          />
          {qualityMixDesignFormInfoData?.length && renderMixDesign()}
        </View>
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
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height,
  },
  innerScrollView: {
    paddingTop: 15,
  },
  footerButton: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 40,
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnCtaOutline: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#5EAB4B',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
  },
  btnCtaTextOutline: {
    color: '#5EAB4B',
    fontSize: 14,
    fontWeight: '500',
  },
  mixDesignContainer: {
    marginTop: 15,
  },
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  // Reusable style for all input boxes and dropdowns
  formInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  totalQtyContainer: {
    marginBottom: 20,
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
    flex: 1,
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
    flex: 1,
  },
  tableCellDropdown: {
    paddingHorizontal: 5,
    flex: 3,
  },
  tableCellInput: {
    paddingLeft: 5,
    flex: 1,
  },
});

export default MixDesign;
