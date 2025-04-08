import React, { useEffect, useState } from 'react';
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
import { HeaderItems, RFIs_TYPE, SAMPLE_BY_LIST, TEST_CONDUCTED_BY_LIST } from '../../constants/constants';
import CustomSelectDropdown from '../Common/CustomSelectDropdown';
import CalendarPicker from '../../components/UI/CalenderPicker';
import TimePicker from '../../components/UI/TimePicker';
import { useSnackbar } from '../../context/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import LoadingAnimation from '../Common/LoadingAnimation';
import { getQualityMasterList, getMixDesignFormInfo, saveMixDesignFormInfo, clearRFITasksEvent } from '../RFIs/actions';
import appConfig from '../../common/app.config';
import { set } from 'date-fns';
import DropdownPicker from '../../components/UI/DropdownPicker';
import Input from '../../components/UI/Input';
import { getDbDateFromDDMMYYYY } from '../../utils/Utils';

const MixDesign = ({ navigation, route }: { navigation: any, route: any }) => {
  const { height } = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const { showSnackbar } = useSnackbar();
  const focus = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  const [selectedTestCategoryData, setSelectedTestCategoryData] = useState<any>({});
  const [selectedMaterialTypeData, setSelectedMaterialTypeData] =
    useState<any>({});
  const [selectedMaterialTypeCategoryData, setSelectedMaterialTypeCategoryData] =
    useState<any>('');
  const [dateOfSampling, setDateOfSampling] = useState('');
  const [dateOfTesting, setDateOfTesting] = useState('');
  const [totalQty, setTotalQty] = useState('');
  const [sampleBy, setSampleBy] = useState('Concessionaire');
  const [mixDesignConductedBy, setMixDesignConductedBy] = useState('Concessionaire');
  const [qualityMixDesignFormInfoData, setQualityMixDesignFormInfoData]: any = useState(null);
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
      dispatch(getQualityMasterList({ testType: 'mix-design' }));
      setDateOfSampling('');
      setDateOfTesting('');
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
        navigation.navigate("MixDesignList")
      }, 3000)
    }
    if (qualityMixDesignFormInfo) {
      setQualityMixDesignFormInfoData(qualityMixDesignFormInfo);
    }
    if (error) {
      showSnackbar('Unable to saveMix design data');
      console.log('=======ERROR=======', error)
    }
  }, [savedMixDesignFormInfo, qualityMixDesignFormInfo, error]);


  const handleCategorySelect = (selectedOption: any) => {
    setSelectedTestCategoryData({...selectedOption});
    setSelectedMaterialTypeData(null);
    handleFormData(selectedOption);
  };

  const handleMixDesignTypeSelect = (selectedOption: any) => {
    setSelectedMaterialTypeData({...selectedOption});
    setSelectedMaterialTypeCategoryData('');
    // setTimeout(() => {
    //   handleFormData();
    // });
  };

  const handleMixDesignTypeCateorySelect = (selectedOption: any) => {
    setSelectedMaterialTypeCategoryData(selectedOption);
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

    setQualityMixDesignFormInfoData([...qualityMixDesignFormInfoData])
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
        selectedSource: item.selectedSource ? {
          _id: item.selectedSource._id,
          name: item.selectedSource.name
        } : null,
        qty: item.qty,
      });
    });

    console.log('===============', selectedTestCategoryData, selectedMaterialTypeData, selectedMaterialTypeCategoryData);
    if (!selectedTestCategoryData || !selectedMaterialTypeData || !selectedMaterialTypeCategoryData) {
      return;
    }

    // save mix design data
    dispatch(
      saveMixDesignFormInfo({
        projectId: loggedInUser.projectId,
        testWorkCategoryType: selectedTestCategoryData?.type,
        testMaterialId: selectedMaterialTypeData?._id,
        body: {
          name: 'Mix Design', // TODO
          comments: '', // TODO
          mixDesignData: {
            dateOfSampling: getDbDateFromDDMMYYYY(dateOfSampling),
            dateOfTesting: getDbDateFromDDMMYYYY(dateOfTesting),
            sampleBy: sampleBy,
            conductedBy: mixDesignConductedBy,
            materialCategory: selectedMaterialTypeCategoryData,
            totalQty: totalQty,
            materialsData: materialsData,
          }
        }
      }),
    );
  };


  const renderMixDesign = () => {
    return (
      <View style={styles.mixDesignContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Total qty of {selectedMaterialTypeData?.name} in Kg considered for composition
          </Text>
          <View style={styles.inputWrapper}>
            <Input
              value={totalQty}
              style={styles.input}
              label=">0, 3 dec, max limit 10000"
              onChange={(value: string) =>
                setTotalQty(value)
              }
              isRequired={true}
            />
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
              Description of Material
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 3 }]}>
              Source of Material
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Qty in Kg</Text>
          </View>

          {
            qualityMixDesignFormInfoData?.map((item: any, index: number) => {
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
                  <View style={[styles.tableCellDropdown, { flex: 3 }]}>
                    <CustomSelectDropdown
                      label=""
                      data={item.sourceApprovals}
                      selectedValue={item.selectedSource}
                      onSelect={(selectedItem: any) => handleSourceSelect(item, selectedItem)}
                    />
                  </View>
                  <View style={[styles.tableCellInput, { flex: 1 }]}>
                    {/* <TextInput
                      value={item.selectedQty}
                      style={styles.qtyInput}
                      placeholder=">0, 3 dec, max limit 10000"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    /> */}

                    <Input
                      label=""
                      value={item.qty}
                      onChange={(value: string) =>
                        handleInputChange(item, value, 'qty')
                      }
                    />
                  </View>
                </View>
              );
            })

          }
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
            />

            <CalendarPicker
              label="Date of sampling"
              value={dateOfTesting}
              onChange={(value: any) => {
                setDateOfTesting(value);
              }}
            />
            <DropdownPicker
              label="Sampled By"
              items={SAMPLE_BY_LIST}
              value={sampleBy}
              onChange={(value: any) => {
                setSampleBy(value);
              }}
            />
            <DropdownPicker
              label="Conducted By"
              items={TEST_CONDUCTED_BY_LIST}
              value={mixDesignConductedBy}
              onChange={(value: any) => {
                setMixDesignConductedBy(value);
              }}
            />
          </View>

          <CustomSelectDropdown
            label="Test Category"
            data={qualityMasterListing?.testWorkCategoryData}
            selectedValue={selectedTestCategoryData}
            onSelect={handleCategorySelect}
          />
          <CustomSelectDropdown
            label="Mix Design Type"
            data={selectedTestCategoryData?.materialTypeData}
            selectedValue={selectedMaterialTypeData}
            onSelect={handleMixDesignTypeSelect}
          />
          <CustomSelectDropdown
            label="Mix Design Type Category"
            data={selectedMaterialTypeData?.category}
            selectedValue={selectedMaterialTypeCategoryData}
            itemTypeOf="string"
            onSelect={handleMixDesignTypeCateorySelect}
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

export default MixDesign;
