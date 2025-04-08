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
import {RFIs_TYPE, SAMPLE_BY_LIST} from '../../constants/constants';
import CustomSelectDropdown from '../Common/CustomSelectDropdown';
import CalendarPicker from '../../components/UI/CalenderPicker';
import TimePicker from '../../components/UI/TimePicker';
import {useSnackbar} from '../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../Common/LoadingAnimation';
import {Input} from 'react-native-elements';
import {getQualityMasterList, getMixDesignList} from '../RFIs/actions';
import appConfig from '../../common/app.config';
import {set} from 'date-fns';

const MixDesign = ({route}: {route: any}) => {
  const {height} = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const {showSnackbar} = useSnackbar();
  const focus = useIsFocused();

  interface MaterialData {
    testWorkCategoryData?: [];
    materialTypeData?: any[];
    testTypeData?: any[];
    subTestTypes?: any[];
    _id?: any;
    testCategory?: string;
    category?: any[]; // Added category property
    type?: string; // Added type property
  }

  const [labTestDropdownData, setLabTestDropdownData] = useState<MaterialData>(
    {},
  );
  const [selectedValues, setSelectedValues] = useState<MaterialData>({});
  const [selectedMaterialTypeData, setSelectedMaterialTypeData] =
    useState<MaterialData>({});
  const [selectedTestTypeData, setSelectedTestTypeData] =
    useState<MaterialData>({});
  const [selectedSubTestTypeData, setSelectedSubTestTypeData] =
    useState<MaterialData>({});
  const [dateOfSampling, setDateOfSampling] = useState('');
  const [dateOfTesting, setDateOfTesting] = useState('');
  const [sampleBy, setSampleBy] = useState('');
  const [mixDesignConductedBy, setMixDesignConductedBy] = useState('');
  const dispatch = useDispatch();
  const [data, setData] = useState<any>();
  const {
    labTestRfiGenerated,
    qualityMasterListing,
    qualityMixDesignListing,
    loading,
    error,
  } = useSelector((state: any) => state.RFIs);

  //id for url
  const [idCategorySelected, setIdCategorySelected] = useState('');
  const [idTypeSelected, setIdTypeSelected] = useState('');
  useEffect(() => {
    dispatch(getQualityMasterList({testType: 'mix-design'}));
    if (qualityMasterListing?.testWorkCategoryData?.length) {
      setLabTestDropdownData(qualityMasterListing);
    }
    console.log('===Mix-Design====', labTestDropdownData);
  }, [labTestDropdownData]);

  const handleCategorySelect = (selectedOption: any) => {
    setSelectedValues(selectedOption);
    setIdCategorySelected(selectedOption?._id);
    setSelectedMaterialTypeData({});
    setSelectedTestTypeData({});
    setSelectedSubTestTypeData({});

    //console.log('===Mix-Design-Category====', selectedOption);
  };

  const handleMixDesignTypeSelect = (selectedOption: any) => {
    setSelectedMaterialTypeData(selectedOption);
    setIdTypeSelected(selectedOption?._id);
    setSelectedTestTypeData({});
    setSelectedSubTestTypeData({});

    // console.log('===Mix-Design-Type====', selectedOption);
  };

  const handleMixDesignTypeCateorySelect = (selectedOption: any) => {
    setSelectedTestTypeData(selectedOption);
    setSelectedSubTestTypeData({});
    //console.log('===Mix-Design-Type-Category====', selectedOption);
    handleFormData();
  };
  //http://localhost:4000/v1/auth/projects/669ba9f0e3b37a3b66e221ef/test-work-category/sub-base/test-material/67bb73db5fa264d1da3cc824/mix-design-info
  const handleFormData = async () => {
   // let url = `${appConfig.API_URL}/v1/auth/projects/${selectedValues._id}/test-work-category/${selectedValues.type}/test-material/${selectedMaterialTypeData._id}/mix-design-info`;
    dispatch(
      getMixDesignList({
        testWorkCategoryId: selectedValues._id,
        testWorkCategorytype: selectedValues.type,
        materialTypeId: selectedMaterialTypeData._id,
      }),
    );
    //todo
  };
  const renderMixDesign = () => {
    return (
      <View style={styles.mixDesignContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Total qty of DBM/RAP DBM in Kg considered for composition
          </Text>
          <View style={styles.inputWrapper}>
            <Input
              value=""
              style={styles.input}
              placeholder=">0, 3 dec, max limit 10000"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
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

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, {flex: 2}]}>Bitumen</Text>
            <View style={[styles.tableCellDropdown, {flex: 3}]}>
              <CustomSelectDropdown
                label="Source of material"
                data={[]}
                selectedValue=""
                onSelect={() => {}}
              />
            </View>
            <View style={[styles.tableCellInput, {flex: 1}]}>
              <TextInput
                value=""
                style={styles.qtyInput}
                placeholder=">0, 3 dec, max limit 10000"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, {flex: 2}]}>Bitumen</Text>
            <View style={[styles.tableCellDropdown, {flex: 3}]}>
              <CustomSelectDropdown
                label="Source of material"
                data={[]}
                selectedValue=""
                onSelect={() => {}}
              />
            </View>
            <View style={[styles.tableCellInput, {flex: 1}]}>
              <TextInput
                value=""
                style={styles.qtyInput}
                placeholder=">0, 3 dec, max limit 10000"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  const handleInputChange = (value: string) => {};
  const onReset = () => {
    handleCategorySelect({});
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
            <CustomSelectDropdown
              label="Sampled By"
              data={SAMPLE_BY_LIST}
              selectedValue={sampleBy}
              onSelect={(value: any) => {
                setSampleBy(value);
              }}
            />
            <CustomSelectDropdown
              label="Conducted By"
              data={SAMPLE_BY_LIST}
              selectedValue={mixDesignConductedBy}
              onSelect={(value: any) => {
                setMixDesignConductedBy(value);
              }}
            />
          </View>

          <CustomSelectDropdown
            label="Category"
            data={qualityMasterListing?.testWorkCategoryData}
            selectedValue={selectedValues}
            onSelect={handleCategorySelect}
          />
          <CustomSelectDropdown
            label="Mix Design Type"
            data={selectedValues?.materialTypeData}
            selectedValue={selectedMaterialTypeData}
            onSelect={handleMixDesignTypeSelect}
          />
          <CustomSelectDropdown
            label="Mix Design Type Category"
            data={selectedMaterialTypeData?.category}
            selectedValue={selectedTestTypeData}
            onSelect={handleMixDesignTypeCateorySelect}
          />
          {renderMixDesign()}
        </View>
      </ScrollView>
      {!loading && (
        <View style={styles.footerButton}>
          <TouchableOpacity style={styles.btnCtaOutline} onPress={onReset}>
            <Text style={styles.btnCtaTextOutline}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}
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
