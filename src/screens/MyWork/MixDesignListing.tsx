import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import {
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
  getMixDesignListInfo,
} from '../RFIs/actions';
import appConfig from '../../common/app.config';
import {set} from 'date-fns';
import DropdownPicker from '../../components/UI/DropdownPicker';
import Input from '../../components/UI/Input';
import {getDbDateFromDDMMYYYY} from '../../utils/Utils';

const MixDesignList = ({route}: {route: any}) => {
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
  const [dateOfTesting, setDateOfTesting] = useState('');
  const [totalQty, setTotalQty] = useState('');
  const [sampleBy, setSampleBy] = useState('Concessionaire');
  const [mixDesignConductedBy, setMixDesignConductedBy] =
    useState('Concessionaire');
  const [qualityMixDesignFormInfoData, setQualityMixDesignFormInfoData]: any =
    useState(null);
  const dispatch = useDispatch();

  const {
    savedMixDesignFormInfo,
    qualityMasterListing,
    qualityMixDesignFormInfo,
    loading,
    qualityMixDesignListInfo,
    error,
  } = useSelector((state: any) => state.RFIs);

  useEffect(() => {
    if (focus == true) {
      dispatch(clearRFITasksEvent());
      dispatch(getQualityMasterList({testType: 'mix-design'}));
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
    dispatch(
      getMixDesignListInfo({
        projectId: loggedInUser.projectId,
        testWorkCategoryType: selectedOption.type,
        testMaterialId: selectedMaterialTypeData?._id || 'NA',
      }),
    );
    console.log('==== Info Fetched ===', qualityMixDesignListInfo);
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

  const renderMixDesignList = () => {
    return <View style={styles.mixDesignContainer}></View>;
  };

  return (
    <View style={styles.recentWorkContainer}>
      <ScrollView>
        <View style={styles.innerScrollView}>
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
          {qualityMixDesignFormInfoData?.length && renderMixDesignList()}
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

export default MixDesignList;
